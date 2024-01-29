import requests
import re
import json
from collections import defaultdict
from CTFd.utils.scores import get_standings, get_team_standings
from flask import request
from flask.wrappers import Response
from CTFd.utils.dates import ctftime
from CTFd.models import Challenges, Solves, Teams, Submissions
from CTFd.utils import config as ctfd_config
from CTFd.utils.user import get_current_team, get_current_user,get_current_team_attrs
from functools import wraps
from urllib.parse import quote
from CTFd.utils.dates import isoformat
from CTFd.models import Teams
from .conf import WEBHOOK,TOKEN

sanreg = re.compile(r'(~|!|@|#|\$|%|\^|&|\*|\(|\)|\_|\+|\`|-|=|\[|\]|;|\'|,|\.|\/|\{|\}|\||:|"|<|>|\?)')
sanitize = lambda m: sanreg.sub(r"\1", m)

def send(url, data):
    d = json.dumps(data)
    print(d)
    requests.post(url,data=d,headers={"Content-Type": "application/json", "Verify-CTFd": TOKEN})

def load(app):
    TEAMS_MODE = ctfd_config.is_teams_mode()
    if WEBHOOK:
        try:
            requests.get(WEBHOOK)
        except:
            print("\n***LIVESCOREBOARD WARNING:WEBHOOK NOT WORKING! Plugin disabled***\n")
            return
    else:
        print("\n***LIVESCOREBOARD WARNING:WEBHOOK NOT SET! Plugin disabled***\n")
        return

    def challenge_attempt_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            result = f(*args, **kwargs)
            if not ctftime():
                return result
            if isinstance(result, Response):
                data = result.json
                if (isinstance(data, dict) and data.get("success") == True and isinstance(data.get("data"), dict)and data.get("data").get("status") == "correct"):
                    if request.content_type != "application/json":
                        request_data = request.form
                    else:
                        request_data = request.get_json()

                    first_blood = 0 
                    challenge_id = request_data.get("challenge_id")
                    challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()
                    # get all solves for that challenge
                    solvers = Solves.query.filter_by(challenge_id=challenge.id)
                    
                    if TEAMS_MODE: 
                        solvers = solvers.filter(Solves.team.has(hidden=False))
                    
                    # if solve count for the challenge is 1 => firstblooded
                    # check if first blood
                    num_solves_chall = solvers.count()
                    if num_solves_chall - 1 == 0: 
                        first_blood = 1
            
                    # get team / user details
                    team = get_current_team()
                    user = get_current_user()

                    # if team hidden dont send anything
                    if team.hidden:
                        return result
                    
                    # get current submission
                    submission = Solves.query.filter_by(account_id=user.account_id, challenge_id=challenge_id).first()
                    solve_details = [{
                        "team": sanitize("" if team is None else team.name),
                        "user": sanitize(user.name),
                        "challenge": sanitize(challenge.name),
                        "first_blood": first_blood,
                        "date": str(submission.date)
                    }]
                    

                    score = get_team_standings()
                    score_result = format_scoreboard(score)

                    # send solve
                    send(WEBHOOK + "/api/solve", solve_details)
                    # send scoreboard
                    send(WEBHOOK + "/api/scoreboard", score_result)


            return result
        return wrapper

    def format_scoreboard(data):
        scoreboard = []
        for index, item in enumerate(data):
            team = Teams.query.filter_by(name=item[2]).first()
            solves = team.get_solves()
            team_score = {
                "team": sanitize(item[2]),
                "score": item[3],
                "num_solves": len(solves)
            }
            scoreboard.append(team_score)

        return scoreboard

    app.view_functions["api.challenges_challenge_attempt"] = challenge_attempt_decorator(app.view_functions["api.challenges_challenge_attempt"])