#!/usr/bin/env bash

cd /home/ubuntu/fe

rm -rf node_modules
npm install
npm run build
pm2 start npm --name "fairyteller" -- start
npm save