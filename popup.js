/* globals chrome */

let titleTabsCurrentWindow = [];

function focusTab() {
  chrome.tabs.update(Number(this.dataset.id), {
    active: true
  });
}

function loadListItems(items, regex) {
  const list = document.querySelector('ul#list-search-tab-title-results');
  list.innerHTML = items.map(tab => {
    let { title } = tab;

    if (regex) {
      const matchQuery = tab.title.match(regex)[0];
      title = tab.title.replace(regex, `<span class="matchQuery">${matchQuery}</span>`);
    }

    return `
    <li data-id="${tab.id}" title="${tab.url}"><a href="#">${title}</a></li>
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

  if (inputValue.length !== 0) {
    const regex = new RegExp(inputValue, 'gi');
    const filteredTabs = titleTabsCurrentWindow.filter(tab => regex.test(tab.title));

    loadListItems(filteredTabs, regex);
  } else {
    loadListItems(titleTabsCurrentWindow);
  }
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
