import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock, CheckCircle, BookOpen, Award, BarChart3 } from 'lucide-react'
import { apiFetch } from '../lib/apiClient'

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    apiFetch('/api/me/enrollments')
      .then((r) => {
        const mapped = (r.items || []).map((i) => ({
          id: i.course?._id || i.course?.id || i.id,
          title: i.course?.title || 'Course',
          instructor: 'LearnHub',
          image: i.course?.imageUrl || '',
          progress: 0,
          totalLessons: 0,
          completedLessons: 0,
          duration: 'Self-paced',
          enrolledDate: i.createdAt ? String(i.createdAt).slice(0, 10) : '',
          status: 'in-progress',
        }))
        setEnrolledCourses(mapped)
      })
      .catch(() => {
        setEnrolledCourses([])
      })
  }, [])

  const filteredCourses = enrolledCourses.filter(course => {
    if (activeTab === 'all') return true
    if (activeTab === 'in-progress') return course.status === 'in-progress'
    if (activeTab === 'completed') return course.status === 'completed'
    return true
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const tabs = [
    { id: 'all', name: 'All Courses', count: enrolledCourses.length },
    { id: 'in-progress', name: 'In Progress', count: enrolledCourses.filter(c => c.status === 'in-progress').length },
    { id: 'completed', name: 'Completed', count: enrolledCourses.filter(c => c.status === 'completed').length }
  ]

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Learning</h1>
          <p className="text-gray-600 text-sm">Track your progress and continue learning</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
                <p className="text-xs text-gray-600">Total Courses</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length) || 0}%
                </p>
                <p className="text-xs text-gray-600">Avg Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {enrolledCourses.filter(c => c.status === 'completed').length}
                </p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {enrolledCourses.filter(c => c.certificateUrl).length}
                </p>
                <p className="text-xs text-gray-600">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    {course.status === 'in-progress' ? 'In Progress' : 'Completed'}
                  </span>
                </div>
                {course.status === 'in-progress' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Link
                      to={`/course/${course.id}/learn`}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Continue</span>
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{course.title}</h3>
                <p className="text-xs text-gray-600 mb-3">By {course.instructor}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{course.progress}% complete</span>
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {course.status === 'in-progress' && course.lastWatched && (
                  <p className="text-xs text-gray-500 mb-3">
                    Last watched: {course.lastWatched}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {course.status === 'completed' && course.certificateUrl && (
                      <a
                        href={course.certificateUrl}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Certificate
                      </a>
                    )}
                    <Link
                      to={`/course/${course.id}`}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6 text-sm">
              {activeTab === 'all' 
                ? "You haven't enrolled in any courses yet."
                : `No ${activeTab.replace('-', ' ')} courses found.`
              }
            </p>
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCourses
