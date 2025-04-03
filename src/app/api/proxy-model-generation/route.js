export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://woodcraft-backend.onrender.com/api/generate_3d_model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Check content type to determine how to handle the response
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON response
      responseData = await response.json();
    } else {
      // Handle text response
      const textData = await response.text();
      responseData = { message: textData, isError: !response.ok };
    }
    
    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error proxying model generation request:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to proxy request', 
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}