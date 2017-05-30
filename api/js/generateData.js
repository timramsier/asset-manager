const faker = require('faker')

const _coinFlip = () => {
  return (Math.floor(Math.random() * 2) === 0)
}

const _guid = () => {
  return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1)
}

const _assets = (count) => {
  var returnData = []
  for (let i = 0; i < count; i++) {
    let newData = {
      id: _guid(),
      vendor: faker.company.companyName(),
      name: faker.commerce.productName(),
      version: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      active: _coinFlip(),
      specs: [
        {
          id: _guid(),
          key: faker.lorem.word(),
          value: faker.lorem.word()
        },
        {
          id: _guid(),
          key: faker.lorem.word(),
          value: faker.lorem.word()
        },
        {
          id: _guid(),
          key: faker.lorem.word(),
          value: faker.lorem.word()
        },
        {
          id: _guid(),
          key: faker.lorem.word(),
          value: faker.lorem.word()
        },
        {
          id: _guid(),
          key: faker.lorem.word(),
          value: faker.lorem.word()
        }
      ],
      assets: [
        {}
      ]
    }
    returnData.push(newData)
  }
  return returnData
}
const publicApi = {
  assets: _assets
}

module.exports = publicApi
