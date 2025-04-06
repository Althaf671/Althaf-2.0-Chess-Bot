const express = require("express");
const cors = require("cors");
const Stockfish = require("stockfish");

const app = express();

// ✅ Izinkan semua origin buat sementara
app.use(cors());
app.use(express.json());

// ✅ Tambahkan preflight response (OPTIONS)
app.options("/move", cors(), (req, res) => {
    res.sendStatus(200); // Kasih response supaya preflight sukses
  });

app.post("/move", (req, res) => {
  const { fen, level } = req.body;

  const stockfish = Stockfish(); // WASM engine

  stockfish.onmessage = (event) => {
    const output = typeof event === "object" ? event.data : event;
    console.log("Stockfish output:", output);

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
  console.log(`🚀 Server is running on port ${PORT}`);
});