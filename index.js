const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tng5w16.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // from server to node mongodb crud
    const productCollection = client.db('productDB').collection('product');

    app.get('/product', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    // for post=create data to database

    app.post('/product', async(req, res)=>{
      const newProduct = req.body;
      // console.log(newProduct);
      // adding single single product from server to mongodb crud
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })


    app.delete('/product/:id',async(req,res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('Brand Shop Server is running')
})

app.listen(port,()=>{
    console.log(`Brand Shop Server is running on port: ${port}`)
})