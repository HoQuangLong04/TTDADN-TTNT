const Command = require("../../models/command.model");

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

module.exports = { addCommand };
