# sudo docker build . -t live-scoreboard
# sudo docker run --name=live-scoreboard -d --rm -p5000:5000 -it live-scoreboard
FROM node:16-bullseye-slim

RUN apt update && apt install supervisor -y

RUN mkdir -p /app

WORKDIR /app

ENV CTFd_TOKEN="TOKEN"
ENV start_date="2000-01-01 00:00:00"
ENV finish_date="2000-01-01 00:00:00"
ENV PORT=5000
ENV CTF_TITLE="TitleCTF"
COPY app .

RUN npm install

COPY supervisord.conf /etc/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
