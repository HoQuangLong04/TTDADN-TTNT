const { MongoClient, ObjectId } = require("mongodb");

// Kết nối MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function insertUsers(data) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("Users");

        // Nếu data là một object, chuyển thành mảng
        if (!Array.isArray(data)) {
            data = [data];
        }

        // Chuyển `createdAt` thành kiểu Date
        data = data.map(user => ({
            ...user,
            createdAt: new Date(user.createdAt)
        }));

        // Chèn dữ liệu vào MongoDB
        const result = await usersCollection.insertMany(data);
        console.log(`Đã chèn ${result.insertedCount} user(s) thành công!`);
    } catch (error) {
        console.error("Lỗi khi chèn dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function deleteUser(userId) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("Users");

        // Chuyển chuỗi ObjectID thành ObjectId thực sự
        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount > 0) {
            console.log(`Đã xóa User với ID: ${userId}`);
        } else {
            console.log(`Không tìm thấy User với ID: ${userId}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa User:", error);
    } finally {
        await client.close();
    }
}

async function getUsers(filter = {}, sortField = "createdAt", sortOrder = -1) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("Users");

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
            console.log("Không tìm thấy User nào!");
        }
    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function updateUser(userId, updateData) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("Users");

        // Thực hiện update
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) }, 
            { $set: updateData }
        );

        if (result.matchedCount > 0) {
            console.log(`Đã cập nhật User với ID: ${userId}`);
        } else {
            console.log(`Không tìm thấy User với ID: ${userId}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật User:", error);
    } finally {
        await client.close();
    }
}
// Ví dụ gọi hàm:
// Sắp xếp theo name tăng dần
// getUsers({}, "name", 1);

// Sắp xếp theo createdAt giảm dần (mặc định)
// getUsers({},"name", -1);
user = {
    name: "A",
    passwordHash: "12345678",
    email: "haha@gmail.com",
    phone: "012345678",
    createdAt: Date.now(),
    role: "admin"
}
insertUsers(user);




