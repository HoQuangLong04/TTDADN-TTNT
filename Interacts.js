const { MongoClient, ObjectId } = require("mongodb");

// Kết nối MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function insertInteracts(data) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const interactsCollection = db.collection("Interacts");

        // Nếu data là một object, chuyển thành mảng
        if (!Array.isArray(data)) {
            data = [data];
        }

        // data = data.map(interact => ({
        //     ...interact,
        //     userId: new ObjectId(interact.userId), // Chuyển đổi userid thành ObjectId
        //     deviceId: new ObjectId(interact.deviceId) // Chuyển đổi deviceid thành ObjectId
        // }));

        // Chèn dữ liệu vào MongoDB
        const result = await interactsCollection.insertMany(data);
        console.log(`Đã chèn ${result.insertedCount} interact(s) thành công!`);
    } catch (error) {
        console.error("Lỗi khi chèn dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function deleteInteract(interactId) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("Interacts");

        // Chuyển chuỗi ObjectID thành ObjectId thực sự
        const result = await usersCollection.deleteOne({ _id: new ObjectId(interactId) });

        if (result.deletedCount > 0) {
            console.log(`Đã xóa User với ID: ${interactId}`);
        } else {
            console.log(`Không tìm thấy User với ID: ${interactId}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa User:", error);
    } finally {
        await client.close();
    }
}

async function getInteracts(filter = {}, sortField = "userId", sortOrder = -1) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("Interacts");

        let query = {};

        // Nếu có truyền `_id`, tìm theo ObjectId
        if (filter._id) {
            if (!ObjectId.isValid(filter._id)) {
                console.error("ID không hợp lệ!");
                return;
            }
            query._id = new ObjectId(filter._id);
        } else {
            query = { ...filter };
        }

        // Lấy danh sách user và sắp xếp
        const users = await usersCollection.find(query).sort({ [sortField]: sortOrder }).toArray();

        if (users.length > 0) {
            console.log(`Tìm thấy ${users.length} interact(s):`);
            console.table(users);
        } else {
            console.log("Không tìm thấy Interact nào!");
        }
    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu:", error);
    } finally {
        await client.close();
    }
}

async function updateInteract(interactId, updateData) {
    try {
        await client.connect();
        const db = client.db("FaceAI");
        const usersCollection = db.collection("Interacts");

        // Thực hiện update
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(interactId) }, 
            { $set: updateData }
        );

        if (result.matchedCount > 0) {
            console.log(`Đã cập nhật Interact với ID: ${interactId}`);
        } else {
            console.log(`Không tìm thấy Interact với ID: ${interactId}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật Interact:", error);
    } finally {
        await client.close();
    }
}


data = {
    userId: "67c2f69ab19b49f79c581941",
    deviceId: "67c304e5ecbf2da4524cf389"
}
// insertInteracts(data);
deleteInteract("67c34617966eb158510ad006")
getInteracts({_id :"67c34617966eb158510ad006"})
// getInteracts()
// updateInteract("67c343ecc193390d824ae265", {userId: "111111111111111111111121"})
