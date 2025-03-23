
import connectMongoDB from "./libs/mongodb.js"; // Ensure correct path

async function testConnection() {
    console.log("🛠 Attempting to connect to MongoDB...");

    try {
        const db = await connectMongoDB(); // Try connecting
        console.log("✅ Successfully connected to MongoDB!");
        console.log(`🔹 Database Name: ${db.connection.name}`);
        console.log(`🔹 Host: ${db.connection.host}`);
        console.log(`🔹 Port: ${db.connection.port}`);

        process.exit(0); // Exit successfully
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1); // Exit with an error code
    }
}

testConnection();
