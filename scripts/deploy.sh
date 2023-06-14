#!/usr/bin/env bash


sudo npm install
sudo npm run build
sudo pm2 start npm --name "fairyteller" -- start
sudo npm save