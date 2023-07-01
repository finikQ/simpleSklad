export async function setWbApiKey(req, db) {
  try {
    const apiKey = await req.body.apikey;
    await db.run(`
    INSERT OR REPLACE INTO api_keys (id, api_key)
    VALUES (1, '${apiKey}');
    `);
    console.log("API key успешно сохранен");
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    throw error;
  }
}
