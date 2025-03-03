const { MongoClient, ObjectId } = require("mongodb");
const { timeStamp } = require("node:console");

// Kết nối MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function insertNotifications(data) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const notificationsCollection = db.collection("Notifications");

        // Nếu data là một object, chuyển thành mảng
        if (!Array.isArray(data)) {
            data = [data];
        }

        // Chuyển `createdAt` thành kiểu Date
        data = data.map(notification => ({
            ...notification,
            timestamp: new Date(notification.timestamp)
        }));

        // Chèn dữ liệu vào MongoDB
        const result = await notificationsCollection.insertMany(data);
        console.log(`Đã chèn ${result.insertedCount} notification(s) thành công!`);
    } catch (error) {
        console.error("Lỗi khi chèn dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function deleteNotification(notificationId) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const notificationCollection = db.collection("Notifications");

        // Chuyển chuỗi ObjectID thành ObjectId thực sự
        const result = await notificationCollection.deleteOne({ _id: new ObjectId(notificationId) });

        if (result.deletedCount > 0) {
            console.log(`Đã xóa FaceData với ID: ${notificationId}`);
        } else {
            console.log(`Không tìm thấy FaceData với ID: ${notificationId}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa FaceData:", error);
    } finally {
        await client.close();
    }
}

async function getNotifications(filter = {}, sortField = "timestamp", sortOrder = -1) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("Notifications");

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

        // Lấy danh sách user và sắp xếp
        const users = await usersCollection.find(query).sort({ [sortField]: sortOrder }).toArray();

        if (users.length > 0) {
            console.log(`Tìm thấy ${users.length} user(s):`);
            console.table(users);
        } else {
            console.log("Không tìm thấy Notification nào!");
        }
    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function updateNotification(notificationId, updateData) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const notificationCollection = db.collection("Notifications");
        if (updateData.timestamp){
            updateData.timestamp = new Date(updateData.timestamp);
        }

        // Thực hiện update
        const result = await notificationCollection.updateOne(
            { _id: new ObjectId(notificationId) }, 
            { $set: updateData }
        );

        if (result.matchedCount > 0) {
            console.log(`Đã cập nhật Notification với ID: ${notificationId}`);
        } else {
            console.log(`Không tìm thấy Notification với ID: ${notificationId}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật Notifications:", error);
    } finally {
        await client.close();
    }
}
// Ví dụ gọi hàm:
// Sắp xếp theo name tăng dần
// getUsers({}, "name", 1);

// Sắp xếp theo createdAt giảm dần (mặc định)
// getUsers({},"name", -1);
data = {
    userID :    "haha",
    timestamp:  "2024/10/5",
    message:    "onininini",
    imageCaptured:"img/alert1.png"
}
// insertNotifications(data)
// deleteNotification("67c350cfd0f3e2ef6162b841")
// getNotifications({imageCaptured : "/images/alert1.jpg"})
// getNotifications()
updateNotification("67c350d04a5310e7a75126cc",{timestamp: "5/21/2023"});
