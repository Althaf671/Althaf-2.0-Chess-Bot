const express = require("express");
const cors = require("cors");
const Stockfish = require("stockfish");

const app = express();

// ✅ Global CORS untuk semua route dan semua method
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ✅ Preflight handler (biar OPTIONS gak error 405)
app.options("*", cors());

// ✅ Log semua request biar tahu kenapa ditolak
app.use((req, res, next) => {
  console.log("🔥 Incoming:", req.method, req.path);
  next();
});

app.post("/move", (req, res) => {
  const { fen, level } = req.body;

  const stockfish = Stockfish();

  stockfish.onmessage = (event) => {
    const output = typeof event === "object" ? event.data : event;
    console.log("🧠 Stockfish output:", output);

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

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
});