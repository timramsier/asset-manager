# stockbase

<img src='demo.png' alt='Demo Image' style='max-width=600px'>

## Overview

**stockbase** is an "in-development" asset management system being designed to be adaptive and easy to use.  It is being designed to track IT assets such as laptops, desktops, and software.

## Usage

### Installation

To install **stockbase** simply clone the repository:

```
git clone git@github.com:timramsier/asset-manager.git
```

### Running

### Docker Compose

If you have Docker Compose installed, you can use the included `runServer.sh`
script.  This will handle the creation of the necessary containers and initialization of a MongoDB solution (via Docker).
```
bash runServer.sh
```

### Local

<div style='border:2px solid #333;padding:5px;border-radius:3px;'>
<h4 style='margin-top:5px'>:exclamation: Important <br></h4>
You will need to have [MongoDB](https://docs.mongodb.com/manual/installation/) installed locally to be able to run this application.
</div>

#### Starting the app

##### Start Database
1. Install MongoDB if you haven't already

1. Start up mongodb by running <br>
  `mongod`

##### Start API Server
1. Install API server dependencies <br>
  `npm install --prefix /path/to/asset_manager/api`

1. Start up the API server <br>
  `npm run start --prefix /path/to/asset_manager/api`

##### Start Front End Server
1. Install Front End dependencies <br>
  `npm install --prefix /path/to/asset_manager/front_end`

1. Build the front_end server
  `npm run build --prefix /path/to/asset_manager/front_end`

1. Start the front end server <br>
  `npm run start --prefix /path/to/asset_manager/front_end`
