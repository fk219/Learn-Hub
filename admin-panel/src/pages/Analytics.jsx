import React from 'react'
import { TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const Analytics = () => {
  const revenueData = [
    { month: 'Jan', revenue: 4000, users: 240 },
    { month: 'Feb', revenue: 3000, users: 198 },
    { month: 'Mar', revenue: 5000, users: 300 },
    { month: 'Apr', revenue: 4500, users: 278 },
    { month: 'May', revenue: 6000, users: 389 },
    { month: 'Jun', revenue: 5500, users: 349 },
  ]

  const courseData = [
    { category: 'Technology', courses: 45, revenue: 25000 },
    { category: 'Business', courses: 32, revenue: 18000 },
    { category: 'Design', courses: 28, revenue: 15000 },
    { category: 'Marketing', courses: 22, revenue: 12000 },
    { category: 'Data Science', courses: 18, revenue: 20000 },
  ]

  const userGrowthData = [
    { month: 'Jan', students: 1200, instructors: 45 },
    { month: 'Feb', students: 1450, instructors: 52 },
    { month: 'Mar', students: 1800, instructors: 58 },
    { month: 'Apr', students: 2100, instructors: 65 },
    { month: 'May', students: 2500, instructors: 72 },
    { month: 'Jun', students: 2800, instructors: 78 },
  ]

  const pieData = [
    { name: 'Technology', value: 35, color: '#3b82f6' },
    { name: 'Business', value: 25, color: '#10b981' },
    { name: 'Design', value: 20, color: '#f59e0b' },
    { name: 'Marketing', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 text-sm">Detailed insights into your platform performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$89,432</p>
              <p className="text-xs text-green-600 mt-1">+23% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12,543</p>
              <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Course Completions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3,247</p>
              <p className="text-xs text-purple-600 mt-1">+18% from last month</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Avg. Course Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4.8</p>
              <p className="text-xs text-yellow-600 mt-1">+0.2 from last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="courses" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#10b981" />
              <Bar dataKey="instructors" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Enrollments</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Complete React Development</td>
                <td className="px-4 py-2 text-sm text-gray-900">1,250</td>
                <td className="px-4 py-2 text-sm text-gray-900">$111,250</td>
                <td className="px-4 py-2 text-sm text-gray-900">4.9</td>
                <td className="px-4 py-2 text-sm text-gray-900">85%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">Data Science with Python</td>
                <td className="px-4 py-2 text-sm text-gray-900">890</td>
                <td className="px-4 py-2 text-sm text-gray-900">$70,310</td>
                <td className="px-4 py-2 text-sm text-gray-900">4.8</td>
                <td className="px-4 py-2 text-sm text-gray-900">78%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">UX/UI Design Fundamentals</td>
                <td className="px-4 py-2 text-sm text-gray-900">567</td>
                <td className="px-4 py-2 text-sm text-gray-900">$48,195</td>
                <td className="px-4 py-2 text-sm text-gray-900">4.7</td>
                <td className="px-4 py-2 text-sm text-gray-900">82%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics