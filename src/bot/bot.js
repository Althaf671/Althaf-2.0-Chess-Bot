// Stockfish engine >;)

export const getBestMove = async (fen, level = 15) => {
  try {
    // ✅ Validasi FEN input
    if (!fen || typeof fen !== "string") {
      throw new Error("FEN string is invalid or missing.");
    }

    // ✅ Ambil API URL dari env
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throw new Error("VITE_API_URL is not defined in environment variables.");
    }

    const response = await fetch(`${apiUrl}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Kamu bisa tambahin Authorization token di sini kalau nanti pakai auth
        // Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ fen, level }),
    });

    // ✅ Cek HTTP status
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
    }

    // ✅ Parse JSON dengan validasi lebih aman
    const data = await response.json();

    if (!data || typeof data.bestMove !== "string") {
      throw new Error("Best move not found or invalid in response.");
    }

    console.log("✅ Best move dari server:", data.bestMove);
    return data.bestMove;
  } catch (error) {
    console.error("❌ Gagal ambil best move:", error.message);
    return null;
  }
};