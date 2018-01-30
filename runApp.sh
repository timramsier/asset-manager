#!/bin/bash

trap ctrl_c INT

function ctrl_c() {
  printf '\e[94m  ==> Shutting down application...\e[0m\n'
  docker-compose down
}

# check if --dev is flagged
if [[ $* == *--dev* ]]
  then
    # finalCMD=("printf Navigate to the \e[1m./front_end\e[34m and run \e[1mnpm APP_DATABASE_API_KEY=not-secure-api-key run watch\e[34m")
    finalCMD=("docker-compose logs -f")
    file=docker-compose.dev.yml
    message="Watching changes to application files"
  else
    finalCMD=("docker-compose logs -f")
    file=docker-compose.yml
    message="Watching the Docker Compose logs"
fi

if [[ $* == *--build* ]]
  then
    preMessage="TRUE"
    preCMD=("docker-compose build")
  else
    preMessage="FALSE"
    preCMD=("printf '...\n'")
fi

printf '\e[34m==========Initializing \e[1mstockbase\e[0m\e[34m application==========\e[0m\n'
printf '\e[94m  ==> Create App Data directory...\e[0m\n'
mkdir -p ~/app-data/asset-manager/db

printf '\e[94m  ==> Running Docker Compose...\e[0m\n' \
  && printf "\e[94m  ==> Building images (${preMessage})...\e[0m\n" \
  && $preCMD \
  && docker-compose -f $file up -d \
  && printf "\e[94m  ==> ${message}...\e[0m\n" \
  && $finalCMD
