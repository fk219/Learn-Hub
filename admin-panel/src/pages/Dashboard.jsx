import React from 'react'
import { Users, BookOpen, DollarSign, TrendingUp, Eye, Plus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Dashboard = () => {
  const stats = [
    { name: 'Total Users', value: '12,543', change: '+12%', icon: Users, color: 'blue' },
    { name: 'Total Courses', value: '247', change: '+8%', icon: BookOpen, color: 'green' },
    { name: 'Revenue', value: '$89,432', change: '+23%', icon: DollarSign, color: 'purple' },
    { name: 'Enrollments', value: '45,678', change: '+15%', icon: TrendingUp, color: 'orange' }
  ]

  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 5500 },
  ]

  const enrollmentData = [
    { month: 'Jan', enrollments: 400 },
    { month: 'Feb', enrollments: 300 },
    { month: 'Mar', enrollments: 500 },
    { month: 'Apr', enrollments: 450 },
    { month: 'May', enrollments: 600 },
    { month: 'Jun', enrollments: 550 },
  ]

  const recentCourses = [
    { id: 1, title: 'Advanced React Development', instructor: 'John Smith', students: 1250, status: 'published' },
    { id: 2, title: 'Machine Learning Basics', instructor: 'Dr. Sarah Johnson', students: 890, status: 'published' },
    { id: 3, title: 'Digital Marketing Strategy', instructor: 'Mike Wilson', students: 567, status: 'draft' },
  ]

  const recentUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2024-01-15', courses: 3 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', joinDate: '2024-01-14', courses: 1 },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', joinDate: '2024-01-13', courses: 5 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Enrollments</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enrollments" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Courses</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{course.title}</h4>
                  <p className="text-xs text-gray-600">by {course.instructor}</p>
                  <p className="text-xs text-gray-500">{course.students} students</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{user.name}</h4>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Joined {user.joinDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.courses}</p>
                  <p className="text-xs text-gray-500">courses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard