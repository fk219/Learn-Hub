import React, { useState } from 'react'
import { Search, Filter, Eye, Edit, Trash2, MoreVertical, UserPlus } from 'lucide-react'

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const users = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'student',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      coursesEnrolled: 3,
      totalSpent: 247,
      progress: 65
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'instructor',
      joinDate: '2024-01-10',
      lastActive: '2024-01-19',
      coursesCreated: 2,
      totalEarned: 15420,
      students: 1250
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@example.com',
      role: 'student',
      joinDate: '2024-01-12',
      lastActive: '2024-01-18',
      coursesEnrolled: 5,
      totalSpent: 425,
      progress: 80
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'student',
      joinDate: '2024-01-08',
      lastActive: '2024-01-17',
      coursesEnrolled: 1,
      totalSpent: 89,
      progress: 25
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'instructor':
        return 'bg-blue-100 text-blue-800'
      case 'student':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 text-sm">Manage all users on your platform</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs font-medium text-gray-600">Total Users</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{users.length}</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-gray-600">Students</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{users.filter(u => u.role === 'student').length}</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-gray-600">Instructors</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{users.filter(u => u.role === 'instructor').length}</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-gray-600">Active Today</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {users.filter(u => u.lastActive === '2024-01-20').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.joinDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.lastActive}</td>
                  <td className="px-4 py-3">
                    {user.role === 'student' ? (
                      <div className="text-sm">
                        <div className="text-gray-900">{user.coursesEnrolled} courses</div>
                        <div className="text-gray-500">${user.totalSpent} spent</div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div className="text-gray-900">{user.coursesCreated} courses</div>
                        <div className="text-gray-500">${user.totalEarned} earned</div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.role === 'student' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${user.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{user.progress}%</span>
                      </div>
                    )}
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
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
          <span className="font-medium">{users.length}</span> results
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

export default Users