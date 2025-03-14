const mongoose = require("mongoose");

const OperationSchema = new mongoose.Schema({
    deviceID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "device", // Liên kết tới bảng Device
    },
    action: {
      type: String,
      enum: ["On", "Off", "Caution"],
      required: true,
    },
  }, { _id: false });

const SensorSchema = new mongoose.Schema(
    {
        // sensorID: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     auto: true  // Tự động tạo ObjectId khi thêm mới
        // },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            required: [true, 'Status is required'],
            default: 'active'
            // minlength: [3, 'Status must be at least 3 characters long'],
            // trim: true
        },
        type: {
            type: String,
            enum: ['IRsen','IRrec','DHT20', 'moisture','light', 'distance'], //infrared là hồng ngoại, moisture là độ ẩm đất, light là ánh sáng
            required: [true, 'Type is required'],
        },
        unit: {
            type: String,
            required: [true, 'Unit is required'],
        },
        defaultTimer: {
            type: Number,
            required: [true, 'Default timer is required'],
            default: 0
        },
        defaultValue: {
            type: Number,
            default: 0,
            required: [true, 'Default value is required']   
        },
        systemID: { 
            type: mongoose.Schema.Types.ObjectId,      
            length: 24, // Đảm bảo đủ 24 ký tự
            ref: "system",
        },        
        customTimer: {
            type: Number,
            default: 0
        },
        customValue: {
            type: Number,
            default: 0
        }, 
        operation: [OperationSchema], // Danh sách thiết bị và hành động
    },
    {   timestamps: true, versionKey: false  }
);

const Sensor = mongoose.model("Sensor", SensorSchema, "sensor");

module.exports = Sensor;
