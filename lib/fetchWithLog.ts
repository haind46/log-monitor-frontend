// lib/fetchWithLog.ts

export async function fetchWithLog(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  console.log(`[LOG] 🔁 Gọi API: ${input}`, init);

  try {
    const res = await fetch(input, init);
    console.log(`[LOG] ✅ Kết quả: ${res.status} ${res.statusText}`);

    return res;
  } catch (err) {
    console.error(`[LOG] 💥 Lỗi gọi API: ${input}`, err);
    throw err;
  }
}
