/* globals chrome */

let titleTabsCurrentWindow = [];
const stripHtmlTags = htmlString => htmlString.replace(/(<([^>]+)>)/g, '').replace(/(<|>)/gi,'');

function focusTab() {
  chrome.tabs.update(Number(this.dataset.id), {
    active: true,
  });
}

function loadListItems(items, regex) {
  const list = document.querySelector('ul#list-search-tab-title-results');

  list.innerHTML = items
    .map(tab => {
      const { tabIndex, active } = tab;
      let { title: itemTitleText, url: itemUrlText } = tab;

      const activeClass = active ? 'class="active-tab-item"' : '';
      const activeWord = active ? 'Active ' : '';

      itemTitleText = stripHtmlTags(itemTitleText);
      itemUrlText = stripHtmlTags(decodeURI(itemUrlText));

      if (regex) {
        const matchQueryTitle = itemTitleText.match(regex) ? itemTitleText.match(regex)[0] : itemTitleText;
        const matchQueryUrl = itemUrlText.match(regex) ? itemUrlText.match(regex)[0] : itemUrlText;
        itemTitleText = itemTitleText.replace(regex, `<span class="matchQuery">${matchQueryTitle}</span>`);
        itemUrlText = itemUrlText.replace(regex, `<span class="matchQuery">${matchQueryUrl}</span>`);
      }

      return `
    <li data-id="${tab.id}" title="${activeWord}Tab index: ${tabIndex}" ${activeClass}><span class="item-title-text">${itemTitleText}</span><span class="item-url-text">${itemUrlText}</span></li>
    `;
    })
    .join('');

  document.querySelectorAll('ul#list-search-tab-title-results li').forEach(item => item.addEventListener('click', focusTab));

  const countItems = items.length;
  document.querySelector('h4#count-items').textContent = countItems;
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
          active: tabWindow.active
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
    const filteredTabsByTitle = titleTabsCurrentWindow.filter(tab => regex.test(tab.title));
    const filteredTabsByUrl = titleTabsCurrentWindow.filter(tab => regex.test(tab.url));

    const setFilteredTabs = Array.from(new Set([...filteredTabsByTitle, ...filteredTabsByUrl]));
    loadListItems(setFilteredTabs, regex);
  } else {
    loadListItems(titleTabsCurrentWindow);
  }
}

function setInputListener() {
  const input = document.querySelector('input#search-tab-title');
  input.addEventListener('input', onChangeInputSearch);

  input.focus();
}

export {
  initListItems,
  setInputListener,
  loadListItems
};