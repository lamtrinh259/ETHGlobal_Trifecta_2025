addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  try {
    const input = await request.json();
    const host = input.host;
    const value = input.value;

    if (typeof host !== 'string' || typeof value !== 'string') {
      return new Response('Invalid input. Expected: { "host": "...", "value": "..." }', { status: 400 });
    }

    const url = `https://db9e-2800-484-782-1b00-4411-86b5-df9-f388.ngrok-free.app/getValue?value=${host}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log('data is', data);
    
    if (!data || typeof data.result !== 'string') {
      return new Response('Invalid response from backend', { status: 500 });
    }

    const result = data.result === value;
    console.log('result is', result);
    return new Response(JSON.stringify({ result }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response("Error during request or contract call", { status: 500 });
  }
}
