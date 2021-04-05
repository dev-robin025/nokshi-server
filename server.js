const express = require('express')
const cors = require('cors')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;
const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7uya5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("clint error : ", err);
    const productCollection = client.db("all-proudcts").collection("products");
    const orderCollection = client.db("all-proudcts").collection("orders");

    app.post('/addProduct', (req, res) => {
        productCollection.insertOne(req.body)
            .then(result => res.sendStatus(200))
            .catch(err => console.log("create err : ", err))
    })

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get('/products/:id', (req, res) => {
        productCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, item) => {
                res.send(item);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                console.log(result);
                res.send("delete success")
            })
            .catch(err => console.log("delete err : ", err))
    })

    app.post('/addOrder', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => res.sendStatus(200))
            .catch(err => console.log("add user : ", err))
    })

    app.get('/orders', (req, res) => {
        orderCollection.find({ email: req.query.email })
            .toArray((err, result) => {
                res.send(result);
            })
    })
    app.delete('/deleteOrder/:id', (req, res) => {
        orderCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                console.log(result);
                res.send("delete success")
            })
            .catch(err => console.log("delete err : ", err))
    })
    // client.close();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})