require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const abi = require("./abi.json");

const app = express();
const port = process.env.PORT || 3000;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

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
    console.error('error is ', err);
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the app for Vercel
module.exports = app;

// Only listen if we're running directly (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
