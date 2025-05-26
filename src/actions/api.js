"use server"

const API_URL = process.env.NEXT_PUBLIC_API_URL;  

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

const getCSRFToken = async () => {
    try {
        const response = await fetch(`${API_URL}/set-csrf-token`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data.csrf_token;
        
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
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

export const fetchCustomerDesigns = async () => {
    try{
        return fetchWithCredentials('/get_all_customer_designs');
    } catch (error) {
        console.error('Error fetching customer designs:', error);
        throw error;
    }
}

export const fetchAllOrders = async() => {
    try{
        const response = await fetchWithCredentials('/get_all_orders');
        return response;
    }catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
}
