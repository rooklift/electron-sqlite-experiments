"use strict";

const fs = require("fs");
const sql = require("better-sqlite3");

const ADDITION_BATCH_SIZE = 47;
const ADDITIONS = 200000;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

if (fs.existsSync("test.db")) {
	fs.unlinkSync("test.db");
}

let db = sql("test.db");

let create_table = db.prepare(
	`CREATE TABLE Games (
		relpath   text,
		dyer      text,
		movecount int,
		SZ        int,
		HA        int,
		PB        text,
		PW        text,
		BR        text,
		WR        text,
		RE        text,
		DT        text,
		EV        text,
		RO        text)`
);
create_table.run();

function random_int(max) {
	return Math.floor(Math.random() * max);
}

function random_string(size) {
	let arr = [];
	for (let n = 0; n < size; n++) {
		let c = CHARS[random_int(52)];
		arr.push(c);
	}
	return arr.join("");
}

function new_update_object() {
	return {
		relpath:   random_string(50),
		dyer:      random_string(12),
		movecount: random_int(360),
		SZ:        19,
		HA:        0,
		PB:        random_string(random_int(10) + 10),
		PW:        random_string(random_int(10) + 10),
		BR:        random_string(3),
		WR:        random_string(3),
		RE:        random_string(5),
		DT:        random_string(10),
		EV:        random_string(random_int(10) + 10),
		RO:        random_string(10),
	};
}

let insert_statement = db.prepare(`
	INSERT INTO Games (
		relpath, dyer, movecount, SZ, HA, PB, PW, BR, WR, RE, DT, EV, RO
	) VALUES (
		@relpath, @dyer, @movecount, @SZ, @HA, @PB, @PW, @BR, @WR, @RE, @DT, @EV, @RO
	)
`);

function continue_work(n) {
	if (n >= ADDITIONS) {
		return;
	}
	let add_new = db.transaction(() => {
		for (let i = 0; i < ADDITION_BATCH_SIZE; i++) {
			insert_statement.run(new_update_object());
		}
	});
	add_new();
	document.getElementById("para").innerHTML = `${n}`;
	setTimeout(() => {
		continue_work(n + ADDITION_BATCH_SIZE);
	}, 5);
}

continue_work(0);
