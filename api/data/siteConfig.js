const config = {
  config: {
    categories: [{
      id: '3h92jf2k',
      name: 'laptops',
      label: 'Laptops',
      faIcon: 'laptop',
      color: '#ff3333',
      api: 'show',
      fallbackImage: '/public/img/laptop.png'
    }, {
      id: '3k20n2u7',
      name: 'desktops',
      label: 'Desktops',
      faIcon: 'desktop',
      color: '#ff8533',
      api: 'show',
      fallbackImage: '/public/img/desktop.png'
    }, {
      id: '9wf8g8dc',
      name: 'software',
      label: 'Software',
      faIcon: 'floppy-o',
      color: '#ffd633',
      api: 'show',
      fallbackImage: '/public/img/floppy.png'
    }, {
      id: 'fsd023jf',
      name: 'miscellaneous',
      label: 'Miscellaneous',
      faIcon: 'folder-open-o',
      color: '#5cd65c',
      api: 'show',
      fallbackImage: '/public/img/folder.png'
    }],
    menuOptions: [{
      id: '298hgdf9',
      name: 'users',
      label: 'Users',
      faIcon: 'user-o',
      color: '#33adff',
      api: 'admin'
    }, {
      id: '328jf8df',
      name: 'reports',
      label: 'reports',
      faIcon: 'bar-chart',
      color: '#ad33ff',
      api: 'admin'
    }]
  }
}

module.exports = config
