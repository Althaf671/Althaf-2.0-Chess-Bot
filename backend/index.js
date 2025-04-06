const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

// ✅ Setup CORS biar preflight aman
app.use(cors({
  origin: "*", // Ubah ke domain Vercel kalau mau secure
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ✅ Jawab semua OPTIONS biar preflight ga error 405
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// ✅ Endpoint untuk hitung best move
app.post("/move", (req, res) => {
  const { fen, level } = req.body;
  const stockfish = spawn("stockfish");

  stockfish.stdin.write("uci\n");
  stockfish.stdin.write("isready\n");
  stockfish.stdin.write(`position fen ${fen}\n`);
  stockfish.stdin.write(`go depth ${level || 15}\n`);

  stockfish.stdout.on("data", (data) => {
    const output = data.toString();
    console.log("Stockfish output:", output);

    if (output.includes("bestmove")) {
      const bestMove = output.split("bestmove ")[1].split(" ")[0];
      res.json({ bestMove });
      stockfish.kill();
    }
  });

  stockfish.stderr.on("data", (data) => {
    console.error("Stockfish Error:", data.toString());
  });

  stockfish.on("close", (code) => {
    console.log(`Stockfish exited with code ${code}`);
  });
});

// ✅ Port
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});