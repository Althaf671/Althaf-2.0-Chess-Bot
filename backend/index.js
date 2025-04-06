const express = require("express");
const cors = require("cors");
const Stockfish = require("stockfish");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/move", (req, res) => {
  const { fen, level } = req.body;

  const stockfish = Stockfish(); // WebAssembly engine

  let bestMove = null;

  stockfish.onmessage = (event) => {
    const output = typeof event === "object" ? event.data : event;
    console.log("Stockfish output:", output);

    if (output.includes("bestmove")) {
      bestMove = output.split("bestmove ")[1].split(" ")[0];
      res.json({ bestMove });
    }
  };

  // To run the engine
  stockfish.postMessage("uci");
  stockfish.postMessage("isready");
  stockfish.postMessage(`position fen ${fen}`);
  stockfish.postMessage(`go depth ${level || 15}`);
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});