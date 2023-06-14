#!/usr/bin/env bash

cd /home/ubuntu/fe

npm start
pm2 start npm --name "fairyteller" -- start
pm2 startup
pm2 save
pm2 restart all