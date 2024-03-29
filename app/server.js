"use strict";

const express = require("express");
const { Pool } = require("pg");

const NODE_PORT = 1010;
const HOST = "0.0.0.0";

const pool = new Pool();
pool.connect();

const app = express();
console.log(`Running on http://${HOST}:${NODE_PORT}`);

// API

app.get("/api/article/:id", (req, res) => {
  const { id } = req.params;
  if (!isNaN(parseInt(id))) {
    pool
      .query("SELECT * FROM articles WHERE id = $1", [id])
      .then(data => {
        res.send(data.rows.length > 0 && data.rows[0]);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(500);
  }
});

app.get("/api/articlesNames", (req, res) => {
  pool
    .query("SELECT id, title FROM articles")
    .then(data => {
      res.send(data.rows);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

// ROUTING

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

app.get("/assets/style.css", (req, res) => {
  res.sendFile(__dirname + "/src/assets/style.css");
});

app.get("/assets/logo.png", (req, res) => {
  res.sendFile(__dirname + "/src/assets/logo.png");
});

app.get("/assets/autocomplete.js", (req, res) => {
  res.sendFile(__dirname + "/src/assets/autocomplete.js");
});

module.exports = app.listen(NODE_PORT, () => {
  console.log("Listening on port", NODE_PORT);
});
