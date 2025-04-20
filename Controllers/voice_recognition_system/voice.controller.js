// const commandController = require('./command.controller');
// const mqttService = require('../../services/mqqtService');
// const stringSimilarity = require('string-similarity');

// exports.handleTranscript = async (transcript) => {
//   try {
//     console.log("Transcript received:", transcript);
    
 
//     if (!transcript || typeof transcript !== 'string') {
//       console.error("Error: Transcript is missing or not a string.");
//       return;
//     }
    
//     const commands = await commandController.getCommandsFromDB();
    
//     if (!commands || commands.length === 0) {
//       console.error("Error: No commands found in database.");
//       return;
//     }
    
    
//     const transcriptStr = transcript.toLowerCase();
    

//     const matches = commands.map(cmd => {
//       if (!cmd.commandText || typeof cmd.commandText !== 'string') {
//         console.warn("Warning: Found invalid command commandText in database.");
//         return { command: cmd, similarity: 0 };
//       }
      
//       return {
//         command: cmd,
//         similarity: stringSimilarity.compareTwoStrings(transcriptStr, cmd.commandText.toLowerCase())
//       };
//     });
    

//     const bestMatch = matches.reduce((prev, curr) => (prev.similarity > curr.similarity ? prev : curr));
//     const THRESHOLD = 0.5;
    
//     if (bestMatch.similarity >= THRESHOLD) {
    
//       console.log(`Identified command: ${bestMatch.command.commandText} (similarity: ${bestMatch.similarity})`);
      
//       const feed = bestMatch.command.feed;
//       const payload = bestMatch.command.payload;

//       if (feed && payload) {
//         mqttService.publishToFeed(feed, payload);
//         console.log(`Gửi đến feed ${feed} với payload ${payload}`);
//       } else {
//         console.log("Command không có feed hoặc payload.");
//       }
//     }
//   } catch (err) {
//     console.error("Error in handleTranscript:", err);
//   }
// };

// command.controller.js



// const mqttService = require('../../services/mqqtService');
// const { getSimilarities } = require('../../services/mlServiceClient');
// const commandController = require('./command.controller');
// const feedStates = {};
// const MAX_SPEED = 120;
// const MIN_SPEED = 0;
// exports.handleTranscript = async (transcript) => {
//   try {
//     console.log("Transcript received:", transcript);

//     if (!transcript || typeof transcript !== 'string') {
//       console.error("Error: Transcript is missing or not a string.");
//       return;
//     }

  
//     const commands = await commandController.getCommandsFromDB();
//     if (!commands || commands.length === 0) {
//       console.error("Error: Can not find any commands in database.");
//       return;
//     }

//     let remainingText = transcript.toLowerCase().trim();
//     const THRESHOLD = 0.6;
//     let anyMatched = false;

//     while (remainingText) {
//       remainingText = remainingText.trim();
//       if (!remainingText) break;

//       const literalMatches = commands.map((cmd, idx) => {
//         const phrase = cmd.commandText.toLowerCase();
//         const pos = remainingText.indexOf(phrase);
//         return { idx, phrase, pos };
//       }).filter(m => m.pos >= 0);

//       if (literalMatches.length > 0) {
//         literalMatches.sort((a, b) => a.pos - b.pos);
//         const { idx: matchIdx, phrase, pos } = literalMatches[0];
//         const cmd = commands[matchIdx];
//         anyMatched = true;
//         console.log(`Literal match: "${cmd.commandText}" at position ${pos}`);


//         // const { feed, payload } = cmd;
//         // if (feed && payload) {
//         //   mqttService.publishToFeed(feed, payload);
//         //   console.log(`Published to feed "${feed}" with payload "${payload}"`);
//         // } else {
//         //   console.warn("Command missing feed or payload.");
//         // }
        
//       const { feed, payload, actionType} = cmd;

//       const current = feedStates[feed] ?? 0;
//       let toPublish;
//       console.log(`Current payload for feed "${feed}" is`, current);
//       if (!feed) {
//         console.warn("Command missing feed.");
//         return;
//       }
//       switch (actionType) {
//         case 'onoff':
//           toPublish = Number(payload);
//           break;
//         case 'increase':
//           toPublish = Math.min(current + payload, MAX_SPEED);
//           break;
//         case 'decrease':
//           toPublish = Math.max(current - payload, MIN_SPEED);
//           break;
//         default:
//           console.warn(`Unknown actionType "${actionType}"`);
//           return;
//       }
//       // Cập nhật trạng thái và publish
//       feedStates[feed] = toPublish;
//       mqttService.publishToFeed(feed, String(toPublish));
//       console.log(`Published to feedd"${feed}" with payload "${toPublish}"`);

        


//         remainingText = (remainingText.slice(0, pos) + remainingText.slice(pos + phrase.length)).trim();
//         continue;
//       }

   
//       const ignoreWords = [];
//       if (ignoreWords.includes(remainingText) || remainingText.length < 10) {
//         break;
//       }

//       const cmdTexts = commands.map(c => c.commandText.toLowerCase());
//       const sims = await getSimilarities(remainingText, cmdTexts);

//       let bestIdx = 0;
//       sims.forEach((s, i) => { if (s > sims[bestIdx]) bestIdx = i; });
//       const bestSim = sims[bestIdx];
      
//       if (bestSim < THRESHOLD) break;

//       anyMatched = true;
//       const cmd = commands[bestIdx];
//       console.log(`ML matched command: "${cmd.commandText}" (similarity: ${bestSim.toFixed(2)})`);
    
    
//       // const { feed, payload, } = cmd;
//       // if (feed && payload) {
//       //   mqttService.publishToFeed(feed, payload);
//       //   console.log(`Published to feedd "${feed}" with payload "${payload}"`);
//       // } else {
//       //   console.warn("Command missing feed or payload.");
//       // }

      
  
//       const { feed, payload, actionType} = cmd;

//       const current = feedStates[feed] ?? 0;
//       let toPublish;
//       console.log(`Current payload for feed "${feed}" is`, current);
//       if (!feed) {
//         console.warn("Command missing feed.");
//         return;
//       }
//       switch (actionType) {
//         case 'onoff':
//           toPublish = Number(payload);
//           break;
//         case 'increase':
//           toPublish = Math.min(current + payload, MAX_SPEED);
//           break;
//         case 'decrease':
//           toPublish = Math.max(current - payload, MIN_SPEED);
//           break;
//         default:
//           console.warn(`Unknown actionType "${actionType}"`);
//           return;
//       }
//       // Cập nhật trạng thái và publish
//       feedStates[feed] = toPublish;
//       mqttService.publishToFeed(feed, String(toPublish));
//       console.log(`Published to feedd"${feed}" with payload "${toPublish}"`);


//       const esc = cmd.commandText.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//       const regex = new RegExp(esc, 'i');
//       const newText = remainingText.replace(regex, '').trim();
//       if (newText === remainingText) {
       
//         break;
//       }
//       remainingText = newText;
//     }

//     if (!anyMatched) {
//       console.log("No suitable commands were matched in the transcript.");
//     }
//   } catch (err) {
//     console.error("Error in handleTranscript:", err);
//   }
// };
const mqttService = require('../../services/mqqtService');
const { getSimilarities } = require('../../services/mlServiceClient');
const commandController = require('./command.controller');

const feedStates = {};
const MAX_SPEED = 120;
const MIN_SPEED = 0;

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
    console.log("Transcript received:", transcript);

    if (!transcript || typeof transcript !== 'string') {
      console.error("Error: Transcript is missing or not a string.");
      return;
    }

    const commands = await commandController.getCommandsFromDB();
    if (!commands || commands.length === 0) {
      console.error("Error: Can not find any commands in database.");
      return;
    }

    let remainingText = transcript.toLowerCase().trim();
    const THRESHOLD = 0.5;
    let anyMatched = false;

    while (remainingText) {
      remainingText = remainingText.trim();
      if (!remainingText) break;

      const literalMatches = commands.map((cmd, idx) => {
        const phrase = cmd.commandText.toLowerCase();
        const pos = remainingText.indexOf(phrase);
        return { idx, phrase, pos };
      }).filter(m => m.pos >= 0);

      if (literalMatches.length > 0) {
        literalMatches.sort((a, b) => a.pos - b.pos);
        const { idx: matchIdx, phrase, pos } = literalMatches[0];
        const cmd = commands[matchIdx];
        anyMatched = true;
        console.log(`Literal match: "${cmd.commandText}" at position ${pos}`);
        handleCommand(cmd);

        remainingText = (remainingText.slice(0, pos) + remainingText.slice(pos + phrase.length)).trim();
        continue;
      }

      const ignoreWords = [];
      if (ignoreWords.includes(remainingText) || remainingText.length < 10) {
        break;
      }

      const cmdTexts = commands.map(c => c.commandText.toLowerCase());
      const sims = await getSimilarities(remainingText, cmdTexts);

      let bestIdx = 0;
      sims.forEach((s, i) => { if (s > sims[bestIdx]) bestIdx = i; });
      const bestSim = sims[bestIdx];

      if (bestSim < THRESHOLD) break;

      anyMatched = true;
      const cmd = commands[bestIdx];
      console.log(`ML matched command: "${cmd.commandText}" (similarity: ${bestSim.toFixed(2)})`);
      handleCommand(cmd);

      const esc = cmd.commandText.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(esc, 'i');
      const newText = remainingText.replace(regex, '').trim();

      if (newText === remainingText) break;
      remainingText = newText;
    }

    if (!anyMatched) {
      console.log("No suitable commands were matched in the transcript.");
    }
  } catch (err) {
    console.error("Error in handleTranscript:", err);
  }
};







