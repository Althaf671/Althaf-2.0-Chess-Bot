// Stockfish engine >;)

export const getBestMove = async (fen, level = 15) => {
  try {
    if (!fen || typeof fen !== "string") {
      throw new Error("FEN string is invalid or missing.");
    }

    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      throw new Error("VITE_API_URL is not defined in environment variables.");
    }

    const response = await fetch(`${apiUrl}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fen, level }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
    }

    const data = await response.json();

    if (!data || !data.bestMove) {
      throw new Error("Best move not found in response.");
    }

    console.log("Best move dari server:", data.bestMove);
    return data.bestMove;
  } catch (error) {
    console.error("Gagal ambil best move:", error.message);
    return null;
  }
};