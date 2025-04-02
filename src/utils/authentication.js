"use client"
import {useState, useEffect, useContext, createContext} from 'react'
import {getUser} from "@/utils/api"

export const AuthContext = createContext(null)

export default function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchUser = async() => {
            try{
                const response = await getUser();
                if (response.email) {
                    setUser(response);
                }else{
                    setUser(null);
                }
            }catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            }
        }
        fetchUser();
    }, []);
    return (
        <AuthContext.Provider value = {{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}