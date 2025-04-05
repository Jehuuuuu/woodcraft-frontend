export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch('https://woodcraft-backend.onrender.com/api/initiate_task_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log("Received response from backend:", response.status);
    
    // Check content type to determine how to handle the response
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON response
      try {
        responseData = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails, get the text and wrap it
        const textData = await response.text();
        responseData = { 
          message: textData, 
          isError: !response.ok,
          parseError: jsonError.message
        };
      }
    } else {
      // Handle text response
      const textData = await response.text();
      responseData = { 
        message: textData, 
        isError: !response.ok,
        contentType: contentType || 'unknown'
      };
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
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}