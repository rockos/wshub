#export PATH="/home/locos/.node/v0.6.18/bin:$PATH"
export NODE_ENV=production
start-stop-daemon -S \
 -p /var/run/snowshoe.pid \
 -d /home/locos/demo/snowshoe/snowshoe \
 -c node
 -m -b \
 -x/home/locos/.node/v0.6.18/bin/node -- ./app.js --applabel snowshoe