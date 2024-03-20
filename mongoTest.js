const { MongoClient } = require('mongodb');

// Replace the uri string with your connection string.
const uri = "mongodb+srv://singhjap302:japit302@cluster0.h236aap.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const database = client.db("test");
        const collection = database.collection("testCollection");

        // Query for a document
        const query = { name: "testName" };
        const doc = await collection.findOne(query);
        console.log(doc);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);
