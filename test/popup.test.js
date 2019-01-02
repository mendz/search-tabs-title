const rewire = require('rewire');
const faker = require('faker');

// jest.mock('../popup.js');
const popupJs = rewire('../popup.js');
const loadListItems = popupJs.__get__('loadListItems');


describe('load list items', () => {
   it('should load items from parameter and populate DOM ', () => {

      document.body.innerHTML = `
      <h1 id="main-title">Search Your Tab</h1>
      <div id="main-container">
        <div id="input-container">
          <input id="search-tab-title" name="search-tab-title" type="search" placeholder="Insert title/URL" />
          <h4 id="count-items" title="Search item count"></h4>
        </div>
        <ul id="list-search-tab-title-results"></ul>
      </div>
      `;

      const items = [
         {
            id: faker.random.uuid(),
            url: faker.internet.url(),
            title: faker.lorem.words(),
            tabIndex: faker.random.number({ min: 1, max: 30 }) + 1,
            active: true
         },
         {
            id: faker.random.uuid(),
            url: faker.internet.url(),
            title: faker.lorem.words(),
            tabIndex: faker.random.number({ min: 1, max: 30 }) + 1,
            active: false
         }
      ];

      loadListItems(items);

      //   const list = document.querySelector('ul#list-search-tab-title-results');

      expect( document.querySelector('ul#list-search-tab-title-results li').length).toEqual(2);


   });
});