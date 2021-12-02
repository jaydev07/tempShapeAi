# If using nvm: node, npm and pm2 will not be available in /usr/bin. Run the following commands in host machine to create symlinks:
# nodepath=$(which node); sudo ln -s $nodepath /usr/bin/node
# nodepath=$(which npm); sudo ln -s $nodepath /usr/bin/npm
# nodepath=$(which pm2); sudo ln -s $nodepath /usr/bin/pm2

#install below packages on new machine
#sudo apt install fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6
# libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0
# libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1
# libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release
# wget xdg-utils

set -f
server=$PROD_DEPLOY_SERVER
ssh "ubuntu@${server}" "cd app/packages/backend && git pull && npm i && pm2 restart all"