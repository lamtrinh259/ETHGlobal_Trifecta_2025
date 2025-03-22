addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  try {
    const data = await request.json();

    const key = data.key;
    if (typeof key !== 'string') {
      return new Response('Invalid input. Expected: { "key": "yourKey" }', { status: 400 });
    }

    const contractAddress = "0x3b53eb6FCc0b0a618db98F05BB4007aFcDbde94d";
    const functionSelector = "0x6d4ce63c";

    const encodedKey = encodeString(key);
    const dataPayload = functionSelector + encodedKey;

    const rpcBody = {
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: contractAddress,
          data: dataPayload
        },
        "latest"
      ],
      id: 1
    };

    const rpcUrl = "https://endpoints.omniatech.io/v1/arbitrum/one/public";

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rpcBody)
    });

    const result = await response.json();

    const hex = result.result;
    const value = decodeString(hex);

    return new Response(JSON.stringify({ value }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error(err);
    return new Response("Error during request or contract call", { status: 500 });
  }
}

function encodeString(str) {
  const textEncoder = new TextEncoder();
  const encoded = Array.from(textEncoder.encode(str)).map(b => b.toString(16).padStart(2, '0')).join('');
  const lengthHex = str.length.toString(16).padStart(64, '0');
  const valueHex = encoded.padEnd(64 * Math.ceil(encoded.length / 64), '0');
  return lengthHex + valueHex;
}

function decodeString(hex) {
  const offset = parseInt(hex.slice(64, 128), 16) * 2;
  const length = parseInt(hex.slice(offset, offset + 64), 16);
  const strHex = hex.slice(offset + 64, offset + 64 + length * 2);

  let str = '';
  for (let i = 0; i < strHex.length; i += 2) {
    str += String.fromCharCode(parseInt(strHex.substr(i, 2), 16));
  }
  return str;
}
