addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  // Forward to the real server, keeping path and query
  const targetUrl = 'https://hms.canwinn.in' + url.pathname + url.search;

  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
  });

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }

  let response = await fetch(modifiedRequest);

  // Add CORS header to every response
  response = new Response(response.body, response);
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}