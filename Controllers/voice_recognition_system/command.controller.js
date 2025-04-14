const Command = require("../../models/command.model");
const stringSimilarity = require("string-similarity");
const mqttService = require("../../services/mqqtService");


const addCommand = async (req, res) => {
  try {
    const { commandText } = req.body;
    
    if (!commandText) {
      return res.status(400).json({ message: "Vui lòng cung cấp nội dung câu lệnh." });
    }
    const newCommand = new Command({ commandText });
    await newCommand.save();
    res.status(201).json({
      message: "Thêm câu lệnh thành công!",
      command: newCommand
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm câu lệnh.",
      error: error.message
    });
  }
};

const getCommands = async (req, res) => {
  try {
    const commands = await Command.find();
    res.status(200).json({
      message: "Lấy danh sách câu lệnh thành công!",
      commands
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách câu lệnh.",
      error: error.message
    });
  }
};



const compareTranscriptAndPublish = async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: "Transcript không được cung cấp" });
  }
  try {
    const commands = await Command.find();
    if (!commands || commands.length === 0) {
      return res.status(500).json({ error: "Chưa có câu lệnh nào trong database." });
    }
    const matches = commands.map(cmd => ({
      command: cmd,
      similarity: stringSimilarity.compareTwoStrings(transcript.toLowerCase(), cmd.commandText.toLowerCase())
    }));
    const bestMatch = matches.reduce((prev, curr) => (prev.similarity > curr.similarity ? prev : curr));
    const THRESHOLD = 0.6;
    
    if (bestMatch.similarity >= THRESHOLD) {
      console.log(`Đã nhận diện lệnh: ${bestMatch.command.commandText} (độ tương đồng: ${bestMatch.similarity})`);
      let payload = null;
      if (bestMatch.command.commandText.toLowerCase().includes("bật")) {
        payload = "1";
      } else if (bestMatch.command.commandText.toLowerCase().includes("tắt")) {
        payload = "0";
      }
      if (payload !== null) {
        mqttService.publishCommand(payload);
        return res.status(200).json({
          transcript,
          command: bestMatch.command,
          similarity: bestMatch.similarity,
          status: "Command executed"
        });
      } else {
        return res.status(200).json({
          transcript,
          command: bestMatch.command,
          similarity: bestMatch.similarity,
          status: "No corresponding payload found"
        });
      }
    } else {
      console.log("Không tìm thấy lệnh phù hợp.");
      return res.status(200).json({ transcript, status: "No matching command found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCommandsFromDB = async () => {
  try {
    const commands = await Command.find();
    return commands;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách câu lệnh: " + error.message);
  }
};


module.exports = { addCommand, getCommands, compareTranscriptAndPublish, getCommandsFromDB };
