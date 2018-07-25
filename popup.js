/* globals chrome */

let titleTabsCurrentWindow = [];

function focusTab() {
  chrome.tabs.update(Number(this.dataset.id), {
    active: true
  });
}

function loadListItems(items) {
  const list = document.querySelector('ul#list-search-tab-title-results');

  list.innerHTML = items.map(tab => `
    <li data-id="${tab.id}" title="${tab.url}"><a href="#">${tab.title}</a></li>
    `).join('');

  document.querySelectorAll('ul#list-search-tab-title-results li').forEach( item => item.addEventListener('click', focusTab));
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

  const regex = new RegExp(inputValue, 'gi');
  const filteredTabs = titleTabsCurrentWindow.filter( tab => regex.test(tab.title));

  loadListItems(filteredTabs);
}

function setInputListener() {
  const input = document.querySelector('input#search-tab-title');
  input.addEventListener('input', onChangeInputSearch);

  input.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  initListItems();
  setInputListener();
});
