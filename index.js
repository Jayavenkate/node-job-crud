import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
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
//delete by id
app.delete("/:id", async function (req, res) {
  const { _id } = req.params;
  const result = await client
    .db("b42wd2")
    .collection("job")
    .deleteOne({ id: _id });
  console.log(result);
  result.deletedCount >= 1
    ? res.send({ message: "deleted successfully" })
    : res.send({ message: "users not found" });
});
// update
app.put("/:id", async function (req, res) {
  const { _id } = req.params;
  const data = req.body;
  console.log(data);
  const result = await client
    .db("b42wd2")
    .collection("job")
    .updateOne({ id: _id }, { $set: data });
  result ? res.send(result) : res.send({ message: "users not found" });
});
app.listen(PORT, () => console.log(`The server started in ${PORT}`));
