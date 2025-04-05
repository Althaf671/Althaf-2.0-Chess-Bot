const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/move", (req, res) => {
    const { fen, level } = req.body;

    const stockfish = spawn("stockfish");

    // To send commands to Stockfish Engine
    stockfish.stdin.write("uci\n");
    stockfish.stdin.write("isready\n");
    stockfish.stdin.write(`position fen ${fen}\n`);
    stockfish.stdin.write(`go depth ${level || 15}\n`);

    // To receive respond from Stockfish Engine
    stockfish.stdout.on("data", (data) => {
        const output = data.toString();
        console.log("Stockfish output:", output); // Debug log

        if (output.includes("bestmove")) {
            const bestMove = output.split("bestmove ")[1].split(" ")[0];
            res.json({ bestMove });
            stockfish.kill();
        }
    });

    // To handle error from Stockfish Engine
    stockfish.stderr.on("data", (data) => {
        console.error("Error:", data.toString());
    });

    // Log saat Stockfish keluar
    stockfish.on("close", (code) => {
        console.log(`Stockfish exited with code ${code}`);
    });
});

// Jalankan server di port 5050
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});