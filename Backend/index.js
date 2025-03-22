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

app.get("/getAttestation", async (req, res) => {
  try {
    const ip = req.query.ip;

    if (!ip || typeof ip !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'ip' query param" });
    }

    const attestation_utility_url = `http://${ip}:1300/attestation/raw`;

    const attestationRes = await fetch("https://attestation_proxy_verifier.justfortesting.me/v1/enclave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attestation_utility_url,
        verifier_ip: "http://13.201.207.60:1400"
      }),
    });

    const attestationData = await attestationRes.json();
    const pcr2 = attestationData?.parsed_attestation?.pcrs?.[2];

    if (typeof pcr2 !== "string") {
      return res.status(500).json({ error: "Invalid PCR2 value from attestation" });
    }

    res.json({ pcr2 });
  } catch (err) {
    console.error("attestation error:", err);
    res.status(500).json({ error: "Error fetching attestation" });
  }
});


app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
