# Live Scoreboard Integration with CTFd

<video width="630" height="300" src="https://github.com/j3seer/CTFd-Live-Scoreboard-Integration/assets/58823465/4665282f-f5e4-4977-a8b0-4f6f503e6a10"></video>

This is a live scoreboard integration project with ctfd, which includes two things:

- a CTFd plugin for live updates (solves & first bloods)
- a nodejs based app hosting the livescoreboard

> [!WARNING]
> This project currently supports **ONLY team mode** based CTFd instances

The plugin is originally from sigpwny and heavily modified to fit this project.

Feel free to check it out 

https://github.com/sigpwny/ctfd-discord-webhook-plugin

# Why?

Simply put, this project would mainly be used for on-site CTFs where solves and first bloods will be displayed in a big screen or projector.

# Formatting

These are the formats in which the plugin sends the data to the scoreboard

- Scoreboard

```json
[
    {
        "team":"a",
        "score":500,
        "num_solves":2
    },
    {
        "team":"b",
        "score":250,
        "num_solves":1
    },
    {
        "team":"c",
        "score":100,
        "num_solves":1
    }
]
```

- Solve
```json
[
    {
        "team":"a",
        "user":"a",
        "challenge":"test",
        "first_blood":0,
        "date":"2000-01-01T10:00:00Z"
    }
]
```

> [!NOTE]
> The date format used is the same in CTFd

# Installation

Before installing anything you need to modify the following variables:

## docker-compose.yml
```dockerfile
...
    environment:
      - CTFd_TOKEN="TOKEN"
      - start_date="2000-01-01 00:00:00"
      - finish_date="2000-01-01 00:00:00"
      - CTF_TITLE="TitleCTF"
      # used for dashboard login
      - admin_token="admin_token_to_change"
      # needed for socket io to work correctly
      - DOMAIN="localhost"
      - PORT="5000"
      # set to true if domain running on HTTPS
      # needed for cookie flag "secure"
      - HTTPS="false"  
...
```

## conf.py
```python
# link to your webhook for live scoreboard
WEBHOOK="http://localhost:5000"
# token used for auth
TOKEN="TOKEN"
```

> [!NOTE]
> Please note when setting the webhook, make sure to include the external ip or domain of the scoreboard app since CTFd by default won't have access to local docker containers such as the livescoreboard_app container, unless you change the networking in CTFd.

Installation is made easy with a bash script (install.sh) that will:

1- Move the plugin to the plugins folder

2- Start livescoreboard App using docker compose

3- Start CTFd

Running install.sh
```bash
./install.sh "~/CTFd/"
```
> [!NOTE]
> Check CTFd logs and watch out for these errors to indicate if the livescoreboard app is reachable to CTFd 

```
***LIVESCOREBOARD WARNING:WEBHOOK NOT WORKING! Plugin disabled***

***LIVESCOREBOARD WARNING:WEBHOOK NOT SET! Plugin disabled***
```

# TODO 
- [x] Add DB instead of files

- [x] add dashboard for management

- [ ] add send scoreboard every 5 minutes (in case something breaks it'll be resent automatically in 5 min) + send scoreboard with each solve (current)

- [x] add DB local backup
    
- [x] Docker compose with volumes

- [x] better sanitization on team names

- [x] improve json format to be more readable and more detailed

- [x] improve ui

- [x] add number of firstbloods per team to UI

- [ ] flexible html and css (theme based)

- [ ] add send to discord webhook

# Bugs 

Please report bugs to me directly on discord @j3seer
