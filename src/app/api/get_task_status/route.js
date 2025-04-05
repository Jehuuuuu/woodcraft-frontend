export async function GET(request) {
  try {
    // Extract task_id from URL query parameters
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');
    
    if (!task_id) {
      return new Response(JSON.stringify({ 
        error: 'Missing task_id parameter',
        message: 'task_id is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const response = await fetch(`https://woodcraft-backend.onrender.com/api/get_task_status/${task_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
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
    console.error('Error proxying task status request:', error);
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