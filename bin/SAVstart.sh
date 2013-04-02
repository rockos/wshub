#export PATH="/home/locos/.node/v0.6.18/bin:$PATH"
export PATH  "/home/msyaono/.node/v0.8.14/bin/node:$PATH"
export NODE_ENV=production
start-stop-daemon -S \
 -p /var/run/snowshoe.pid \
 -d /home/msyaono/project/snowshoe \
 -c node \ 
 -m -b \
 -x /home/msyaono/.node/v0.8.14/bin/node .-- ./snowshoe.js --applabel snowshoe
