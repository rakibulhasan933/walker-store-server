const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const port = 5000

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdjur.mongodb.net/Shop?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(client);
client.connect(err => {
    console.log(err);
    const collection = client.db("Shop").collection("products");
    const oderCollection = client.db("Shop").collection("oder");

    app.get("/products", (req, res) => {
        collection.find()
            .toArray((err, product) => {
                res.send(product);
            })
    })

    app.post("/addProduct", (req, res) => {
        const products = req.body;
        // console.log("adding products", products);
        collection.insertOne(products)
            .then(result => {
                // console.log('database count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })
    app.post("/addOderProduct", (req, res) => {
        const products = req.body;
        console.log("adding products", products);
        oderCollection.insertOne(products)
            .then(result => {
                // console.log('database count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })
    app.get(`/product/:id`, (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.get('/userOder', (req, res) => {
        oderCollection.find({ email: req.query.email })
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                // console.log(result);
            })
    });

    console.log("db connected");
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})




app.listen(port);