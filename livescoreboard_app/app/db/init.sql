DROP TABLE IF EXISTS score;

CREATE TABLE IF NOT EXISTS scoreboard (
        id           INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
        team         VARCHAR(255) NOT NULL,
        num_solves   INTEGER DEFAULT 0,
        num_bloods   INTEGER DEFAULT 0,
        score        VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS solve_activity (
        id           INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
        team         VARCHAR(255) NOT NULL,
        user         VARCHAR(255),
        challenge    VARCHAR(255),
        first_blood  BOOLEAN DEFAULT 0,
        date         VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tokens (
        id           INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
        token         VARCHAR(255) NOT NULL
);

