#!/usr/bin/env bash
set -ex

# Handle ctrl+c and interrupts, ensure background processes are killed
trap "exit" INT TERM ERR
trap "kill 0" EXIT

install=false
seed=false
quality=false

announce() {
  echo -e "\n${1}"
}

for opt in "$@"; do
  case ${opt} in
  "-r" | "--reset")
    docker-compose down -v
    announce "Docker containers stopped. Volumes destroyed."
    exit 0
    ;;
  "-q" | "--quality")
    announce "Running quality checks"
    quality=true
    ;;
  "-i" | "--install")
    install=true
    ;;
  "-s" | "--seed")
    seed=true
    ;;
  "--help" | "-h")
    echo -e "\
Usage: run-start.sh [OPTION]
Manages the development environment and runs the web app components.
Options:
-i, --install           (re)installs all project dependencies
-s, --seed              seeds fresh data into your local database
-r, --reset             stops and clears the docker database
-q, --quality           runs the quality suite (lint, test, build etc) on all projects
-h, --help              Show this message
"
    exit 0
    ;;
  esac
done

cd "$(dirname "$0")"
ROOT=$PWD
# makes npm ci not output progress bars
export CI=true

announce "checking node/npm version"
(node -v | grep ^v1[45]) || (announce "Error: node version 14 required" && exit 1)
(npm -v | grep ^[67]) || (announce "Error: npm version 6 required" && exit 1)
announce "node/npm check complete"

announce "checking docker environment"
cd "${ROOT}"
docker-compose up -d

announce "checking mysql server"
while ! netstat -tna | grep 'LISTEN' | grep -q '3309'; do
  announce "waiting for mysql server"
  sleep 1
done
announce "mysql server ready"

announce "docker environment ready"
if ${install}; then
  announce "installing admin api (needed for prisma schema)"
  cd "${ROOT}/admin-api.theverbal.co"
  npm ci --ignore-scripts
fi

cd "${ROOT}"
if ${install}; then
  announce "installing root (husky)"
  npm ci
fi
announce "root installed"

cd "${ROOT}/common"
if ${install}; then
  announce "installing common"
  npm ci --ignore-scripts
fi
announce "starting common"
cd "${ROOT}/common"
npm run build
if ${quality}; then
  npm run lint
else
  npm run start &
fi
announce "common ready"

if ${install}; then
  announce "installing admin ui"
  cd "${ROOT}/admin.theverbal.co"
  npm ci --ignore-scripts
fi

if ${seed}; then
  announce "seeding database"
  cd "${ROOT}/admin-api.theverbal.co"
  npm run migrate:reset
  announce "seeding complete"
fi

cd "${ROOT}/admin-api.theverbal.co"
if ${quality}; then
  npm run lint
  npm run build
  #npm run test
else
  announce "starting api"
  npm run start &
fi

cd "${ROOT}/admin.theverbal.co"
if ${quality}; then
  npm run lint
  npm run build
  #npm run test
else
  announce "starting ui"
  npm run start &
  wait
fi
