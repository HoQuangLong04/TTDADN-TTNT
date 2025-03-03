const { MongoClient, ObjectId } = require("mongodb");

// Kết nối MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function insertDevices(data) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const DevicesCollection = db.collection("Devices");

        // Nếu data là một object, chuyển thành mảng
        if (!Array.isArray(data)) {
            data = [data];
        }

        // Chèn dữ liệu vào MongoDB
        const result = await DevicesCollection.insertMany(data);
        console.log(`Đã chèn ${result.insertedCount} device(s) thành công!`);
    } catch (error) {
        console.error("Lỗi khi chèn dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function deleteDevice(deviceId) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const DevicesCollection = db.collection("Devices");

        // Chuyển chuỗi ObjectID thành ObjectId thực sự
        const result = await DevicesCollection.deleteOne({ _id: new ObjectId(deviceId) });

        if (result.deletedCount > 0) {
            console.log(`Đã xóa Device với ID: ${deviceId}`);
        } else {
            console.log(`Không tìm thấy Device với ID: ${deviceId}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa Device:", error);
    } finally {
        await client.close();
    }
}

async function getDevices(filter = {}) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const DevicesCollection = db.collection("Devices");

        let query = {};

        // Nếu có truyền `_id`, tìm theo ObjectId
        if (filter._id) {
            if (!ObjectId.isValid(filter._id)) {
                console.error("ID không hợp lệ!");
                return;
            }
            query._id = new ObjectId(filter._id);
        } else {
            // Nếu có truyền các field khác (name, email, phone,...), tìm theo các trường đó
            query = { ...filter };
        }

        const Devices = await DevicesCollection.find(query).toArray();

        if (Devices.length > 0) {
            console.log(`Tìm thấy ${Devices.length} device(s):`);
            console.table(Devices);
        } else {
            console.log("Không tìm thấy Device nào!");
        }
    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function updateDevice(deviceId, updateData) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const DevicesCollection = db.collection("Devices");

        // Thực hiện update
        const result = await DevicesCollection.updateOne(
            { _id: new ObjectId(deviceId) }, 
            { $set: updateData }
        );

        if (result.matchedCount > 0) {
            console.log(`Đã cập nhật Device với ID: ${deviceId}`);
        } else {
            console.log(`Không tìm thấy Device với ID: ${deviceId}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật Device:", error);
    } finally {
        await client.close();
    }
}

device = {
    type: "mic",
    status: "Active"
}

// insertDevices(device);
// getDevices({status :"Off" })
getDevices()
// deleteDevice("67c306be5dfc2053ff62a71e")

// updateDevice("67c306be5dfc2053ff62a71e", {status: "Active"})