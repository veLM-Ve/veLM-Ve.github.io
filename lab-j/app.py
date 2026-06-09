import sqlite3
from flask import Flask, render_template, request, redirect, url_for, abort

app = Flask(__name__)
DATABASE = "data.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS game (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            platform TEXT NOT NULL,
            genre TEXT NOT NULL,
            release_year INTEGER
        )
    """)
    conn.commit()
    conn.close()


@app.route("/")
def index():
    conn = get_db()
    games = conn.execute("SELECT * FROM game ORDER BY id DESC").fetchall()
    conn.close()

    return render_template("list.html", games=games)


@app.route("/game/<int:id>")
def show(id):
    conn = get_db()
    game = conn.execute("SELECT * FROM game WHERE id = ?", (id,)).fetchone()
    conn.close()

    if game is None:
        abort(404)

    return render_template("show.html", game=game)


@app.route("/game/create", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        title = request.form["title"]
        platform = request.form["platform"]
        genre = request.form["genre"]
        release_year = request.form["release_year"]

        conn = get_db()
        conn.execute(
            "INSERT INTO game (title, platform, genre, release_year) VALUES (?, ?, ?, ?)",
            (title, platform, genre, release_year)
        )
        conn.commit()
        conn.close()

        return redirect(url_for("index"))

    return render_template("create.html")


@app.route("/game/<int:id>/edit", methods=["GET", "POST"])
def edit(id):
    conn = get_db()
    game = conn.execute("SELECT * FROM game WHERE id = ?", (id,)).fetchone()

    if game is None:
        conn.close()
        abort(404)

    if request.method == "POST":
        title = request.form["title"]
        platform = request.form["platform"]
        genre = request.form["genre"]
        release_year = request.form["release_year"]

        conn.execute(
            """
            UPDATE game
            SET title = ?, platform = ?, genre = ?, release_year = ?
            WHERE id = ?
            """,
            (title, platform, genre, release_year, id)
        )
        conn.commit()
        conn.close()

        return redirect(url_for("index"))

    conn.close()
    return render_template("edit.html", game=game)


@app.route("/game/<int:id>/delete", methods=["POST"])
def delete(id):
    conn = get_db()
    conn.execute("DELETE FROM game WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return redirect(url_for("index"))


if __name__ == "__main__":
    init_db()
    app.run(port=57735, debug=True)