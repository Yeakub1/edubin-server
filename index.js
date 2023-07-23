const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eypqquv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const CollageCollection = client.db("edubinDB").collection("collage");
    const admissionCollection = client.db("edubinDB").collection("admission");
    const reviewCollection = client.db("edubinDB").collection("review");

    // collage data
    app.get("/collage", async (req, res) => {
      const result = await CollageCollection.find().toArray();
      res.send(result);
    });

    app.get("/collage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const selectCollage = await CollageCollection.findOne(query);
      res.send(selectCollage);
    });

    // myclass colletion
    app.post("/admission", async (req, res) => {
      const item = req.body;
      const result = await admissionCollection.insertOne(item);
      res.send(result);
    });

    app.get("/admission", async (req, res) => {
      const result = await admissionCollection.find().toArray();
      res.send(result);
    });

    app.get("/admission/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await admissionCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // delete
    app.delete("/admission/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await admissionCollection.deleteOne(quary);
      res.send(result);
    });

    // review colletion
    app.post("/review", async (req, res) => {
      const item = req.body;
      const result = await reviewCollection.insertOne(item);
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

 
app.get('/', (req, res) => {
res.send('This server is running');
});

app.listen(port, () => {
console.log(`server is running on port ${port} `);
});