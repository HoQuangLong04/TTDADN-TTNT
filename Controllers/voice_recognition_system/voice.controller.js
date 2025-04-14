const commandController = require('./command.controller');
const mqttService = require('../../services/mqqtService');
const stringSimilarity = require('string-similarity');

exports.handleTranscript = async (transcript) => {
  try {
    console.log("Transcript received:", transcript);
    
 
    if (!transcript || typeof transcript !== 'string') {
      console.error("Error: Transcript is missing or not a string.");
      return;
    }
    
    const commands = await commandController.getCommandsFromDB();
    
    if (!commands || commands.length === 0) {
      console.error("Error: No commands found in database.");
      return;
    }
    
    
    const transcriptStr = transcript.toLowerCase();
    

    const matches = commands.map(cmd => {
      if (!cmd.commandText || typeof cmd.commandText !== 'string') {
        console.warn("Warning: Found invalid command commandText in database.");
        return { command: cmd, similarity: 0 };
      }
      
      return {
        command: cmd,
        similarity: stringSimilarity.compareTwoStrings(transcriptStr, cmd.commandText.toLowerCase())
      };
    });
    

    const bestMatch = matches.reduce((prev, curr) => (prev.similarity > curr.similarity ? prev : curr));
    const THRESHOLD = 0.5;
    
    if (bestMatch.similarity >= THRESHOLD) {
    
      console.log(`Identified command: ${bestMatch.command.commandText} (similarity: ${bestMatch.similarity})`);
      
      const feed = bestMatch.command.feed;
      const payload = bestMatch.command.payload;

      if (feed && payload) {
        mqttService.publishToFeed(feed, payload);
        console.log(`Gửi đến feed ${feed} với payload ${payload}`);
      } else {
        console.log("Command không có feed hoặc payload.");
      }
    }
  } catch (err) {
    console.error("Error in handleTranscript:", err);
  }
};



// const commandController = require('./command.controller');
// const mqttService = require('../../services/mqqtService');
// const bertService = require('../../services/bertService');

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

//     const transcriptVec = await bertService.getSentenceVector(transcript);

//     const matches = await Promise.all(
//       commands.map(async (cmd) => {
//         if (!cmd.commandText || typeof cmd.commandText !== 'string') {
//           return { command: cmd, similarity: 0 };
//         }

//         const cmdVec = await bertService.getSentenceVector(cmd.commandText);
//         const similarity = bertService.cosineSimilarity(transcriptVec, cmdVec);

//         return { command: cmd, similarity };
//       })
//     );

//     const bestMatch = matches.reduce((prev, curr) =>
//       prev.similarity > curr.similarity ? prev : curr
//     );

//     const THRESHOLD = 0.7;

//     if (bestMatch.similarity >= THRESHOLD) {
//       console.log(`Khớp lệnh: ${bestMatch.command.commandText} (similarity: ${bestMatch.similarity})`);

//       const { feed, payload } = bestMatch.command;
//       if (feed && payload) {
//         mqttService.publishToFeed(feed, payload);
//         console.log(`Gửi đến feed ${feed} với payload ${payload}`);
//       } else {
//         console.log("Command không có feed hoặc payload.");
//       }
//     } else {
//       console.log("Không tìm được câu lệnh phù hợp.");
//     }

//   } catch (err) {
//     console.error("Lỗi xử lý transcript:", err);
//   }
// };










//_______________________________________________________________________________________________
// const { spawn } = require('child_process');
// const commandController = require('./command.controller');
// const mqttService = require('../../services/mqqtService');
// const path = require('path');

// exports.handleTranscript = async (transcript) => {
//   const pythonExe = "C:/Users/ACER/AppData/Local/Programs/Python/Python312/python.exe";
//   try {
//     console.log("Transcript received:", transcript);

//     if (!transcript || typeof transcript !== 'string') {
//       console.error("Transcript is missing or not a string.");
//       return;
//     }

//     const commands = await commandController.getCommandsFromDB();
//     if (!commands || commands.length === 0) {
//       console.error("No commands found in database.");
//       return;
//     }

//     const candidateSentences = commands.map(cmd => cmd.commandText);

//     const pyPath = path.join(__dirname, '../../bert.py'); 
//     const py = spawn(pythonExe, [pyPath]);

//     const requestData = JSON.stringify({
//       input: transcript,
//       candidates: candidateSentences
//     });

//     let result = '';
//     py.stdout.on('data', (data) => {
//       result += data.toString();
//     });

//     py.stderr.on('data', (data) => {
//       console.error(`Python error: ${data}`);
//     });

//     py.on('close', (code) => {
//       if (code !== 0) {
//         console.error(`Python process exited with code ${code}`);
//         return;
//       }

//       const output = JSON.parse(result);
//       const bestMatch = output.best_sentence;
//       const similarity = output.similarity;
//       const THRESHOLD = 0.7;

//       //   if (similarity >= THRESHOLD) {
//       //     const matchedCommand = commands.find(cmd => cmd.commandText === bestMatch);
//       //     console.log(`Khớp lệnh: ${bestMatch} (similarity: ${similarity})`);

//       //     const { feed, payload } = matchedCommand;
//       //     if (feed && payload) {
//       //       mqttService.publishToFeed(feed, payload);
//       //       console.log(`Gửi đến feed ${feed} với payload ${payload}`);
//       //     }
//       //   } else {
//       //     console.log("Không tìm được câu lệnh phù hợp.");
//       //   }
//       // });

      
//       if (similarity >= THRESHOLD) {
//         const matchedCommand = commands.find(cmd => cmd.commandText === bestMatch);
//         console.log(`Khớp lệnh: ${bestMatch} (similarity: ${similarity})`);

//         if (matchedCommand) {
//           const { feed, payload } = matchedCommand;
//           if (feed && payload) {
//             mqttService.publishToFeed(feed, payload);
//             console.log(`Gửi đến feed ${feed} với payload ${payload}`);
//           } else {
//             console.log("Lệnh khớp không có feed hoặc payload.");
//           }
//         } else {
//           console.error("Không tìm thấy câu lệnh tương ứng trong danh sách commands.");
//         }
//       } else {
//         console.log("Không tìm được câu lệnh phù hợp.");
//       }

//     });

      
//     py.stdin.write(requestData);
//     py.stdin.end();

//   } catch (err) {
//     console.error("Lỗi xử lý transcript:", err);
//   }
// };
