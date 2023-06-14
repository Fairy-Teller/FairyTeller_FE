#!/usr/bin/env bash


npm install
npm run build
pm2 start npm --name "fairyteller" -- start
npm save