// Stockfish engine 🧠🔥

export const getBestMove = async (fen, level = 15) => {
  try {
    // ✅ Validasi FEN
    if (!fen || typeof fen !== "string" || fen.trim() === "") {
      throw new Error("FEN string is invalid or missing.");
    }

    // ✅ Ambil URL dari .env
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throw new Error("VITE_API_URL is not defined in environment variables.");
    }

    // ✅ Timeout (abort fetch kalau kelamaan)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 detik timeout

    const response = await fetch(`${apiUrl}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`, // nanti kalau pakai token
      },
      body: JSON.stringify({ fen, level }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // ✅ Handle HTTP error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // ✅ Validasi respons backend
    if (!data || typeof data.bestMove !== "string") {
      throw new Error("Best move not found in the response.");
    }

    console.log("✅ Best move dari server:", data.bestMove);
    return data.bestMove;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("❌ Request timeout: Server terlalu lama membalas.");
    } else {
      console.error("❌ Gagal ambil best move:", error.message);
    }

    return null;
  }
};