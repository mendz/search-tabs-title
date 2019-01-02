// TODO: for testing will remove this file

const faker = require('faker');


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

console.log(JSON.stringify(items, null, 2));