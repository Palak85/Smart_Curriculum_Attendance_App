
import React, { useState } from 'react'
import axios from "axios"
import { useContext } from 'react'
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/authContext"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error,setError] = useState(null)
    const {login} = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                { email, password }
            )
            // console.log(response)
            if(response.data.success){
                login(response.data.user)
                localStorage.setItem("token",response.data.token)
                if(response.data.user.role === "admin"){
                    navigate('/admin-dashboard')
                }
                else if(response.data.user.role === "teacher"){
                    navigate('/teacher-dashboard')
                }
                else{
                    navigate('/employee-dashboard')
                }
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                setError(error.response.data.error)
            }
            else{
                setError("Server Error")
            }
        }
    }

    return (
        <div className="flex flex-col items-center h-screen justify-center bg-linear-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      
            <h2 className="font-sevillana text-3xl text-white">Employee Management System</h2>
      
            <div className="border shadow p-6 w-80 bg-white rounded-md">
                <h2 className="text-2xl font-bold mb-4">Login</h2>

                {error && <p className='text-red-500'>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full px-3 py-2 border rounded"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            className="w-full px-3 py-2 border rounded"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-gray-700">
                            <input type="checkbox" className="form-checkbox" />
                            <span className="ml-2">Remember me</span>
                        </label>

                        <a href="#" className="text-sm text-teal-600 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login



