import { serializeUseCacheCacheStore } from "next/dist/server/resume-data-cache/cache-store";

// const API_URL = "http://localhost:8000/api";  
const API_URL = "https://woodcraft-backend.onrender.com/api";  

const fetchWithCredentials = async (url, options = {}) => {
    try{
        const res = await fetch(`${API_URL}${url}`, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        })
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching with credentials:", error);
        throw error;
    }
};

// New function for proxied API calls through Next.js API routes
const fetchWithProxy = async (proxyEndpoint, body, method) => {
    try {
        const res = await fetch(`/api/${proxyEndpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching with proxy (${proxyEndpoint}):`, error);
        throw error;
    }
};

export const getCsrfToken = async () => {
    try {
        return fetchWithCredentials('/set-csrf-token');
    } catch (error) {
        console.error('Error getting CSRF token:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        return fetchWithCredentials(`/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

const getCsrfTokenFromCookie = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; csrftoken=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};

export const logout = async () => {
    try {
        const csrfToken = getCsrfTokenFromCookie();
        return fetchWithCredentials('/logout', {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
            },
        });
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

export const register = async (first_name, last_name, email, password) => {
    try {
        return fetchWithCredentials('/register', {
            method: "POST",
            body: JSON.stringify({ first_name, last_name, email, password }),
        });
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export const getUser = async () => {
    try {
        return fetchWithCredentials('/user');
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;}
}

export const initiateModelGeneration = async (design_description, decoration_type, material, height, width, thickness) => {
   try{
        const response = await fetchWithProxy('/initiate_task_id', {
            design_description,
            decoration_type,
            material,
            height,
            width,
            thickness,
        }, 'POST');
        return {
            success: response.success,
            message: response.message,
            task_id: response.task_id,
        }
    }catch (error){
        console.error('Error generating 3d model:', error);
        throw error;
    }
}

export const checkTaskStatus = async (task_id) => {
   try {
        // Use GET with query parameters instead of POST with body
        const response = await fetch(`/api/get_task_status?task_id=${task_id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
   } catch (error) {
        console.error('Error checking task status:', error);
        throw error;
   }
}

export const fetchProducts = async () => {
    try {
        return fetchWithCredentials('/get_products');
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export const fetchCategories = async() => {
    try {
        return fetchWithCredentials('/get_categories'); 
    }catch (error) {    
        console.error('Error fetching categories:', error);
        throw error;
    }
}