import faker from 'faker';
import { loadListItems } from '../extension-code/popupFunctions';

describe('load list items', () => {
  document.body.innerHTML = `
   <h1 class="main-title">Search Your Tab</h1>
   <div class="main-container">
      <div class="input-wrapper">
         <input class="input-wrapper__input" name="search-tab-title" type="search" placeholder="Insert title/URL" />
         <h4 class="input-wrapper__items_count" title="Search item count"></h4>
      </div>
      <ul class="list-search-results"></ul>
   </div>
   `;

  const items = [
    {
      id: faker.random.uuid(),
      url: faker.internet.url(),
      title: faker.lorem.words(),
      tabIndex: faker.random.number({ min: 1, max: 30 }) + 1,
      active: true,
    },
    {
      id: faker.random.uuid(),
      url: faker.internet.url(),
      title: faker.lorem.words(),
      tabIndex: faker.random.number({ min: 1, max: 30 }) + 1,
      active: false,
    },
  ];

  loadListItems(items);

  it('should load items from parameter and populate DOM', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(document.querySelector('li.list-search-results__item')).toBeTruthy;
    expect(
      document.querySelectorAll('li.list-search-results__item').length
    ).toEqual(2);
  });

  it('should update header count items', () => {
    expect(
      document.querySelector('h4.input-wrapper__items_count').textContent
    ).toEqual('2');
  });
});
