const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://siddharthshankar03:Magilam304@cluster0.rgteyqh.mongodb.net/`;
const client = new MongoClient(uri);

app
  .post("/log", async (req, res) => {
    client.connect();
    console.log("Connected", req.body);
    const collection = client.db("Events").collection("Logs");
    await collection.insertOne(req.body);
    console.log("Logged Successfully");
    res.json({ message: "Logged Successfully" });
  })
  .listen(5000);

app
  .get("/viewlog", async (req, res) => {
    const collection = client.db("Events").collection("Logs");
    data = await collection.find().toArray();
    const logs = data
      .map(
        (d, index) => `${index + 1}. ${d.event}->${d.action}->${d.triggerTime}`
      )
      .join("\n");
    fs.writeFile("app.log", logs, (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully\n");
      }
    });
    res.json({ message: "Log file written successfully" });
  })
  .listen(5001);
