export async function POST(request) {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const body = await request.json();
    
    // First get the CSRF token
    const csrfResponse = await fetch(`${apiURL}/set-csrf-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://woodcraft-frontend.vercel.app'
      },
      credentials: 'include'
    });
    
    // Extract cookies from the response
    const cookies = csrfResponse.headers.get('set-cookie');
    
    // Extract the CSRF token from the response
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrf_token;
    
    if (!csrfToken) {
      console.error("Failed to get CSRF token");
      return new Response(JSON.stringify({ 
        error: 'CSRF token not available',
        message: 'Could not retrieve CSRF token from server'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    const response = await fetch(`${apiURL}/initiate_task_id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Referer': 'https://woodcraft-frontend.vercel.app',
        'Cookie': cookies // Forward the cookies from the first request
      },
      body: JSON.stringify(body),
      credentials: 'include'
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