#!/usr/bin/env bash


npm install
npm run build
sudo pm2 start npm --name "fairyteller" -- start
npm save