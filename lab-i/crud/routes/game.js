const express = require("express");
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const router = express.Router();

const dbPath = path.resolve(__dirname, "..", "data.db");
const db = new DatabaseSync(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS games (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         title TEXT NOT NULL,
                                         platform TEXT NOT NULL,
                                         genre TEXT NOT NULL,
                                         release_year TEXT NOT NULL
    )
`);

router.get("/", (req, res) => {
    const games = db.prepare("SELECT * FROM games").all();
    res.render("games/index", { games });
});

router.get("/create", (req, res) => {
    res.render("games/create");
});

router.post("/create", (req, res) => {
    const { title, platform, genre, release_year } = req.body;

    db.prepare(`
        INSERT INTO games(title, platform, genre, release_year)
        VALUES (?, ?, ?, ?)
    `).run(title, platform, genre, release_year);

    res.redirect("/game");
});

router.get("/:id", (req, res) => {
    const game = db
        .prepare("SELECT * FROM games WHERE id = ?")
        .get(req.params.id);

    res.render("games/show", { game });
});

router.get("/:id/edit", (req, res) => {
    const game = db
        .prepare("SELECT * FROM games WHERE id = ?")
        .get(req.params.id);

    res.render("games/edit", { game });
});

router.post("/:id/edit", (req, res) => {
    const { title, platform, genre, release_year } = req.body;

    db.prepare(`
        UPDATE games
        SET title=?, platform=?, genre=?, release_year=?
        WHERE id=?
    `).run(
        title,
        platform,
        genre,
        release_year,
        req.params.id
    );

    res.redirect("/game");
});

router.post("/:id/delete", (req, res) => {
    db.prepare("DELETE FROM games WHERE id=?")
        .run(req.params.id);

    res.redirect("/game");
});

module.exports = router;