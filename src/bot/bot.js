// Stockfish engine >;)

export const getBestMove = async (fen, level = 15) => {
  try {
    const response = await fetch("http://localhost:5050/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fen, level }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.bestMove) {
      throw new Error("Best move not found in response");
    }

    return data.bestMove; // This is Stockfish's best move
  } catch (error) {
    console.error("Error njir", error);
    return null;
  }
};