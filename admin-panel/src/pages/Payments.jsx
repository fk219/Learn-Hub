import React, { useState } from 'react'
import { Search, Filter, Download, Eye, MoreVertical, CreditCard } from 'lucide-react'

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const payments = [
    {
      id: 'PAY-001',
      user: 'Alice Johnson',
      email: 'alice@example.com',
      course: 'Complete React Development',
      amount: 89,
      status: 'completed',
      method: 'stripe',
      date: '2024-01-20',
      transactionId: 'txn_1234567890'
    },
    {
      id: 'PAY-002',
      user: 'Bob Smith',
      email: 'bob@example.com',
      course: 'Data Science with Python',
      amount: 79,
      status: 'completed',
      method: 'paypal',
      date: '2024-01-19',
      transactionId: 'txn_0987654321'
    },
    {
      id: 'PAY-003',
      user: 'Carol Davis',
      email: 'carol@example.com',
      course: 'Digital Marketing Mastery',
      amount: 69,
      status: 'pending',
      method: 'stripe',
      date: '2024-01-18',
      transactionId: 'txn_1122334455'
    },
    {
      id: 'PAY-004',
      user: 'David Wilson',
      email: 'david@example.com',
      course: 'UX/UI Design Fundamentals',
      amount: 85,
      status: 'failed',
      method: 'stripe',
      date: '2024-01-17',
      transactionId: 'txn_5566778899'
    }
  ]

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodIcon = (method) => {
    switch (method) {
      case 'stripe':
        return '💳'
      case 'paypal':
        return '🅿️'
      default:
        return '💰'
    }
  }

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 text-sm">Track all transactions and revenue</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs font-medium text-gray-600">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">${pendingAmount}</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{payments.filter(p => p.status === 'completed').length}</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-gray-600">Failed</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{payments.filter(p => p.status === 'failed').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                    <div className="text-xs text-gray-500">{payment.transactionId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                    <div className="text-xs text-gray-500">{payment.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{payment.course}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${payment.amount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getMethodIcon(payment.method)}</span>
                      <span className="text-sm text-gray-900 capitalize">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{payment.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
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
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{' '}
          <span className="font-medium">{payments.length}</span> results
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

export default Payments