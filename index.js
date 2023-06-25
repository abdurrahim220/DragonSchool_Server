const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hncbqqn.mongodb.net/?retryWrites=true&w=majority`;

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

        const usersCollection = client.db('assignment12').collection('users')
        const classesCollection = client.db('assignment12').collection('classes')
     

        // Save user email and role in DB
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const query = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(query, updateDoc, options)
           
            res.send(result)
        })

        // Get user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await usersCollection.findOne(query)
           
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })


        //post all classes in db
        app.post('/classes', async (req, res) => {
            const classes = req.body
            console.log(classes);
            const result = await classesCollection.insertOne(classes)
            res.send(result)
        });

        // Get all classes
        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray()
            res.send(result)
        })

        // delete classes
        app.delete('/classes/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await classesCollection.deleteOne(query)
            res.send(result)
        })

        // Get a single classes
        app.get('/classes/:email', async (req, res) => {
            const email = req.params.email
            console.log(email);
            const query = { 'host.email': email }
            const result = await classesCollection.find(query).toArray()

            // console.log(result)
            res.send(result)
        })

        //get each person added classes
        app.get('/classes/:email', async (req, res) => {
            const result = await classesCollection.find({
                email: req.params.email
            }).toArray();
            res.send(result)
        })

        // Get a single classes
        app.get('/classes/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await classesCollection.findOne(query)
            console.log(result)
            res.send(result)
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



app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`bistro boss is running on ${port}`);
})