const express = require('express')
const app = express()
var cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT|| 5000

// middleware
app.use(cors())
app.use(express.json())
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.1n864lk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

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
    await client.connect();

   //  const database = client.db("carDoctor");
   //  const carsCollection = database.collection("cars");
   const database = client.db("carDoctor");
   const carsCollection = database.collection("services");
   const checkOutCollection = database.collection("checkOut");

   //  find value in server 
   app.get("/services" , async(req ,res) =>{
      const cursor = carsCollection.find();
      const result = await cursor.toArray() ;
      res.send(result)
   })

// find value by id 
app.get("/services/:id" , async(req , res) =>{
  const id= req.params.id ;
  const query = { _id : new ObjectId(id) };
  const result = await carsCollection.findOne(query)
  res.send(result)

})

// create data for checkOut in database 
app.post("/checkOuts" , async(req , res) =>{
  const checkOuts = req.body ;
  console.log(checkOuts);
  const result = await checkOutCollection.insertOne(checkOuts);
  res.send(result)
})

// get or read some data for checkout
app.get("/checkOuts" , async(req , res) =>{
  let query = {}
  if(req.query?.email){
    query = {email:req.query.email}
  }
  const cursor = checkOutCollection.find(query)
  const result = await cursor.toArray() ;
  res.send(result)
}) 

// delete data 
app.delete("/checkOuts/:id" , async(req , res)=>{
  const id = req.params.id ;
  const query = { _id: new ObjectId(id)}
  const result = await checkOutCollection.deleteOne(query);
  res.send(result)
}) 


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('doctor is running !!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})