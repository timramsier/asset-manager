const faker = require('faker')
const imageCategories = [
  'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife',
  'fashion', 'people', 'nature', 'sports', 'technics', 'transport'
]
const _coinFlip = () => {
  return (Math.floor(Math.random() * 2) === 0)
}

const _guid = () => {
  return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1)
}

const _asset = (count) => {
  var returnData = []
  for (let i = 0; i < count; i++) {
    let newData = {
      id: _guid(),
      vendor: faker.company.companyName(),
      name: faker.commerce.productName(),
      version: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      active: _coinFlip(),
      image: faker.image.technics,
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
      ]
    }
    returnData.push(newData)
  }
  return returnData
}

const _assetForDb = (count) => {
  var returnData = []
  for (let i = 0; i < count; i++) {
    let newData = {
      vendor: faker.company.companyName(),
      name: faker.commerce.productName(),
      version: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      active: _coinFlip(),
      image: `http://lorempixel.com/640/480/${imageCategories[Math.round(Math.random() * 12)]}/${Math.ceil(Math.random() * 10)}/`,
      specs: [
        {
          key: faker.lorem.word(),
          value: faker.lorem.word()
        },
        {
          key: faker.lorem.word(),
          value: faker.lorem.word()
        },
        {
          key: faker.lorem.word(),
          value: faker.lorem.word()
        },
        {
          key: faker.lorem.word(),
          value: faker.lorem.word()
        },
        {
          key: faker.lorem.word(),
          value: faker.lorem.word()
        }
      ]
    }
    returnData.push(newData)
  }
  return returnData
}
const publicApi = {
  asset: _asset,
  assetForDb: _assetForDb
}

module.exports = publicApi
