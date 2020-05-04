/* globals chrome */

let titleTabsCurrentWindow = [];
const stripHtmlTags = htmlString =>
  htmlString.replace(/(<([^>]+)>)/g, '').replace(/(<|>)/gi, '');

function focusTab(event, id) {
  const idToFocus = id ?? this.dataset.id;
  chrome.tabs.update(Number(idToFocus), {
    active: true,
  });
}

function closeTab(event) {
  event.stopPropagation();
  let currentTabId = -1;
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const currTab = tabs[0];
    if (currTab) {
      currentTabId = currTab.id;
    }
  });
  chrome.tabs.remove(Number(this.dataset.id), () => {
    focusTab(null, currentTabId);
    // eslint-disable-next-line no-use-before-define
    initListItems();
  });
}

function loadListItems(items, regex) {
  const list = document.querySelector('ul.list-search-results');

  list.innerHTML = items
    .map(tab => {
      const { tabIndex, active } = tab;
      let { title: itemTitleText, url: itemUrlText } = tab;

      const activeClass = active ? 'list-search-results__item--active' : '';
      const activeWord = active ? 'Active ' : '';

      itemTitleText = stripHtmlTags(itemTitleText);
      itemUrlText = stripHtmlTags(decodeURI(itemUrlText));

      if (regex) {
        const matchQueryTitle = itemTitleText.match(regex)
          ? itemTitleText.match(regex)[0]
          : itemTitleText;
        const matchQueryUrl = itemUrlText.match(regex)
          ? itemUrlText.match(regex)[0]
          : itemUrlText;
        itemTitleText = itemTitleText.replace(
          regex,
          `<span class="list-search-results__item__match-query">${matchQueryTitle}</span>`
        );
        itemUrlText = itemUrlText.replace(
          regex,
          `<span class="list-search-results__item__match-query">${matchQueryUrl}</span>`
        );
      }

      return `
    <li data-id="${
      tab.id
    }" title="${activeWord}Tab index: ${tabIndex}" class="list-search-results__item ${activeClass}">
      <span class="list-search-results__item__close-button" title="Close Tab" data-id="${
        tab.id
      }">&times;</span>
      <span class="list-search-results__item__text list-search-results__item__title">${itemTitleText}</span>
      <span class="list-search-results__item__text list-search-results__item__url">${itemUrlText}</span>
    </li>
    `;
    })
    .join('');

  document.querySelectorAll('li.list-search-results__item').forEach(item => {
    item.addEventListener('click', focusTab);
    const closeTabItem = item.querySelector(
      'span.list-search-results__item__close-button'
    );
    closeTabItem.addEventListener('click', closeTab);
  });

  const countItems = items.length;
  document.querySelector(
    'h4.input-wrapper__items_count'
  ).textContent = countItems;
}

function initListItems() {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    tabsArray => {
      const tabsTitles = tabsArray.map(tabWindow => {
        const info = {
          id: tabWindow.id,
          url: tabWindow.url,
          title: tabWindow.title,
          tabIndex: tabWindow.index + 1,
          active: tabWindow.active,
        };
        return info;
      });

      titleTabsCurrentWindow = tabsTitles;
      loadListItems(tabsTitles);
    }
  );
}

function onChangeInputSearch() {
  const inputValue = this.value;

  if (inputValue.length !== 0) {
    const regex = new RegExp(inputValue, 'gi');
    const filteredTabsByTitle = titleTabsCurrentWindow.filter(tab =>
      regex.test(tab.title)
    );
    const filteredTabsByUrl = titleTabsCurrentWindow.filter(tab =>
      regex.test(tab.url)
    );

    const setFilteredTabs = Array.from(
      new Set([...filteredTabsByTitle, ...filteredTabsByUrl])
    );
    loadListItems(setFilteredTabs, regex);
  } else {
    loadListItems(titleTabsCurrentWindow);
  }
}

function setInputListener() {
  const input = document.querySelector('input.input-wrapper__input');
  input.addEventListener('input', onChangeInputSearch);

  input.focus();
}

export { initListItems, setInputListener, loadListItems };
