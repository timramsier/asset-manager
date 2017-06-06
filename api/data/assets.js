var assets = [
  // Laptops
  {
    name: 'Laptops',
    description: 'laptops',
    label: 'laptops',
    config: {
      faIcon: 'laptop',
      color: '#ff3333',
      api: 'show',
      fallbackImage: '/public/img/laptop.png'
    }
  },
  // Desktops
  {
    name: 'Desktops',
    description: 'desktops',
    label: 'desktops',
    config: {
      faIcon: 'desktop',
      color: '#ff8533',
      api: 'show',
      fallbackImage: '/public/img/desktop.png'
    }
  },
  // Software
  {
    name: 'Software',
    description: 'software',
    label: 'software',
    config: {
      faIcon: 'floppy-o',
      color: '#ffd633',
      api: 'show',
      fallbackImage: '/public/img/floppy.png'
    }
  },
  // miscellaneous
  {
    name: 'Miscellaneous',
    description: 'miscellaneous',
    label: 'miscellaneous',
    config: {
      faIcon: 'folder-open-o',
      color: '#5cd65c',
      api: 'show',
      fallbackImage: '/public/img/folder.png'
    }
  }
]

module.exports = assets
