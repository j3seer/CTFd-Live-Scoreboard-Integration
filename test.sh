# simulation of when a solve is detected
curl -X POST http://localhost:5000/api/solve -H "Content-Type:application/json" -H "Verify-CTFd: TOKEN" -d "[{\"team\":\"a\",\"user\":\"a\",\"challenge\":\"test\",\"first_blood\":0,\"date\":\"2000-01-01T00:00:00Z\"}]" && echo
curl -X POST http://localhost:5000/api/scoreboard -H "Content-Type:application/json" -H "Verify-CTFd: TOKEN" -d "[{\"team\":\"a\",\"score\":500,\"num_solves\":2},{\"team\":\"b\",\"score\":250,\"num_solves\":1},{\"team\":\"c\",\"score\":100,\"num_solves\":1}]" && echo

sleep 3

# simulation of when a solve with firstblood 1
curl -X POST http://localhost:5000/api/solve -H "Content-Type:application/json" -H "Verify-CTFd: TOKEN" -d "[{\"team\":\"a\",\"user\":\"a\",\"challenge\":\"test\",\"first_blood\":1,\"date\":\"2000-01-01T00:00:00Z\"}]" && echo
curl -X POST http://localhost:5000/api/scoreboard -H "Content-Type:application/json" -H "Verify-CTFd: TOKEN" -d "[{\"team\":\"a\",\"score\":500,\"num_solves\":3},{\"team\":\"b\",\"score\":250,\"num_solves\":1},{\"team\":\"c\",\"score\":100,\"num_solves\":1}]" && echo

