const mongoose = require("mongoose");

const EnvironmentDataSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true, // Giá trị đo được từ sensor
    },
    timestamp: {
      type: Date,
      default: Date.now, // Thời gian lưu dữ liệu
    },
    systemID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      length: 24, // Đảm bảo đủ 24 ký tự
    },
    sensorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor", // Liên kết với bảng Sensor
      length: 24,
      required: true,
    },
  },{versionKey: false}
);

const EnvironmentData = mongoose.model("EnvironmentData", EnvironmentDataSchema, "environmentData");
module.exports = EnvironmentData;
