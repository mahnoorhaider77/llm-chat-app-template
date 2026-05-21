export async function storeDocument(env, text, id) {
  // split text into small chunks (simple version)
  const chunks = text.match(/(.|[\r\n]){1,500}/g) || [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const embedding = await env.AI.run(
      "@cf/baai/bge-base-en-v1.5",
      { text: chunk }
    );

    await env.VECTORIZE.upsert([
      {
        id: `${id}-${i}`,
        values: embedding.data[0],
        metadata: {
          text: chunk
        }
      }
    ]);
  }
}
