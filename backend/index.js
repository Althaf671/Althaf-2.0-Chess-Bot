const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

const corsOptions = {
  origin: "*", // ganti ke domain frontend kalau perlu
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.post("/move", (req, res) => {
  const { fen, level } = req.body;

  if (!fen) {
    return res.status(400).json({ error: "FEN string required" });
  }

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
    console.error("Stockfish error:", data.toString());
  });

  stockfish.on("close", (code) => {
    console.log(`Stockfish process exited with code ${code}`);
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});