const Database = require('better-sqlite3');
const logger = require('./logger')
const fs = require('fs')
const path = require('path')
const init_sql = fs.readFileSync(path.join(__dirname, './db/init.sql')).toString();

const db = new Database('./db/scoreboard.db',{ verbose: console.log })

module.exports = {
	get_scoreboard() {
		const query = `SELECT json_group_array(json_object('id',id, 'team', team, 'num_solves', num_solves,'num_bloods', num_bloods, 'score', score))
					 AS result FROM scoreboard; `;
		const rows = db.prepare(query).get()
		return rows.result;
	},
	getbloodcountperteam(team){
		const query = `SELECT COUNT(*) AS count FROM solve_activity WHERE team=? AND first_blood=1;`;
		const rows = db.prepare(query).get(team)
		return rows.count
	},
	update_scoreboard(scoreboard) {

		db.prepare(`DELETE FROM scoreboard;`).run()

		let query = "INSERT OR REPLACE INTO scoreboard (id, team, num_solves, num_bloods, score) VALUES (?,?,?,?,?);"
		let stmt = db.prepare(query)
		for (pos in scoreboard) {
			id = pos
			team = scoreboard[id]['team']
			num_bloods = module.exports.getbloodcountperteam(team)
			num_solves = scoreboard[id]['num_solves']
			score = scoreboard[id]['score'].toString()
			stmt.run(id, team, num_solves, num_bloods, score)
		}
	},
	get_solves() {
		const query = `SELECT json_group_array(json_object('team', 
        team, 'user',user, 'challenge', challenge,'first_blood',first_blood, 'date',date)) AS result FROM solve_activity;`;
		const rows = db.prepare(query).get()
		return rows.result;
	},
	add_solve(solve) {
		for (let key in solve) {
			team = solve[key].team
			user = solve[key].user
			challenge = solve[key].challenge
			first_blood = solve[key].first_blood
			date = solve[key].date
			const dateObject = new Date(date);
			  
			const year = dateObject.getUTCFullYear();
			const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
			const day = String(dateObject.getUTCDate()).padStart(2, '0');
			const hour = String(dateObject.getUTCHours()).padStart(2, '0');
			const minute = String(dateObject.getUTCMinutes()).padStart(2, '0');
			const second = String(dateObject.getUTCSeconds()).padStart(2, '0');
			const millisecond = String(dateObject.getUTCMilliseconds()).padStart(2, '0');
			const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
			  
			const query = `INSERT INTO solve_activity (team, user,  challenge, first_blood, date) VALUES (?,?,?,?,?);`;
			const rows = db.prepare(query).run(team, user, challenge, first_blood, formattedDate)
		}
	},
	addblood(team){
		const query = `UPDATE scoreboard SET num_bloods = num_bloods + 1 WHERE team=?` 
		//const query = `SELECT * FROM scoreboard s JOIN solve_activity sa ON s.team = sa.team AND sa.first_blood = 1;`;
		const rows = db.prepare(query).run(team)
	},
	login(token){
		const query = `SELECT token FROM tokens WHERE token=?` 
		const result = db.prepare(query).get(token)
		return result
	},
	init() {
		try {
			// initialize db structure
			db.exec(init_sql)
			// add admin token for dashboard
			admin_token = process.env.admin_token || 'admin_token_to_change'
			const query = `INSERT INTO tokens (token) VALUES (?);`
			db.prepare(query).run(admin_token)
			
		} catch (e) {
			logger.error(e)
		}
	}

}