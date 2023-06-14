#!/usr/bin/env bash

cd /home/ubuntu/fe

# Build the application
#npm run build

echo starting application...
sudo pm2 start npm --name "fairyteller" -- start