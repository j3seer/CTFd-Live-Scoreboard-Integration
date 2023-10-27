import requests
import re
from collections import defaultdict
from CTFd.utils.scores import get_standings, get_team_standings
from flask import request
from flask.wrappers import Response
from CTFd.utils.dates import ctftime
from CTFd.models import Challenges, Solves
from CTFd.utils import config as ctfd_config
from CTFd.utils.user import get_current_team, get_current_user
from functools import wraps
from urllib.parse import quote
from CTFd.utils.dates import isoformat
from CTFd.schemas.submissions import SubmissionSchema
from CTFd.models import Fails, Teams, Tracking, Users, db

ordinal = lambda n: "%d%s" % (n,"tsnrhtdd"[(n // 10 % 10 != 1) * (n % 10 < 4) * n % 10 :: 4],)
sanreg = re.compile(r'(~|!|@|#|\$|%|\^|&|\*|\(|\)|\_|\+|\`|-|=|\[|\]|;|\'|,|\.|\/|\{|\}|\||:|"|<|>|\?)')
sanitize = lambda m: sanreg.sub(r"\1", m)
# link to your webhook for live scoreboard
WEBHOOK="http://localhost:5000"
# token used for auth
TOKEN="TOKEN"
# limit
LIMIT = 0
def send(url, data):
    r = requests.post(url,data=str(data).replace("'", '"'),headers={"Content-Type": "application/json", "Verify-CTFd": TOKEN},)


def clean_dict(input_dict):
    cleaned_dict = {}
    for key, value in input_dict.items():
        if None in value:
            team = next(iter(value - {None}))
            score = next(iter(value - {None, team}))
            cleaned_dict[key] = {"team": team, "score": score}
        else:
            continue
    return cleaned_dict


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
                if (
                    isinstance(data, dict)
                    and data.get("success") == True
                    and isinstance(data.get("data"), dict)
                    and data.get("data").get("status") == "correct"
                ):
                    if request.content_type != "application/json":
                        request_data = request.form
                    else:
                        request_data = request.get_json()
                    challenge_id = request_data.get("challenge_id")
                    challenge = Challenges.query.filter_by(
                        id=challenge_id
                    ).first_or_404()
                    solvers = Solves.query.filter_by(challenge_id=challenge.id)
                    if TEAMS_MODE:
                        solvers = solvers.filter(Solves.team.has(hidden=False))
                    else:
                        solvers = solvers.filter(Solves.user.has(hidden=False))
                    num_solves = solvers.count()

                    if int(LIMIT) > 0 and num_solves > int(LIMIT):
                        return result

                    user = get_current_user()
                    team = get_current_team()

                    # if number of solves is currently 1 means the team who just solved first blooded it!
                    if num_solves - 1 == 0:
                        firstblood = 1
                    else:
                        firstblood = 0

                    solve_details = {
                        "team": sanitize("" if team is None else team.name),
                        "user_id": user.id,
                        "team_id": 0 if team is None else team.id,
                        "user": sanitize(user.name),
                        "challenge": sanitize(challenge.name),
                        "challenge_slug": quote(challenge.name),
                        "value": challenge.value,
                        "solves": num_solves,
                        "fsolves": ordinal(num_solves),
                        "category": sanitize(challenge.category),
                        "date": get_last_solve(team.id)[1],
                        "firstblood": firstblood,
                    }

                    score = get_team_standings()

                    clean_score = [(a, c, d) for a, _, c, d in score]

                    # convert to json
                    # scoreboard comes listed in the correct order, first team in json is 1st place..etc
                    score_result = {}
                    i = 0

                    for team_id, team_name, score in clean_score:
                        i += 1
                        last_solve_challenge, last_solve_date = get_last_solve(team_id)
                        num_solves = get_num_solves(team_id)
                        if not num_solves != "0":
                            num_solves = "0"
                        score_result[str(i)] = {
                            "team": sanitize(team_name),
                            "score": score,
                            "num_solves": num_solves,
                            "team_id": team_id,
                            "latest_solve": last_solve_challenge,
                            "date": last_solve_date,
                        }

                    # send solve
                    send(WEBHOOK + "/api/solve", solve_details)
                    # send scoreboard
                    send(WEBHOOK + "/api/scoreboard", score_result)
                    # send blood
                    if firstblood:
                        send(WEBHOOK + "/api/firstblood", solve_details)

            return result

        return wrapper

    def get_num_solves(team_id):
        team = Teams.query.filter_by(id=team_id).first_or_404()
        solves = team.get_solves(team.id)
        schema = SubmissionSchema(view="user", many=True)
        num_solves = str(len(schema.dump(solves).data))
        return num_solves

    def get_last_solve(team_id):
        team = Teams.query.filter_by(id=team_id).first_or_404()
        solves = team.get_solves(team.id)
        schema = SubmissionSchema(view="user", many=True)
        team_solves = schema.dump(solves)
        date_of_last_solve = team_solves.data[0]["date"]
        challenge_id = team_solves.data[0]["challenge_id"]
        challenge = Challenges.query.filter_by(id=challenge_id).first_or_404()
        return challenge.name, date_of_last_solve

    app.view_functions["api.challenges_challenge_attempt"] = challenge_attempt_decorator(app.view_functions["api.challenges_challenge_attempt"])


