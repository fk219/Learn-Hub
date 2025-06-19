import React, { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    gsap.fromTo('.admin-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    )
  }, [activeTab])

  // Mock data
  const stats = [
    { icon: Users, label: 'Total Users', value: '12,543', change: '+12%', color: 'blue' },
    { icon: BookOpen, label: 'Total Courses', value: '1,247', change: '+8%', color: 'green' },
    { icon: DollarSign, label: 'Revenue', value: '$89,432', change: '+23%', color: 'purple' },
    { icon: TrendingUp, label: 'Enrollments', value: '45,678', change: '+15%', color: 'orange' }
  ]

  const recentCourses = [
    {
      id: 1,
      title: 'Advanced React Development',
      instructor: 'John Smith',
      status: 'pending',
      students: 0,
      revenue: '$0',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Machine Learning Basics',
      instructor: 'Dr. Sarah Johnson',
      status: 'approved',
      students: 1250,
      revenue: '$12,500',
      date: '2024-01-14'
    },
    {
      id: 3,
      title: 'Digital Marketing Strategy',
      instructor: 'Mike Wilson',
      status: 'rejected',
      students: 0,
      revenue: '$0',
      date: '2024-01-13'
    }
  ]

  const recentUsers = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'Student',
      joinDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'Instructor',
      joinDate: '2024-01-14',
      status: 'active'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@example.com',
      role: 'Student',
      joinDate: '2024-01-13',
      status: 'inactive'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'rejected':
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'courses', name: 'Courses' },
    { id: 'users', name: 'Users' },
    { id: 'instructors', name: 'Instructors' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'settings', name: 'Settings' }
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your learning platform</p>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-coursera-blue text-coursera-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="admin-card bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Courses */}
              <div className="admin-card bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Course Submissions</h3>
                    <button className="text-coursera-blue hover:text-coursera-darkblue text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{course.title}</h4>
                          <p className="text-sm text-gray-600">by {course.instructor}</p>
                          <p className="text-xs text-gray-500 mt-1">{course.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                            {getStatusIcon(course.status)}
                            <span className="ml-1 capitalize">{course.status}</span>
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="admin-card bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent User Registrations</h3>
                    <button className="text-coursera-blue hover:text-coursera-darkblue text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-coursera-blue rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">{user.role} • {user.joinDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1 capitalize">{user.status}</span>
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
              <button className="bg-coursera-blue hover:bg-coursera-darkblue text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coursera-blue"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.date}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.instructor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                            {getStatusIcon(course.status)}
                            <span className="ml-1 capitalize">{course.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.students}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.revenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-coursera-blue hover:text-coursera-darkblue">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'overview' && activeTab !== 'courses' && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.name} Management
            </h3>
            <p className="text-gray-600">
              This section is under development. Advanced {activeTab} management features will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard