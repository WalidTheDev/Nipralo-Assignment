const db = require("./../config/db");

// GET /users/:id
const getUserById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(results[0]);
  });
};

// POST /users
const createUser = (req, res) => {

  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: "Name & password required" });

  db.query(
    "INSERT INTO users (name, password) VALUES (?, ?)",
    [name, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error", details: err });
      console.log("working : ")
      res.status(201).json({ message: "User created", id: result.insertId });
    }
  );
};

module.exports = { getUserById, createUser };
