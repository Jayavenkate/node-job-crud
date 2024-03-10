import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";
const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);
await client.connect(); // call
console.log("Mongo is connected !!!  ");
app.use(express.json());
app.use(cors());
app.get("/", function (req, res) {
  res.send("hello world");
});
//create
app.post("/create", async function (req, res) {
  const { name, age, gender, qualification, place } = req.body;
  const result = await client.db("b42wd2").collection("job").insertOne({
    name: name,
    age: age,
    gender: gender,
    qualification: qualification,
    place: place,
  });
  res.status(200).send({ message: "add details successfully", result });
});
//Read
app.get("/read", async function (req, res) {
  try {
    const result = await client
      .db("b42wd2")
      .collection("job")
      .find({})
      .toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(401).send({ message: err });
  }
});
//get by id
app.get("/read/:id", async function (req, res) {
  const { id } = req.params;
  const result = await client
    .db("b42wd2")
    .collection("job")
    .findOne({ _id: new ObjectId(id) });
  result ? res.send(result) : res.send({ message: "users not found" });
});
//delete by id

app.delete("/delete/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const result = await client
      .db("b42wd2")
      .collection("job")
      .deleteOne({ _id: new ObjectId(id) });
    console.log(result);
    result.deletedCount >= 1
      ? res.send({ message: "delete successfully" })
      : res.send({ message: "user not found" });
  } catch (err) {
    res.send({ message: "err" });
  }
});
// update
app.put("/read/:id", async function (req, res) {
  const { id } = req.params;
  const data = req.body;
  console.log(data);
  const result = await client
    .db("b42wd2")
    .collection("job")
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  res.send(result);
});
app.listen(PORT, () => console.log(`The server started in ${PORT}`));
