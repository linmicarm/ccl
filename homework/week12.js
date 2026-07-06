const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json());

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "backend-db",
  user: "postgres",
  password: "postgres",
});

// GET /genres — list all genres
app.get("/genres", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM genres ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /directors — list all directors
app.get("/directors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM directors ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /movies — all movies with director & genre names
app.get("/movies", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        movies.id,
        movies.title,
        directors.name AS director,
        genres.name AS genre,
        movies.release_year,
        movies.is_watched
      FROM movies
      JOIN directors ON movies.director_id = directors.id
      JOIN genres ON movies.genre_id = genres.id
      ORDER BY movies.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /movies/all — alias for /movies (all movies with names)
app.get("/movies/all", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        movies.id,
        movies.title,
        directors.name AS director,
        genres.name AS genre,
        movies.release_year,
        movies.is_watched
      FROM movies
      JOIN directors ON movies.director_id = directors.id
      JOIN genres ON movies.genre_id = genres.id
      ORDER BY movies.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /movies/watched — only watched, newest first
app.get("/movies/watched", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        movies.id,
        movies.title,
        directors.name AS director,
        genres.name AS genre,
        movies.release_year,
        movies.is_watched
      FROM movies
      JOIN directors ON movies.director_id = directors.id
      JOIN genres ON movies.genre_id = genres.id
      WHERE movies.is_watched = true
      ORDER BY movies.release_year DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// SEARCH /movies/search?title=... — case-insensitive partial title match
app.get("/movies/search", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Title query parameter is required" });
    }
    const result = await pool.query(`
      SELECT
        movies.id,
        movies.title,
        directors.name AS director,
        genres.name AS genre,
        movies.release_year,
        movies.is_watched
      FROM movies
      JOIN directors ON movies.director_id = directors.id
      JOIN genres ON movies.genre_id = genres.id
      WHERE movies.title ILIKE $1
      ORDER BY movies.id
    `, [`%${title}%`]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No movies found" });
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /movies/genre/:genre — filter by genre NAME, sorted by title
app.get("/movies/genre/:genre", async (req, res) => {
  try {
    const { genre } = req.params;
    const result = await pool.query(`
      SELECT
        movies.id,
        movies.title,
        directors.name AS director,
        genres.name AS genre,
        movies.release_year,
        movies.is_watched
      FROM movies
      JOIN directors ON movies.director_id = directors.id
      JOIN genres ON movies.genre_id = genres.id
      WHERE genres.name ILIKE $1
      ORDER BY movies.title ASC
    `, [genre]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No movies found in that genre" });
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /movies/:id — single movie by id
app.get("/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(`
      SELECT
        movies.id,
        movies.title,
        directors.name AS director,
        genres.name AS genre,
        movies.release_year,
        movies.is_watched
      FROM movies
      JOIN directors ON movies.director_id = directors.id
      JOIN genres ON movies.genre_id = genres.id
      WHERE movies.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /movies — add a movie. Requires title, director_id, genre_id.
app.post("/movies", async (req, res) => {
  try {
    const { title, director_id, genre_id, release_year, is_watched } = req.body;

    if (!title || !director_id || !genre_id) {
      return res.status(400).json({ message: "Title, director_id, and genre_id are required" });
    }

    const result = await pool.query(
      `INSERT INTO movies (title, director_id, genre_id, release_year, is_watched)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, director_id, genre_id, release_year, is_watched ?? false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /movies/:id — update is_watched
app.put("/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { is_watched } = req.body;

    if (typeof is_watched !== "boolean") {
      return res.status(400).json({ message: "is_watched must be true or false" });
    }

    const result = await pool.query(
      "UPDATE movies SET is_watched = $1 WHERE id = $2 RETURNING *",
      [is_watched, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /movies/:id
app.delete("/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json({ message: "Movie deleted", movie: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
