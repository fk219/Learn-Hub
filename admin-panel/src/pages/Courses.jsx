import React, { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreVertical } from 'lucide-react'

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const courses = [
    {
      id: 1,
      title: 'Complete React Development Course',
      instructor: 'John Smith',
      category: 'Technology',
      price: 89,
      students: 1250,
      status: 'published',
      createdAt: '2024-01-15',
      revenue: 111250
    },
    {
      id: 2,
      title: 'Data Science with Python',
      instructor: 'Dr. Sarah Johnson',
      category: 'Data Science',
      price: 79,
      students: 890,
      status: 'published',
      createdAt: '2024-01-10',
      revenue: 70310
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      instructor: 'Mike Wilson',
      category: 'Marketing',
      price: 69,
      students: 567,
      status: 'draft',
      createdAt: '2024-01-12',
      revenue: 39123
    },
    {
      id: 4,
      title: 'UX/UI Design Fundamentals',
      instructor: 'Emily Chen',
      category: 'Design',
      price: 85,
      students: 432,
      status: 'published',
      createdAt: '2024-01-08',
      revenue: 36720
    }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 text-sm">Manage all courses on your platform</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500">Created {course.createdAt}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{course.instructor}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{course.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${course.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{course.students.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${course.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCourses.length}</span> of{' '}
          <span className="font-medium">{courses.length}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary">Previous</button>
          <button className="btn-primary">1</button>
          <button className="btn-secondary">2</button>
          <button className="btn-secondary">3</button>
          <button className="btn-secondary">Next</button>
        </div>
      </div>
    </div>
  )
}

export default Courses