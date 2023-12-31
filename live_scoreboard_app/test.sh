# first blood
curl -X POST http://localhost:5000/api/firstblood -H "Content-Type:application/json" -H "Verify-CTFd: TOKEN" -d "{\"team\":\"aaa\",\"user_id\":1,\"team_id\":1,\"user\":\"admin\",\"challenge\":\"test\",\"challenge_slug\":\"test\",\"value\":500,\"solves\":1,\"fsolves\":\"1st\",\"category\":\"test\",\"firstblood\":1,\"date\":\"2023-10-24T15:55:54.123456+00:00\"} " && echo
# scoreboard
curl -X POST localhost:3000/api/scoreboard -H "Content-Type:application/json" -H "Verify-CTFd: TOKEN" -d "{\"1\":{\"team\":\"a\",\"score\":500},\"2\":{\"team\":\"b\",\"score\":200},\"3\":{\"team\":\"c\",\"score\":200},\"4\":{\"team\":\"d\",\"score\":100}}" && echo
#solve
curl -X POST http://localhost:5000/api/solve -H "Content-Type:application/json" -H "Verify-CTFd: TOKEN" -d "{\"team\":\"5\",\"user_id\":1,\"team_id\":1,\"user\":\"admin\",\"challenge\":\"test\",\"challenge_slug\":\"test\",\"value\":500,\"solves\":1,\"fsolves\":\"1st\",\"category\":\"test\",\"firstblood\":0,\"date\":\"2023-10-26T10:00:54.123456+00:00\"} " && echo
