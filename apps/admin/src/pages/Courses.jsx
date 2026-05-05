import React, { useEffect, useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreVertical } from 'lucide-react'
import { apiFetch } from '../lib/apiClient'

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [courses, setCourses] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: '',
    imageUrl: '',
    published: true,
  })
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    apiFetch('/api/admin/courses')
      .then((r) => {
        const mapped = (r.items || []).map((c) => ({
          id: c._id,
          title: c.title,
          instructor: 'Admin',
          category: c.category,
          price: Math.round((c.priceCents || 0) / 100),
          students: 0,
          status: c.published ? 'published' : 'draft',
          createdAt: c.createdAt ? String(c.createdAt).slice(0, 10) : '',
          revenue: 0,
        }))
        setCourses(mapped)
      })
      .catch(() => {
        setCourses([])
      })
  }, [])

  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target
    setCreateForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const submitCreate = async () => {
    setCreateError('')
    try {
      const priceCents = Math.round(parseFloat(createForm.price || '0') * 100)
      const res = await apiFetch('/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: createForm.title,
          description: createForm.description,
          category: createForm.category,
          level: createForm.level,
          priceCents,
          currency: 'usd',
          imageUrl: createForm.imageUrl,
          published: createForm.published,
        }),
      })

      setCourses((prev) => [
        {
          id: res.course._id,
          title: res.course.title,
          instructor: 'Admin',
          category: res.course.category,
          price: Math.round((res.course.priceCents || 0) / 100),
          students: 0,
          status: res.course.published ? 'published' : 'draft',
          createdAt: res.course.createdAt ? String(res.course.createdAt).slice(0, 10) : '',
          revenue: 0,
        },
        ...prev,
      ])
      setIsCreating(false)
      setCreateForm({
        title: '',
        description: '',
        category: '',
        level: '',
        price: '',
        imageUrl: '',
        published: true,
      })
    } catch (e) {
      setCreateError(e?.message || 'Failed to create course')
    }
  }

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
        <button onClick={() => setIsCreating(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {isCreating && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Create Course</h2>
            <button onClick={() => setIsCreating(false)} className="text-sm text-gray-600 hover:text-gray-900">Close</button>
          </div>
          {createError && <div className="text-sm text-red-600 mb-3">{createError}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input name="title" value={createForm.title} onChange={handleCreateChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input name="level" value={createForm.level} onChange={handleCreateChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input name="category" value={createForm.category} onChange={handleCreateChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <input name="price" value={createForm.price} onChange={handleCreateChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input name="imageUrl" value={createForm.imageUrl} onChange={handleCreateChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={createForm.description} onChange={handleCreateChange} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" rows={3} />
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input type="checkbox" name="published" checked={createForm.published} onChange={handleCreateChange} />
                <span>Published</span>
              </label>
              <button onClick={submitCreate} className="btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}

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
