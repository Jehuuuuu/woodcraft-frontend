import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
// const setCookieHeader = async() => {
//     try{
//         const response = await fetch(`${API_URL}/csrf`,
//         {
//             method: "POST",
//             credentials: "include",
//         })
//         return response;
//     } catch (error) {
//         console.error("Error setting CSRF cookie:", error);
//     }
// }
export const useAuthStore = create(persist((set, get) => ({
user: null,
isAuthenticated: false,
_hasHydrated: false, 

setHasHydrated: (state) => {
    set({
        _hasHydrated: state
    });
},

totalCartItems: 0,

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
           const user_data = { id:  data.user.id,
                        email: data.user.email,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName}
            
            set({
                user: user_data,
                isAuthenticated: true,
            });
            
            const cartItems = await get().getCartItems()  
            set({
                totalCartItems: cartItems.total_items,
            })     
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
            totalCartItems: 0,
        });
        if (!response.ok) {
            console.error(`Backend logout failed: ${response.status} ${response.statusText}`);

        }
    } catch (error){
        console.error("Error logging out:", error);
    }
},
register: async (first_name, last_name, email, password) => {
    const csrfToken = await get().setCsrfToken();
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
    const csrfToken = await get().setCsrfToken()
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
        }
        return data
    }catch(error){
        console.error("Error fetching user:", error);
    }
},
getCartItems: async() => {
      const csrfToken = await get().setCsrfToken()
      const user = get().user; 

      if (!user || user.id === undefined){
          console.log("User not available or missing ID, cannot fetch cart.");
          set({ totalCartItems: 0 }); // Reset cart items if no user
          return { success: false, total_items: 0, isAuthenticated: false };
      }
      try{
          const response = await fetch(`${API_URL}/cart?user=${user.id}`,{
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": csrfToken,
              },
              credentials: "include"
          })
          const data = await response.json();
          if (response.ok && data) {
              set({ totalCartItems: data.total_items || 0 });
              return data; // Return the fetched data
          } else {
              console.error("Failed to fetch cart items:", data);
              set({ totalCartItems: 0 }); // Reset on error
              return { success: false, total_items: 0 };
          }
      } catch(error){
          console.error("Error fetching cart items:", error);
          set({ totalCartItems: 0 }); // Reset on exception
          return { success: false, total_items: 0 };
      }
  },
  fetchUserDesigns: async () => {
      const csrfToken = await get().setCsrfToken();
      const user = get().user;
      
      if (!user || !user.id) {
          console.error("User not found or missing ID");
          return [];
      }
  
      try {
          const response = await fetch(`${API_URL}/get_customer_designs?user_id=${user.id}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrfToken
              },
              credentials: 'include'
          });
          
          const data = await response.json();
          
          if (Array.isArray(data)) {
              return data;
          } else if (data.success === false) {
              console.error("Failed to fetch designs:", data.message);
              return [];
          } else {
              console.error("Unexpected response format:", data);
              return [];
          }
      } catch (error) {
          console.error("Error fetching customer designs:", error);
          return [];
      }
  }
}),
{
    name: "auth-storage",
    storage: createJSONStorage(() => localStorage),
    onRehydrateStorage: () => (state, error) => {
        if (!error) {
          state.setHasHydrated(true);
        } else {
          console.error("Rehydrate error:", error);
        }
      }
      
}));

