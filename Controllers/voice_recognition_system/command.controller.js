const Command = require("../../models/command.model");
const stringSimilarity = require("string-similarity");
const mqttService = require("../../services/mqqtService");



const addCommand = async (req, res) => {
  try {
    const { commandText, feed, payload, actionType } = req.body;

    if (!commandText || !feed || !payload) {
      return res.status(400).json({ message: "Thiếu thông tin." });
    }

    const newCommand = new Command({ commandText, feed, payload, actionType });
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



const getCommandsFromDB = async () => {
  try {
    const commands = await Command.find();
    return commands;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách câu lệnh: " + error.message);
  }
};


module.exports = { addCommand, getCommands, getCommandsFromDB };
