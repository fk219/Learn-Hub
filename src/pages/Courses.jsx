import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, Clock, Users, ChevronDown, ShoppingCart, Heart } from 'lucide-react'
import { gsap } from 'gsap'

const Courses = () => {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const urlSearchTerm = searchParams.get('search') || ''
    setSearchTerm(urlSearchTerm)
  }, [searchParams])

  useEffect(() => {
    gsap.fromTo('.course-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    )
  }, [selectedCategory, selectedLevel, sortBy, searchTerm])

  const addToCart = (course) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item.id === course.id)
    
    if (!existingItem) {
      cart.push(course)
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('Course added to cart!')
      window.location.reload() // Refresh to update cart count
    } else {
      alert('Course already in cart!')
    }
  }

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'design', name: 'Design' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'data-science', name: 'Data Science' }
  ]

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ]

  const courses = [
    {
      id: 1,
      title: 'Complete React Development Course',
      instructor: 'John Smith',
      category: 'technology',
      level: 'intermediate',
      rating: 4.8,
      students: '12,543',
      duration: '40 hours',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 89,
      originalPrice: 149,
      description: 'Master React from basics to advanced concepts with hands-on projects.',
      features: ['40+ hours of content', 'Certificate of completion', 'Lifetime access', '24/7 support']
    },
    {
      id: 2,
      title: 'Data Science with Python',
      instructor: 'Dr. Sarah Johnson',
      category: 'data-science',
      level: 'beginner',
      rating: 4.9,
      students: '8,234',
      duration: '35 hours',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 79,
      originalPrice: 129,
      description: 'Learn data analysis, visualization, and machine learning with Python.',
      features: ['35+ hours of content', 'Real-world projects', 'Certificate included', 'Job assistance']
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      instructor: 'Mike Wilson',
      category: 'marketing',
      level: 'beginner',
      rating: 4.7,
      students: '15,678',
      duration: '25 hours',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 69,
      originalPrice: 99,
      description: 'Complete guide to digital marketing strategies and tools.',
      features: ['25+ hours of content', 'Marketing templates', 'Case studies', 'Expert support']
    },
    {
      id: 4,
      title: 'UX/UI Design Fundamentals',
      instructor: 'Emily Chen',
      category: 'design',
      level: 'beginner',
      rating: 4.8,
      students: '9,876',
      duration: '30 hours',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 85,
      originalPrice: 135,
      description: 'Design beautiful and user-friendly interfaces.',
      features: ['30+ hours of content', 'Design tools included', 'Portfolio projects', 'Mentorship']
    },
    {
      id: 5,
      title: 'Business Strategy & Analytics',
      instructor: 'Robert Davis',
      category: 'business',
      level: 'advanced',
      rating: 4.6,
      students: '5,432',
      duration: '45 hours',
      image: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 99,
      originalPrice: 179,
      description: 'Advanced business strategy and data-driven decision making.',
      features: ['45+ hours of content', 'Business templates', 'Case studies', 'Expert feedback']
    },
    {
      id: 6,
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Alex Kumar',
      category: 'technology',
      level: 'intermediate',
      rating: 4.9,
      students: '7,890',
      duration: '50 hours',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 119,
      originalPrice: 199,
      description: 'Comprehensive introduction to machine learning algorithms.',
      features: ['50+ hours of content', 'Python & R included', 'Real datasets', 'Career guidance']
    }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
                         course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return b.id - a.id
      default: // popular
        return parseInt(b.students.replace(/[^\d]/g, '')) - parseInt(a.students.replace(/[^\d]/g, ''))
    }
  })

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Explore Courses'}
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            {searchTerm 
              ? `Found ${sortedCourses.length} courses matching your search`
              : 'Discover high-quality courses to advance your skills'
            }
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              
              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Category</h4>
                  <div className="space-y-1">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-3 h-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-xs text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Level</h4>
                  <div className="space-y-1">
                    {levels.map(level => (
                      <label key={level.id} className="flex items-center">
                        <input
                          type="radio"
                          name="level"
                          value={level.id}
                          checked={selectedLevel === level.id}
                          onChange={(e) => setSelectedLevel(e.target.value)}
                          className="w-3 h-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-xs text-gray-700">{level.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">
                Showing {sortedCourses.length} of {courses.length} courses
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedCourses.map((course) => (
                <div key={course.id} className="course-card group">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-medium px-2 py-1 rounded-full capitalize">
                        {course.level}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-1">
                      {course.originalPrice && (
                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                        </span>
                      )}
                      <button className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Link
                        to={`/course/${course.id}`}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900 text-xs">{course.rating}</span>
                        <span className="text-gray-500 text-xs">({course.students})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="text-xs text-gray-600 mb-2">{course.instructor}</div>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">${course.price}</span>
                        {course.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">${course.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      {course.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(course)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg transition-colors duration-200 font-medium text-xs flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                      <Link
                        to={`/course/${course.id}`}
                        className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 text-sm">
                  {searchTerm 
                    ? `No courses match "${searchTerm}". Try adjusting your search or filter criteria.`
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses