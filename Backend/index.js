require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const abi = require("./abi.json");

const app = express();
const port = 3000;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

app.get("/getValue", async (req, res) => {
  try {
    const val = req.query.value;
    console.log('value received is', val);
    if (!val) {
      return res.status(400).json({ error: "Missing value" });
    }
    const result = await contract.get(val);
    console.log('result is', result);
    res.json({ result });
  } catch (err) {
    console.error('error is ',err);
    res.status(500).json({ error: "Error reading values." });
  }
});


app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
