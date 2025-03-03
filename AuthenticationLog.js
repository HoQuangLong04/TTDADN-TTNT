const { MongoClient, ObjectId } = require("mongodb");
const { timeStamp } = require("node:console");

// Kết nối MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function insertAuthenticationLog(data) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const authenticationlogCollection = db.collection("AuthenticationLog");

        // Nếu data là một object, chuyển thành mảng
        if (!Array.isArray(data)) {
            data = [data];
        }

        // Chuyển `createdAt` thành kiểu Date
        data = data.map(authenticationlog => ({
            ...authenticationlog,
            timestamp: new Date(authenticationlog.timestamp)
        }));

        // Chèn dữ liệu vào MongoDB
        const result = await authenticationlogCollection.insertMany(data);
        console.log(`Đã chèn ${result.insertedCount} authenticationlog(s) thành công!`);
    } catch (error) {
        console.error("Lỗi khi chèn dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function deleteAuthenticationLog(authenticationlogId) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const authenticationlogCollection = db.collection("AuthenticationLog");

        // Chuyển chuỗi ObjectID thành ObjectId thực sự
        const result = await authenticationlogCollection.deleteOne({ _id: new ObjectId(authenticationlogId) });

        if (result.deletedCount > 0) {
            console.log(`Đã xóa AuthenticationLog với ID: ${authenticationlogId}`);
        } else {
            console.log(`Không tìm thấy AuthenticationLog với ID: ${authenticationlogId}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa AuthenticationLog:", error);
    } finally {
        await client.close();
    }
}

async function getAuthenticationLog(filter = {}, sortField = "timestamp", sortOrder = -1) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("AuthenticationLog");

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
            console.log(`Tìm thấy ${users.length} authenticationlog(s):`);
            console.table(users);
        } else {
            console.log("Không tìm thấy AuthenticationLog nào!");
        }
    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function updateAuthenticationLog(authenticationlogId, updateData) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const AuthenticationLogCollection = db.collection("AuthenticationLog");
        if (updateData.timestamp){
            updateData.timestamp = new Date(updateData.timestamp);
        }

        // Thực hiện update
        const result = await AuthenticationLogCollection.updateOne(
            { _id: new ObjectId(authenticationlogId) }, 
            { $set: updateData }
        );

        if (result.matchedCount > 0) {
            console.log(`Đã cập nhật AuthenticationLog với ID: ${authenticationlogId}`);
        } else {
            console.log(`Không tìm thấy AuthenticationLog với ID: ${authenticationlogId}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật AuthenticationLog:", error);
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
    result :    "Success",
    timestamp:  "10/10/2021" ,
    imagePath:  "img.10.png",
    userID:     "1919191919191919",
    deviceID:   "2020202020202020"
}
// insertAuthenticationLog(data)
// deleteAuthenticationLog("67c3559f1f494644d6bf3bfc")
// getAuthenticationLog({imagePath : "/images/auth_log1.jpg"})
// getAuthenticationLog()
updateAuthenticationLog("67c355814c12e12bc8b971a6",{imagePath: "img/202019.png", timestamp: "12/20/24"});
