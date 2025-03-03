const { MongoClient } = require("mongodb");
const fs = require("fs");

const uri = "mongodb://localhost:27017"; // Thay bằng URI của bạn
const dbName = "FaceAI";

async function createCollections() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        const collectionsToCreate = ['Users', 'FaceData', 'Devices', 'AuthenticationLog', 'Notifications', 'Interacts'];
        
        for (const name of collectionsToCreate) {
            if (!collectionNames.includes(name)) {
                await db.createCollection(name);
                console.log(`Collection '${name}' created.`);
            } else {
                console.log(`Collection '${name}' already exists.`);
            }
        }
    } finally {
        await client.close();
    }
}

async function setupValidation() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);

        // Kiểm tra file validation.json có tồn tại không
        if (!fs.existsSync("validation.json")) {
            throw new Error("File validation.json không tồn tại!");
        }

        // Đọc file JSON và parse
        const validationSchema = JSON.parse(fs.readFileSync("validation.json", "utf8"));

        // Kiểm tra JSON có đúng cấu trúc không
        if  (  !validationSchema.UserValidation 
            || !validationSchema.DeviceValidation 
            || !validationSchema.InteractsValidation
            || !validationSchema.FaceDataValidation     
            || !validationSchema.NotificationsValidation 
            || !validationSchema.AuthenticationLogValidation
            ){
            throw new Error("File validation.json không đúng cấu trúc!");
        }

        // Danh sách collections cần cập nhật
        const collections = [
            { name: "Users", schema: validationSchema.UserValidation },
            { name: "Devices", schema: validationSchema.DeviceValidation },
            { name: "Interacts", schema : validationSchema.InteractsValidation},
            { name: "FaceData", schema : validationSchema.FaceDataValidation},
            { name: "Notifications", schema : validationSchema.NotificationsValidation},
            { name: "AuthenticationLog", schema: validationSchema.AuthenticationLogValidation}
        ];

        for (const { name, schema } of collections) {
            // Kiểm tra collection có tồn tại không
            const collectionsList = await db.listCollections({ name }).toArray();
            if (collectionsList.length === 0) {
                console.warn(`Collection "${name}" không tồn tại, bỏ qua cập nhật!`);
                continue;
            }

            // Cập nhật validation
            await db.command({
                collMod: name,
                ...schema
            });

            console.log(`Validation đã cập nhật thành công cho collection "${name}"`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật validation:", error.message);
    } finally {
        await client.close();
    }
}

// Chạy script
// createCollections()
setupValidation();
