# sudo docker build . -t livescoreboard_app
# sudo docker run --name=livescoreboard_app -d --rm -p5000:5000 -it livescoreboard_app
FROM node:16

RUN apt update && apt install supervisor -y

RUN mkdir -p /app

WORKDIR /app

COPY app .

# somehow these npm installs are needed cuz fuck you better-sqlite3
RUN npm install node-sass
RUN npm install -g node-gyp

RUN npm install

COPY supervisord.conf /etc/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
