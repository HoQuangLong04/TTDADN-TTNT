const Sensor = require('../../models/sensor.model');
const Envdat = require('../../models/environment.model');

const addSensor = async (req, res) => {
  try {
    const { type, unit, systemID } = req.body;
    if (!type || !unit || !systemID) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin sensor.' });
    }

    const sensor = new Sensor(req.body);

    await sensor.save();

    return res.status(201).json({ message: 'Thêm sensor thành công!', data: sensor });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi thêm sensor.', error: error.message });
  }
};

const getSensor = async (req, res) => {
  try {
    const { sensorID } = req.query; // Lấy sensorID nếu có
    // console.log(req)
    console.log(sensorID)
    let sensors;

    if (sensorID) {
      // Tìm sensor theo ID, nếu có operation.deviceID là ObjectId thì populate
      // sensors = await Sensor.findById(sensorID).populate("operation.deviceID");
      sensors = await Sensor.findById(sensorID);
      if (!sensors) {
        return res.status(404).json({ message: "Sensor không tồn tại!" });
      }
    } else {
      // Lấy tất cả sensor
      // sensors = await Sensor.find().populate("operation.deviceID");
      sensors = await Sensor.find();
    }

    res.status(200).json({ message: "Lấy sensor thành công!", data: sensors });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sensor!", error: error.message });
  }
};

const deleteSensor = async (req, res) => {
  try {
    const { sensorID } = req.query;

    if (!sensorID) {
      return res.status(400).json({ message: "Vui lòng cung cấp sensorID." });
    }

    const sensor = await Sensor.findById(sensorID);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor không tồn tại!" });
    }

    await Sensor.findByIdAndDelete(sensorID);
    return res.status(200).json({ message: "Xóa sensor thành công!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi xóa sensor.", error: error.message });
  }
};

const updateSensor = async (req, res) => {
  try {
    const { sensorID }= req.query;
    // const updateData  = req.body;

    if (!sensorID) {
      return res.status(400).json({ message: "Vui lòng cung cấp sensorID." });
    }

    const sensor = await Sensor.findById(sensorID);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor không tồn tại!" });
    }

    const allowedFields = ["status", "type", "unit", "defaultTimer", "defaultValue", "systemID", "customTimer", "customValue", "operation"];

    const updateDataFiltered = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    // Cập nhật thông tin sensor
    Object.assign(sensor, updateDataFiltered);
    await sensor.save();

    return res.status(200).json({ message: "Cập nhật sensor thành công!", sensor });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi cập nhật sensor.", error: error.message });
  }
};

const getsensorData = async (obj) => {
  try {
    console.log(obj)
    const newRecord = new Envdat(obj);
    await newRecord.save();

    console.log('Đã lưu dữ liệu từ cảm biến:', newRecord);
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu từ cảm biến:', error);
  }
};

module.exports = {
    addSensor,
    getSensor,
    deleteSensor,
    updateSensor,
    getsensorData
};
