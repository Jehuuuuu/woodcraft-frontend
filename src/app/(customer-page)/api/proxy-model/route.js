export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return new Response('URL parameter is required', { status: 400 });
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return new Response(`Error fetching model: ${response.statusText}`, { 
        status: response.status 
      });
    }
    
    const data = await response.arrayBuffer();
    
    return new Response(data, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error proxying model:', error);
    return new Response('Error fetching model', { status: 500 });
  }
}