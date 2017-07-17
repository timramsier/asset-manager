#!/bin/bash

trap ctrl_c INT

function ctrl_c() {
  printf '\e[94m  ==> Shutting down application...\e[0m\n'
  docker-compose down
}

printf '\e[34m==========Initializing \e[1mstockbase\e[0m\e[34m application==========\e[0m\n'
printf '\e[94m  ==> Create App Data directory...\e[0m\n'
mkdir -p ~/app-data/asset-manager/db
printf '\e[94m  ==> Running Docker Compose...\e[0m\n'
docker-compose up -d

sleep 10

printf '\e[94m  ==> Opening http://localhost in browser...\e[0m\n'
open http://localhost

printf '\e[94m  ==> Running Watching the Docker Compose logs...\e[0m\n'
docker-compose logs -f
