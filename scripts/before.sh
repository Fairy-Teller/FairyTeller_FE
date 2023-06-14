#!/usr/bin/env bash

cd /home/ubuntu/fe

sudo pm2 delete fairyteller

sudo rm -rf node_modules
sudo rm package-lock.json