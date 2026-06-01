import express from "express";
const app = express();
const port = 57735;
app.get("/", (req, res) => {
  res.send("Hello World from Express!");
});
app.listen(port, () => {
  console.log(`Hello World app listening on port ${port}`);
});
