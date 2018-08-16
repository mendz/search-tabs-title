/* globals chrome */

let titleTabsCurrentWindow = [];

function focusTab() {
  chrome.tabs.update(Number(this.dataset.id), {
    active: true
  });
}

function getSearchFilterType() {
  return Array.from(document.querySelectorAll('div#radio-input-filter input')).find(input => input.checked).dataset.type;
}

function loadListItems(items, regex) {
  const list = document.querySelector('ul#list-search-tab-title-results');
  const checkedFilterType = getSearchFilterType();

  list.innerHTML = items.map(tab => {
    const { title, url } = tab;

    let itemTitle;
    let itemText;

    switch (checkedFilterType) {
    case 'url':
      itemTitle = title;
      itemText = url;
      break;
    default:
      itemTitle = url;
      itemText = title;
      break;
    }

    if (regex) {
      const matchQuery = itemText.match(regex)[0];
      itemText = itemText.replace(regex, `<span class="matchQuery">${matchQuery}</span>`);
    }

    return `
    <li data-id="${tab.id}" title="${itemTitle}">${itemText}</li>
    `;
  }).join('');

  document.querySelectorAll('ul#list-search-tab-title-results li').forEach(item => item.addEventListener('click', focusTab));

  const countItems = items.length;
  document.querySelector('h4#count-items').textContent = countItems;
}

function initListItems() {
  chrome.tabs.query({
    currentWindow: true
  }, tabsArray => {
    const tabsTitles = tabsArray.map(tabWindow => {
      const info = {
        id: tabWindow.id,
        url: tabWindow.url,
        title: tabWindow.title
      };
      return info;
    });

    titleTabsCurrentWindow = tabsTitles;
    loadListItems(tabsTitles);
  });
}

function onChangeInputSearch() {
  const inputValue = this.value;
  const searchFilterType = getSearchFilterType();

  if (inputValue.length !== 0) {
    const regex = new RegExp(inputValue, 'gi');
    const filteredTabs = titleTabsCurrentWindow.filter(tab => regex.test(tab[searchFilterType]));

    loadListItems(filteredTabs, regex);
  } else {
    loadListItems(titleTabsCurrentWindow);
  }
}

function onChangeInputFilterType() {
  const inputEvent = new Event('input', {
    bubbles: true,
    cancelable: true
  });

  const searchInput = document.querySelector('input#search-tab-title');
  searchInput.dispatchEvent(inputEvent);
}

function setInputListener() {
  const input = document.querySelector('input#search-tab-title');
  input.addEventListener('input', onChangeInputSearch);

  input.focus();

  document.querySelectorAll('div#radio-input-filter input').forEach(inputType => inputType.addEventListener('change', onChangeInputFilterType));
}

document.addEventListener('DOMContentLoaded', () => {
  initListItems();
  setInputListener();
});
