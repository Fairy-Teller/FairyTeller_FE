#!/usr/bin/env bash

cd /home/ubuntu/fe

echo building application...
sudo npm run build

echo starting application...
sudo pm2 start fairyteller -- run production