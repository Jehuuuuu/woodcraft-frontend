// API route to fetch Stripe session details
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  
  if (!sessionId) {
    return new Response(JSON.stringify({ 
      error: 'Missing session_id parameter'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    // Call your backend API to retrieve session details
    const response = await fetch(`${apiURL}/stripe/session/${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch session: ${errorText}`);
    }
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Stripe session:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch session details',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}