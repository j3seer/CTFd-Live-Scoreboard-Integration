# Simple live scoreboard for CTFd

<video width="630" height="300" src="https://github.com/j3seer/CTFd-Live-Scoreboard-Integration/assets/58823465/fca72329-42ee-46f3-b562-ab8a90af2fa7"></video>

This is a live scoreboard integration project with ctfd, which includes two things:

- a ctfd plugin for live updates
- a nodejs based app hosting the livescoreboard

**NB**: this only works on team based CTFd instances

# Formatting

These are the formats in which the plugin sends the data to the scoreboard

```bash
--scoreboard--
{"1":{"team":"x","score":500}}

--firstblood--
{"team":"x","user_id":1,"team_id":1,"user":"admin","challenge":"test","challenge_slug":"test","value":500,"solves":1,"fsolves":"1st","category":"test","firstblood":1}

--solve--
{\"team\":\"5\",\"user_id\":1,\"team_id\":1,\"user\":\"admin\",\"challenge\":\"test\",\"challenge_slug\":\"test\",\"value\":500,\"solves\":1,\"fsolves\":\"1st\",\"category\":\"test\",\"firstblood\":0,\"date\":\"2023-10-26T10:00:54.123456+00:00\"} 

```

# Running

Before running both  the plugin and the livescoreboard app you need to modify:

- Dockerfile

To run the ctfd plugin:

1- mv livescoreboard_plugin into the plugins folder

2- Run CTFd and check the logs, watch out for these errors, they indicate if the plugin is working or not

```
***LIVESCOREBOARD WARNING:WEBHOOK NOT WORKING! Plugin disabled***

***LIVESCOREBOARD WARNING:WEBHOOK NOT SET! Plugin disabled***
```

To run the live app:

```bash
sudo docker build . -t live-scoreboard
sudo docker run --name=live-scoreboard -d --rm -p5000:5000 -it live-scoreboard
```
# TODO 
[ ] Add DB instead of files

[ ] Docker compose file with db volume to not loose data

[ ] better sanitization on team names

[ ] improve json format to be more readable and more detailed

[ ] improve ui

[ ] flexible html and css (theme based)

# Test

There's also a test.sh script to check if your Node app is working correctly

# Bugs 

Please report bugs to me directly via email j3seer@proton.me
