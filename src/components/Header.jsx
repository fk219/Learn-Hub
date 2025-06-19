import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu, X, User, ShoppingCart, Bell, BookOpen, Settings, LogOut } from 'lucide-react'
import { gsap } from 'gsap'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check for user session
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
    }

    // Check cart count
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.length)
  }, [])

  useEffect(() => {
    gsap.fromTo('.header-animate', 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
    }
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    setCartCount(0)
    setShowUserMenu(false)
    navigate('/')
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const notifications = [
    { id: 1, message: 'New course available: Advanced React', time: '2 hours ago', unread: true },
    { id: 2, message: 'Assignment due tomorrow', time: '1 day ago', unread: true },
    { id: 3, message: 'Course completed: JavaScript Basics', time: '3 days ago', unread: false },
  ]

  return (
    <header className={`header-animate fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                  location.pathname === item.path
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-700">View all notifications</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <Link to="/cart" className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-3 border-b border-gray-200">
                        <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/my-courses" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <BookOpen className="w-4 h-4 mr-3" />
                          My Courses
                        </Link>
                        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/signin" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </form>
              </div>
              
              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="px-3 py-2 space-y-2">
                  <Link to="/signin" className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Sign In
                  </Link>
                  <Link to="/signup" className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header