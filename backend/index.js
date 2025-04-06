const express = require("express");
const cors = require("cors");
const Stockfish = require("stockfish");

const app = express();

// ✅ CORS untuk semua route
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Parsing JSON
app.use(express.json());

// ✅ Handle preflight agar OPTIONS gak error 405
app.options("*", cors());

// ✅ Logging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// ✅ Endpoint utama
app.post("/move", (req, res) => {
  const { fen, level } = req.body;

  if (!fen) {
    return res.status(400).json({ error: "FEN is required." });
  }

  const stockfish = Stockfish();

  stockfish.onmessage = (event) => {
    const output = typeof event === "object" ? event.data : event;
    console.log("Stockfish Output:", output);

    if (output.includes("bestmove")) {
      const bestMove = output.split("bestmove ")[1].split(" ")[0];
      res.json({ bestMove });
    }
  };

  stockfish.postMessage("uci");
  stockfish.postMessage("isready");
  stockfish.postMessage(`position fen ${fen}`);
  stockfish.postMessage(`go depth ${level || 15}`);
});

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});