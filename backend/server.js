// backend/server.js
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/recommend', (req, res) => {
  const movie = req.body.movie;
  if (!movie) return res.status(400).json({ error: "No movie provided" });

  const pythonScript = path.join(__dirname, 'recommend.py');

  exec(`python "${pythonScript}" "${movie}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: "Recommendation error" });
    }
    try {
      const result = JSON.parse(stdout);
      res.json({ recommendations: result });
    } catch (e) {
      res.status(500).json({ error: "Parsing error" });
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
