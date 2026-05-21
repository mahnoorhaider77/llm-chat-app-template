// src/rag.js

export async function getRelevantContext(env, question) {
  // 1. Create embedding for user question
  const embedding = await env.AI.run(
    "@cf/baai/bge-base-en-v1.5",
    {
      text: question
    }
  );

  const vector = embedding.data[0];

  // 2. Search similar docs in Vectorize
  const results = await env.VECTORIZE.query(vector, {
    topK: 3,
    returnMetadata: true
  });

  // 3. Extract text context
  const context = results.matches
    .map(item => item.metadata?.text)
    .filter(Boolean)
    .join("\n");

  return context;
}
