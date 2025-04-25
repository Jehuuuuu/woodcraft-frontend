import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

const API_URL = "https://woodcraft-backend.onrender.com/api"
// const API_URL = "http://localhost:8000/api";  
export const getCSRFTokenfromCookie = () => {
    const name = 'csrftoken'
    let cookieValue = null
    if (typeof document !== 'undefined' && document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
        }
      }
    }
    if (cookieValue === null) {
      throw new Error('Missing CSRF cookie.')
    }
    return cookieValue
  }

export const useAuthStore = create(persist((set, get) => ({
user: null,
isAuthenticated: false,

setCsrfToken: async() => {
    try{
        const response = await fetch(`${API_URL}/set-csrf-token`,{
            method: "GET",
            headers:{
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        const data = await response.json();
        return data.csrf_token
    } catch (error) {
        console.error("Error setting CSRF token:", error);
    }
},

login: async (email, password) => {
    try {
        const csrfToken = await get().setCsrfToken()
        
        if (!csrfToken) {
            console.error("CSRF token not found after attempting to set it");
            return false;
        }
        
        console.log("Using CSRF token for login:", csrfToken);
        
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({email, password})
        });
        
        if (!response.ok) {
            console.error(`Login failed with status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error("Error response:", errorText);
            return false;
        }
        
        const data = await response.json();
        if (data.success) {
            set({
                user: data,
                isAuthenticated: true,
            });
        }
        return data.success;
    } catch(error) {
        console.error("Error logging in:", error);
        return false;
    }
},
logout: async () => {
    let csrfToken;
    try {
      csrfToken = await get().setCsrfToken()
    } catch (error) {
        console.warn("CSRF token not found before logout attempt:", error.message);
        csrfToken = null; 
    }
    try{
        const headers = {
            "Content-Type": "application/json",
        };
        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }

        const response = await fetch(`${API_URL}/logout`,{
            method: "POST",
            headers: headers,
            credentials: "include", 
        });  

        set({
            user: null,
            isAuthenticated: false,
        });
        if (!response.ok) {
            // Log backend errors like 401 Unauthorized
            console.error(`Backend logout failed: ${response.status} ${response.statusText}`);
            // You might want to read the response body for more details if available
            // const errorData = await response.text(); // or response.json() if applicable
            // console.error("Backend error details:", errorData);
        }
    } catch (error){
        console.error("Error logging out:", error);
    }
},
register: async (first_name, last_name, email, password) => {
    const csrfToken = await get().setCsrfToken()
    if (!csrfToken){
        console.error("CSRF token not found.")
        return;
    }
    try{
        const response =  await fetch(`${API_URL}/register`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({first_name, last_name, email, password}),
        });
        const data = await response.json();
        return data;
    }catch(error){
        console.error("Error registering user:", error);
    }
},
fetchUser: async() => {
    const csrfToken = getCSRFTokenfromCookie();
    try{
        const response = await fetch(`${API_URL}/user`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include"
        })
        const data = await response.json();
        if (data.email){
            set({
                user: data,
                isAuthenticated: true,
            })
        }else{
            set({
                user: null,
                isAuthenticated: false,
            })
        }
    }catch(error){
        console.error("Error fetching user:", error);
    }
},
}),
{
    name: "auth-storage",
    storage: createJSONStorage(() => localStorage),
}));

