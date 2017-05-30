var assets = [
  // Laptops
  {
    name: 'laptops',
    description: 'laptops',
    categoryId: '3h92jf2k',
    models: [
      {
        id: '1',
        vendor: 'Apple',
        name: 'Macbook Pro Retina',
        version: 'mid-2012',
        bgImage: '/public/img/uploads/macbook-pro-retina-2012.jpg',
        description: 'Place a short description here.  Make sure that it is long enough to describe the system',
        active: true,
        specs: [
          {
            id: '9sdh30sa',
            key: 'Screen Size',
            value: '15 in'
          },
          {
            id: '324gd823',
            key: 'Processor',
            value: '2.63 Ghz'
          },
          {
            id: '023nfs2m',
            key: 'Memory',
            value: '16 GB'
          },
          {
            id: 'n9823rns',
            key: 'Hard Drive',
            value: '500GB SSD'
          }
        ],
        assets: [
          {
            tagId: '',
            assignedTo: ''
          }
        ]
      }
    ]
  },
  // Desktops
  {
    name: 'desktops',
    description: 'desktops',
    categoryId: '3k20n2u7',
    models: []
  },
  // Software
  {
    name: 'software',
    description: 'software',
    categoryId: '9wf8g8dc',
    models: []
  },
  // miscellaneous
  {
    name: 'miscellaneous',
    description: 'miscellaneous',
    categoryId: 'fsd023jf',
    models: [
      {
        id: '2',
        vendor: 'Dell',
        name: 'Monitor',
        version: 'UX-1111',
        bgImage: '/public/img/uploads/monitor-dell-u2415.jpg',
        description: '',
        active: true,
        specs: [
          {
            id: 'hfsijv93',
            key: 'Screen Size',
            value: '23in'
          }
        ],
        assets: [
          {
            tagId: '',
            assignedTo: ''
          }
        ]
      }
    ]
  }
]

module.exports = assets
