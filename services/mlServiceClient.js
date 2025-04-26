// const axios = require('axios');

// const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// async function getSimilarities(transcript, cmdTexts) {
//   const response = await axios.post(
//     `${ML_SERVICE_URL}/similarity`,
//     { transcript, commands: cmdTexts }
//   );
//   return response.data.similarities;
// }

// module.exports = { getSimilarities };

const axios = require('axios');
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Gửi transcript và danh sách commands đến ML service,
 * trả về mảng similarity tính theo cùng thứ tự commands.
 *
  @param {string} transcript  Chuỗi text đã chuyển từ giọng nói.
  @param {string[]} commands  Mảng các commandText từ DB.
  @returns {Promise<number[]>}  Mảng điểm similarity [0.82, 0.10, …].
 */
async function getSimilarities(transcript, commands) {
  try {
    // console.log("🧪 Gọi ML_SERVICE_URL:", ML_SERVICE_URL);

    // const { data } = await axios.post(
    //   `${ML_SERVICE_URL}/similarity`,
    //   { transcript, commands }

    // );
    const { data } = await axios.post(
      `${ML_SERVICE_URL}/similarity`,
      { transcript, commands }
    );

    return Array.isArray(data.similarities) ? data.similarities : [];
  } catch (err) {
    console.error('Error calling ML service:', err.message);
    if (err.response) {
      console.error("Response error:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("No response received from ML service.");
    } else {
      console.error("Unexpected error:", err);
    }
    return commands.map(() => 0);
    }
}

module.exports = { getSimilarities };
