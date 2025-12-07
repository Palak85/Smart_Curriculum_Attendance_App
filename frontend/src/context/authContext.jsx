import React from 'react'
import { useContext ,useState,useEffect} from 'react'
import { createContext } from 'react'
import axios from 'axios'

const userContext = createContext()

const authContext = ({children}) => {
    const [user,setUser] = useState(null)
    const[loading,setLoading] = useState(true)

    useEffect(() => {
        const verifyUser = async () => {
           
            try{
                const token = localStorage.getItem('token')
                if(token){
                const response = await axios.get('http://localhost:3000/api/auth/verify' , {
                    headers: {
                        "Authorization" : `Bearer ${token}`
                    }
                })
                if(response.data.success){
                    setUser(response.data.user)
                }
            }else{
                setUser(null)
            }
            }
            catch(error){
                if(error.response && !error.response.data.error){
                    setUser(null)
                }
            }
            finally{
                setLoading(false)
            }
        }
        verifyUser()
    },[])

    const login = (userData) => {
        setUser(userData)
    }

    const logout = () =>{
        setUser(null)
        localStorage.removeItem("token")
    }
  return (
    <userContext.Provider value={{user,login,logout,loading}}>

        {children}

    </userContext.Provider>

  )
}

export const useAuth = () => useContext(userContext)
export default authContext

