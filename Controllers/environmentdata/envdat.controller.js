const Envdat = require('../../models/environment.model');

const addData = async (req, res) => {
  try {
    const { value, timestamp, systemID, sensorID } = req.body;
    if ( !value || !systemID || !sensorID /*||!timestamp*/) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin envdat.' });
    }

    const envdat = new Envdat(req.body);

    await envdat.save();

    return res.status(201).json({ message: 'Thêm envdat thành công!', data: envdat });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi thêm envdat.', error: error.message });
  }
};

const getData = async (req, res) => {
  try {
    const { envdatID } = req.query; // Lấy envdatID nếu có
    // console.log(req)
    console.log(envdatID)
    let envdats;

    if (envdatID) {
      // Tìm envdat theo ID, nếu có operation.deviceID là ObjectId thì populate
      // envdats = await envdat.findById(envdatID).populate("operation.deviceID");
      envdats = await Envdat.findById(envdatID);
      if (!envdats) {
        return res.status(404).json({ message: "Envdat không tồn tại!" });
      }
    } else {
      // Lấy tất cả envdat
      // envdats = await Envdat.find().populate("operation.deviceID");
      envdats = await Envdat.find();
    }

    res.status(200).json({ message: "Lấy envdat thành công!", data: envdats });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy envdat!", error: error.message });
  }
};

const deleteData = async (req, res) => {
  try {
    const { envdatID } = req.query;

    if (!envdatID) {
      return res.status(400).json({ message: "Vui lòng cung cấp envdatID." });
    }

    const envdat = await Envdat.findById(envdatID);
    if (!envdat) {
      return res.status(404).json({ message: "Envdat không tồn tại!" });
    }

    await Envdat.findByIdAndDelete(envdatID);
    return res.status(200).json({ message: "Xóa envdat thành công!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi xóa envdat.", error: error.message });
  }
};

const updateData = async (req, res) => {
  try {
    const { envdatID }= req.query;
    // const updateData  = req.body;

    if (!envdatID) {
      return res.status(400).json({ message: "Vui lòng cung cấp envdatID." });
    }

    const envdat = await Envdat.findById(envdatID);
    if (!envdat) {
      return res.status(404).json({ message: "Envdat không tồn tại!" });
    }

    const allowedFields = ["value", "timestamp", "systemID", "sensorID"];

    const updateDataFiltered = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    // Cập nhật thông tin envdat
    Object.assign(envdat, updateDataFiltered);
    await envdat.save();

    return res.status(200).json({ message: "Cập nhật envdat thành công!", envdat });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi cập nhật envdat.", error: error.message });
  }
};

module.exports = {
    addData,
    getData,
    deleteData,
    updateData
};
