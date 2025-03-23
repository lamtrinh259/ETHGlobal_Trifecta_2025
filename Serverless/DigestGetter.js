addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  try {
    const baseUrl = 'https://teeshield-backend.vercel.app';
    const input = await request.json();
    const host = input.host;

    if (typeof host !== 'string') {
      return new Response('Invalid input. Expected: { "host": "..." }', { status: 400 });
    }

    const url = `${baseUrl}/getValue?value=${host}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || typeof data.result !== 'string') {
      return new Response('Invalid response from backend', { status: 500 });
    }

    const contractValue = data.result;

    const attestRes = await fetch(`${baseUrl}/getAttestation?ip=${host}`);
    const attestData = await attestRes.json();

    console.log('attestData is', attestData);
    
    const pcr2 = attestData.pcr2;

    if (typeof pcr2 !== 'string') {
      return new Response('Invalid PCR2 value from attestation backend', { status: 500 });
    }

    const result = pcr2 === contractValue;

    return new Response(JSON.stringify({ result }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response("Error during request or contract call", { status: 500 });
  }
}
