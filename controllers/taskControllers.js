const db = require("./../config/db");


const createTask = (req, res) => {
  const { title, description, user_id } = req.body;
  const status = "pending" ;

  if (!title || !user_id) {
    return res.status(400).json({ error: "title and user_id are required" });
  }

  
  db.query("SELECT id FROM users WHERE id = ?", [user_id], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    if (result.length === 0) return res.status(404).json({ error: "User not found" });

    db.query(
      "INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)",
      [title, description || null, status || "pending", user_id],
      (err, taskResult) => {
        if (err) return res.status(500).json({ error: "DB error", details: err });
        res.status(201).json({ message: "Task created", id: taskResult.insertId });
      }
    );
  });
};

const getTasks = (req, res) => {
  const { userId, status, page = 1, limit = 10 } = req.query;

  let query = "SELECT * FROM tasks WHERE 1=1";
  console.log(`if not given ${page}  ${limit} `)
  const params = [];

  if (userId) {
    query += " AND user_id = ?";
    params.push(userId);
  }

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  const offset = (page - 1) * limit;
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    res.json({ page: Number(page), limit: Number(limit), tasks: results });
  });
};


const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  db.query(
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
    [title, description, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error", details: err });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Task not found" });
      res.json({ message: "Task updated" });
    }
  );
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM tasks WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  });
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
