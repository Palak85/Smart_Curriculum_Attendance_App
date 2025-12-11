
// import React, { useState } from 'react'
// import axios from "axios"
// import { useContext } from 'react'
// import {useNavigate} from "react-router-dom"
// import {useAuth} from "../context/authContext"

// const Login = () => {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error,setError] = useState(null)
//     const {login} = useAuth()
//     const navigate = useNavigate()

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         try {
//             const response = await axios.post(
//                 "http://localhost:3000/api/auth/login",
//                 { email, password }
//             )
//             // console.log(response)
//             if(response.data.success){
//                 login(response.data.user)
//                 localStorage.setItem("token",response.data.token)
//                 if(response.data.user.role === "admin"){
//                     navigate('/admin-dashboard')
//                 }
//                 else if(response.data.user.role === "teacher"){
//                     navigate('/teacher-dashboard')
//                 }
//                 else if(response.data.user.role === "student" || response.data.user.role === "parent"){
//                     navigate('/student-dashboard')
//                 }
//                 else{
//                     navigate('/employee-dashboard')
//                 }
//             }
//         } catch (error) {
//             if(error.response && !error.response.data.success){
//                 setError(error.response.data.error)
//             }
//             else{
//                 setError("Server Error")
//             }
//         }
//     }

//     return (
//         <div className="flex flex-col items-center h-screen justify-center bg-linear-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      
//             <h2 className="font-sevillana text-3xl text-white">Student Management System</h2>
      
//             <div className="border shadow p-6 w-80 bg-white rounded-md">
//                 <h2 className="text-2xl font-bold mb-4">Login</h2>

//                 {error && <p className='text-red-500'>{error}</p>}

//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-700">Email</label>
//                         <input
//                             type="email"
//                             placeholder="Enter Email"
//                             className="w-full px-3 py-2 border rounded"
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700">Password</label>
//                         <input
//                             type="password"
//                             placeholder="********"
//                             className="w-full px-3 py-2 border rounded"
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="flex items-center justify-between mb-4">
//                         <label className="flex items-center text-gray-700">
//                             <input type="checkbox" className="form-checkbox" />
//                             <span className="ml-2">Remember me</span>
//                         </label>

//                         <a href="#" className="text-sm text-teal-600 hover:underline">
//                             Forgot Password?
//                         </a>
//                     </div>

//                     <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded">
//                         Login
//                     </button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Login


import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(
    Boolean(localStorage.getItem('rememberMe'))
  )

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password }
      )

      if (response.data.success) {
        login(response.data.user)
        localStorage.setItem('token', response.data.token)

        // remember me (simple implementation)
        if (remember) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('savedEmail', email)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('savedEmail')
        }

        const role = response.data.user.role
        if (role === 'admin') navigate('/admin-dashboard')
        else if (role === 'teacher') navigate('/teacher-dashboard')
        else if (role === 'student' || role === 'parent')
          navigate('/student-dashboard')
        else navigate('/employee-dashboard')
      } else {
        setError(response.data.error || 'Login failed')
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      } else {
        setError('Server Error. Try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Prefill email if "remember me" was set earlier
  React.useEffect(() => {
    const saved = localStorage.getItem('savedEmail')
    if (saved) setEmail(saved)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-sky-100 p-6">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          {/* simple logo */}
          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h18" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3v18" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-semibold">Smart Curriculum</h1>
            <p className="text-sm text-gray-500">Attendance & Student Management</p>
          </div>
        </div>

        <h2 className="text-xl font-medium mb-4">Welcome back 👋</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            placeholder="you@school.com"
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="Enter your password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-2 text-sm px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="inline-flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="form-checkbox h-4 w-4 text-teal-600"
              />
              <span className="ml-2">Remember me</span>
            </label>

            <Link to="/forgot-password" className="text-sm text-teal-600 hover:underline">
              Forgot?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-teal-600 text-white py-2 rounded-lg font-medium hover:opacity-95 disabled:opacity-70"
          >
            {loading && (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            <span>{loading ? 'Signing in...' : 'Login'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 hover:underline">
            Sign up
          </Link>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Smart Curriculum — All rights reserved
        </div>
      </div>
    </div>
  )
}

