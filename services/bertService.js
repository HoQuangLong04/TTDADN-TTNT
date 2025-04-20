// // services/bertService.js
// const { pipeline } = require('@xenova/transformers');

// let embeddingPipeline = null;

// // Load BERT model 1 lần
// async function loadModel() {
//   if (!embeddingPipeline) {
//     console.log(" Loading BERT model...");
//     embeddingPipeline = await pipeline('feature-extraction', 'Xenova/distiluse-base-multilingual-cased');
//     console.log(" BERT model loaded.");
//   }
//   return embeddingPipeline;
// }

// // Tính cosine similarity giữa 2 vectors
// function cosineSimilarity(vecA, vecB) {
//   const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//   const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//   const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//   return dot / (magA * magB);
// }

// // Nhận embedding vector từ 1 câu
// async function getSentenceVector(sentence) {
//   const model = await loadModel();
//   const [embedding] = await model(sentence.toLowerCase());
//   return embedding[0]; // lấy vector đầu tiên của câu
// }

// module.exports = {
//   getSentenceVector,
//   cosineSimilarity
// };
// services/bertService.js








const { pipeline } = require('@xenova/transformers');

let embeddingPipeline = null;

// Load BERT model 1 lần
async function loadModel() {
  if (!embeddingPipeline) {
    console.log(" Loading BERT model...");
    // Sử dụng mô hình tiếng Việt `vinai/phobert-base`
    embeddingPipeline = await pipeline('feature-extraction', 'vinai/phobert-base');
    console.log(" BERT model loaded.");
  }
  return embeddingPipeline;
}

// Tính cosine similarity giữa 2 vectors
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

// Nhận embedding vector từ 1 câu
async function getSentenceVector(sentence) {
  const model = await loadModel();
  const [embedding] = await model(sentence.toLowerCase());
  return embedding[0]; // lấy vector đầu tiên của câu
}

module.exports = {
  getSentenceVector,
  cosineSimilarity
};
