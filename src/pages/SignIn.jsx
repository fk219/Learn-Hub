import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'


const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    gsap.fromTo('.signin-form',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    )
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (formData.email && formData.password.length >= 6) {
        const userData = {
          email: formData.email,
          name: formData.email.split('@')[0],
          loginMethod: 'email'
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
        navigate('/')
        alert('Successfully signed in!')
      } else {
        setErrors({ general: 'Invalid email or password' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
      
      const userData = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        loginMethod: 'google'
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      navigate('/')
      alert('Successfully signed in with Google!')
    } catch (error) {
      console.error('Google login failed:', error)
      setErrors({ general: 'Google login failed. Please try again.' })
    }
  }

  const handleGoogleError = () => {
    setErrors({ general: 'Google login failed. Please try again.' })
  }

  const handleFacebookResponse = (response) => {
    if (response && response.email) {
      const userData = {
        email: response.email,
        name: response.name,
        picture: response.picture?.data?.url,
        loginMethod: 'facebook'
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      navigate('/')
      alert('Successfully signed in with Facebook!')
    } else {
      setErrors({ general: 'Facebook login failed. Please try again.' })
    }
  }

  return (
    <div className="pt-14 min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="signin-form max-w-md w-full space-y-6">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">LearnHub</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 text-sm">Sign in to continue your learning journey</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-3 h-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-xs text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="medium"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
              />

              <FacebookLogin
                appId="your-facebook-app-id" // Replace with your Facebook App ID
                autoLoad={false}
                fields="name,email,picture"
                callback={handleFacebookResponse}
                cssClass="w-full inline-flex justify-center py-2 px-3 border border-gray-200 rounded-lg shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
                textButton="Facebook"
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn