import React, { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Users } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  })

  useEffect(() => {
    gsap.fromTo('.contact-form',
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
    
    gsap.fromTo('.contact-info',
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' }
    )
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: ''
    })
    // Show success message
    alert('Thank you for your message! We\'ll get back to you soon.')
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@learnhub.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm PST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Learning Street, San Francisco, CA 94105',
      description: 'Come say hello at our office'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Friday: 8am - 6pm PST',
      description: 'We\'re here to help during business hours'
    }
  ]

  const supportCategories = [
    {
      icon: HelpCircle,
      title: 'General Support',
      description: 'Questions about courses, certificates, or account issues'
    },
    {
      icon: Users,
      title: 'Business Inquiries',
      description: 'Corporate training, partnerships, or bulk enrollments'
    },
    {
      icon: MessageCircle,
      title: 'Technical Support',
      description: 'Platform issues, login problems, or technical difficulties'
    }
  ]

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Simply browse our course catalog, select the course you want, and click "Enroll Now". You can pay with credit card or PayPal.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 7-day money-back guarantee for all paid courses. Contact support to request a refund.'
    },
    {
      question: 'Are certificates recognized by employers?',
      answer: 'Our certificates are issued by top universities and companies, and are widely recognized by employers worldwide.'
    },
    {
      question: 'Can I access courses offline?',
      answer: 'Yes, you can download course videos and materials for offline viewing through our mobile app.'
    }
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="contact-form">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coursera-blue focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coursera-blue focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coursera-blue focus:border-transparent"
                  >
                    <option value="general">General Support</option>
                    <option value="technical">Technical Support</option>
                    <option value="business">Business Inquiries</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coursera-blue focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coursera-blue focus:border-transparent resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-coursera-blue hover:bg-coursera-darkblue text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="contact-info space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map(({ icon: Icon, title, details, description }, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-coursera-blue/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-coursera-blue" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                      <p className="text-coursera-blue font-medium mb-1">{details}</p>
                      <p className="text-gray-600 text-sm">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Categories */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
              <div className="space-y-4">
                {supportCategories.map(({ icon: Icon, title, description }, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <Icon className="w-6 h-6 text-coursera-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                      <p className="text-gray-600 text-sm">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive map would be displayed here</p>
                <p className="text-sm text-gray-400">123 Learning Street, San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact