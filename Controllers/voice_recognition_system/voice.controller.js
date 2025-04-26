const mqttService = require('../../services/mqqtService');
const { getSimilarities } = require('../../services/mlServiceClient');
const commandController = require('./command.controller');


const feedStates = {};
const MAX_SPEED = 120;
const MIN_SPEED = 0;


// Đây là hàm sẽ xử lý việc gởi dữ liệu lên các kênh feed. 
function handleCommand(cmd) {
  const { feed, payload, actionType } = cmd;

  if (!feed) {
    console.warn("Command missing feed.");
    return;
  }

  const current = feedStates[feed] ?? 0;
  let toPublish;
  console.log(`Current payload for feed "${feed}" is`, current);

  switch (actionType) {
    case 'onoff':
      toPublish = Number(payload);
      break;
    case 'increase':
      toPublish = Math.min(current + Number(payload), MAX_SPEED);
      break;
    case 'decrease':
      toPublish = Math.max(current - Number(payload), MIN_SPEED);
      break;
    default:
      console.warn(`Unknown actionType "${actionType}"`);
      return;
  }

  feedStates[feed] = toPublish;
  mqttService.publishToFeed(feed, String(toPublish));
  console.log(`Published to feed "${feed}" with payload "${toPublish}"`);
}




exports.handleTranscript = async (transcript) => {
  try {
    if (!transcript || typeof transcript !== 'string') {
      console.error("Transcript is missing or not a string.");
      return;
    }
    //  Lấy danh sách commands từ database
    const commands = await commandController.getCommandsFromDB();
    if (!commands || commands.length === 0) {
      console.error("Cannot find any commands in database.");
      return;
    }
    // Đưa đọan script nhận đc về chữ thường và xóa khaongr trắng ở hai đầuđầu 
    let remainingText = transcript.toLowerCase().trim();
    // hai câu mà có tỷ lệ lớn hơn cái này thì đc tính là giống nhau 
    const THRESHOLD = 0.6;
    let anyMatched = false;
    // Lấy tất cả câu lệnh và dò qua cả câu để tìm 
    while (true) {
      const words = remainingText.split(/\s+/);
      if (words.length === 0) break;

      let bestMatch = null;

      for (let idx = 0; idx < commands.length; idx++) {
        const cmdText = commands[idx].commandText.toLowerCase();
        const cmdWords = cmdText.split(/\s+/);
        const baseLen = cmdWords.length;
        
        for (let windowLen = baseLen; windowLen <= baseLen + 1; windowLen++) {
          if (words.length < windowLen) continue;
          for (let start = 0; start <= words.length - windowLen; start++) {
            const segment = words.slice(start, start + windowLen).join(' ');
            const sim = (await getSimilarities(segment, [cmdText]))[0];
            if (sim >= THRESHOLD && (!bestMatch || sim > bestMatch.sim)) {
              bestMatch = { idx, sim, start, end: start + windowLen };
            }
          }
        }
      }

      if (!bestMatch) break;

      const cmd = commands[bestMatch.idx];
      anyMatched = true;
      handleCommand(cmd);

      const wordsLeft = words.slice(0, bestMatch.start)
        .concat(words.slice(bestMatch.end));
      remainingText = wordsLeft.join(' ').trim();
    }

    if (!anyMatched) {
    }
  } catch (err) {
    console.error("Error in handleTranscript:", err);
  }
};








