const API_URL = "http://localhost:8000/api";  

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