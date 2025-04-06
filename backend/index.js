const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

// ✅ Middleware CORS fix (buat preflight & client)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ✅ Preflight OPTIONS handler
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// ✅ POST /move
app.post("/move", (req, res) => {
  const { fen, level } = req.body;

  if (!fen || typeof fen !== "string") {
    return res.status(400).json({ error: "Invalid or missing FEN string." });
  }

  const stockfish = spawn("stockfish");
  let bestMove = null;

  stockfish.stdin.write("uci\n");
  stockfish.stdin.write("isready\n");
  stockfish.stdin.write(`position fen ${fen}\n`);
  stockfish.stdin.write(`go depth ${level || 15}\n`);

  stockfish.stdout.on("data", (data) => {
    const output = data.toString();
    console.log("Stockfish output:", output);

    if (output.includes("bestmove")) {
      bestMove = output.split("bestmove ")[1].split(" ")[0];
      res.json({ bestMove });
      stockfish.kill();
    }
  });

  stockfish.stderr.on("data", (data) => {
    console.error("Stockfish error:", data.toString());
  });

  stockfish.on("close", (code) => {
    console.log(`Stockfish exited with code ${code}`);
  });
});

// ✅ Port setup
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});