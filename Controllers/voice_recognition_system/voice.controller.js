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
      
      // let payload = null;
      // const action = bestMatch.command.commandText.toLowerCase();
      
      // switch (action) {
      //   case 'mở đèn':
      //     payload = '1';
      //     break;
      //   case 'tắt đèn':
      //     payload = '0';
      //     break;
      //   default:
      //     console.log("Ko tìm thấy câu lệnh phù hợp.");
      //     break;
      // }
      
      // if (payload !== null) {
      //   mqttService.publishCommandLed(payload);
      //   console.log("Payload published:", payload);
      // }
      //   switch (action) {
      //   case 'mở đèn':
      //     payload = '1';
      //     publish = mqttService.publishCommandLed;
      //     break;
      //   case 'tắt đèn':
      //     payload = '0';
      //     publish = mqttService.publishCommandLed;
      //     break;
      //   case 'mở quạt':
      //     payload = '1';
      //     publish = mqttService.publishCommandFan;
      //     break;
      //   case 'tắt quạt':
      //     payload = '0';
      //     publish = mqttService.publishCommandFan;
      //     break;
      //   default:
      //     console.log("Command action not mapped to any payload.");
      //     break;
      // }

      // if (payload !== null) {
      //   publish(payload);
      //   console.log("Payload published:", payload);
      // }

      // } else {
      //   console.log("No matching command found.");
      // }
      

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


