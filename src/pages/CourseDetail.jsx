import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Play, Star, Clock, Users, Globe, Award, BookOpen, CheckCircle, Download, Share2, Heart, ChevronRight, Calendar, Video, FileText, Pizza as Quiz } from 'lucide-react'

const CourseDetail = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    gsap.fromTo('.course-hero',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
    
    gsap.fromTo('.course-content',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
    )
  }, [])

  // Mock course data - in real app, fetch based on id
  const course = {
    id: parseInt(id),
    title: 'Machine Learning Specialization',
    instructor: 'Andrew Ng',
    instructorTitle: 'Co-founder of Coursera, Adjunct Professor at Stanford',
    instructorImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    university: 'Stanford University',
    rating: 4.9,
    reviewCount: '150K',
    students: '2.1M',
    duration: '3 months',
    level: 'Beginner',
    language: 'English',
    subtitles: ['English', 'Spanish', 'French'],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: '$49',
    originalPrice: '$79',
    description: 'Master the fundamentals of machine learning and build your first ML models with hands-on projects.',
    longDescription: `This comprehensive Machine Learning Specialization will teach you the fundamentals of machine learning and how to use these techniques to build real-world AI applications. You'll learn about supervised learning, unsupervised learning, and best practices used in Silicon Valley for artificial intelligence and machine learning innovation.

By the end of this specialization, you will have mastered key concepts and gained the practical know-how to quickly and powerfully apply machine learning to challenging real-world problems.`,
    skills: [
      'Machine Learning Algorithms',
      'Python Programming',
      'Data Analysis',
      'Neural Networks',
      'Deep Learning',
      'TensorFlow'
    ],
    whatYouLearn: [
      'Build machine learning models in Python using popular libraries NumPy and scikit-learn',
      'Build and train supervised machine learning models for prediction and binary classification tasks',
      'Build and train a neural network with TensorFlow to perform multi-class classification',
      'Apply best practices for machine learning development so that your models generalize to data and tasks in the real world',
      'Build and use decision trees and tree ensemble methods, including random forests and boosted trees',
      'Use unsupervised learning techniques for unsupervised learning including clustering and anomaly detection'
    ],
    syllabus: [
      {
        week: 1,
        title: 'Introduction to Machine Learning',
        duration: '6 hours',
        lessons: [
          { type: 'video', title: 'What is Machine Learning?', duration: '15 min' },
          { type: 'video', title: 'Supervised vs Unsupervised Learning', duration: '12 min' },
          { type: 'reading', title: 'Course Resources', duration: '10 min' },
          { type: 'quiz', title: 'Week 1 Quiz', duration: '30 min' }
        ]
      },
      {
        week: 2,
        title: 'Linear Regression',
        duration: '8 hours',
        lessons: [
          { type: 'video', title: 'Linear Regression Model', duration: '20 min' },
          { type: 'video', title: 'Cost Function', duration: '18 min' },
          { type: 'video', title: 'Gradient Descent', duration: '25 min' },
          { type: 'assignment', title: 'Programming Assignment', duration: '2 hours' }
        ]
      },
      {
        week: 3,
        title: 'Classification',
        duration: '10 hours',
        lessons: [
          { type: 'video', title: 'Logistic Regression', duration: '22 min' },
          { type: 'video', title: 'Decision Boundary', duration: '15 min' },
          { type: 'video', title: 'Regularization', duration: '20 min' },
          { type: 'assignment', title: 'Classification Project', duration: '3 hours' }
        ]
      }
    ],
    prerequisites: [
      'Basic programming knowledge (Python preferred)',
      'High school level mathematics',
      'No prior machine learning experience required'
    ],
    certificate: {
      available: true,
      shareable: true,
      addToLinkedIn: true
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'syllabus', name: 'Syllabus' },
    { id: 'instructor', name: 'Instructor' },
    { id: 'reviews', name: 'Reviews' }
  ]

  const getIconForLessonType = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'reading': return <FileText className="w-4 h-4" />
      case 'quiz': return <Quiz className="w-4 h-4" />
      case 'assignment': return <BookOpen className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Course Hero Section */}
      <div className="course-hero bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="text-coursera-lightblue text-sm font-medium">{course.university}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-300">({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {course.skills.slice(0, 4).map((skill, index) => (
                  <span key={index} className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                {course.skills.length > 4 && (
                  <span className="text-gray-300 text-sm">+{course.skills.length - 4} more</span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button className="bg-coursera-blue hover:bg-coursera-darkblue text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                  {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                </button>
                <button className="border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button className="p-3 border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="relative mb-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg hover:bg-black/40 transition-colors duration-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-coursera-blue ml-1" />
                    </div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-coursera-blue">{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">{course.originalPrice}</span>
                    )}
                  </div>
                  <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                    38% off
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center justify-between">
                    <span>Level:</span>
                    <span className="font-medium text-gray-900">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span className="font-medium text-gray-900">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Language:</span>
                    <span className="font-medium text-gray-900">{course.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Certificate:</span>
                    <span className="font-medium text-gray-900">Yes</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEnrolled(!isEnrolled)}
                  className="w-full bg-coursera-blue hover:bg-coursera-darkblue text-white py-3 rounded-lg font-semibold transition-colors duration-200 mb-3"
                >
                  {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                </button>
                
                <button className="w-full border border-coursera-blue text-coursera-blue hover:bg-coursera-blue hover:text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
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

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Course</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{course.longDescription}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouLearn.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills you'll gain</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, index) => (
                      <span key={index} className="bg-coursera-blue/10 text-coursera-blue px-3 py-2 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h3>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <ChevronRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Syllabus</h2>
                <div className="space-y-4">
                  {course.syllabus.map((week) => (
                    <div key={week.week} className="bg-white border border-gray-200 rounded-lg">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Week {week.week}: {week.title}
                          </h3>
                          <span className="text-sm text-gray-500">{week.duration}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {week.lessons.map((lesson, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                              <div className="text-gray-400">
                                {getIconForLessonType(lesson.type)}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{lesson.title}</div>
                              </div>
                              <div className="text-sm text-gray-500">{lesson.duration}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet your Instructor</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-6">
                    <img
                      src={course.instructorImage}
                      alt={course.instructor}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.instructor}</h3>
                      <p className="text-gray-600 mb-4">{course.instructorTitle}</p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Andrew Ng is a globally recognized leader in AI. He is the founder of DeepLearning.AI, 
                        co-founder of Coursera, and an Adjunct Professor at Stanford University. He was formerly 
                        Chief Scientist at Baidu and founding lead of Google Brain.
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>4.9 Instructor Rating</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>5.2M Students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>12 Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{course.rating}</div>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{course.reviewCount} reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-600 w-8">{stars}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : stars === 3 ? 2 : stars === 2 ? 1 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {stars === 5 ? '85%' : stars === 4 ? '12%' : stars === 3 ? '2%' : stars === 2 ? '1%' : '0%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: 'Sarah Johnson',
                      rating: 5,
                      date: '2 weeks ago',
                      review: 'Excellent course! Andrew Ng explains complex concepts in a very clear and understandable way. The programming assignments are challenging but rewarding.'
                    },
                    {
                      name: 'Michael Chen',
                      rating: 5,
                      date: '1 month ago',
                      review: 'This course gave me a solid foundation in machine learning. The practical exercises helped me understand the theory better.'
                    },
                    {
                      name: 'Emily Rodriguez',
                      rating: 4,
                      date: '2 months ago',
                      review: 'Great content and well-structured. Some of the math can be challenging, but the explanations are thorough.'
                    }
                  ].map((review, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-coursera-blue rounded-full flex items-center justify-center text-white font-semibold">
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">{review.name}</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Certificate Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 text-coursera-blue" />
                  <h3 className="text-lg font-semibold text-gray-900">Earn a Certificate</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Get a shareable certificate when you complete this course
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Shareable certificate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Add to LinkedIn profile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Add to resume or CV</span>
                  </div>
                </div>
              </div>

              {/* Related Courses */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Courses</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Deep Learning Specialization',
                      instructor: 'Andrew Ng',
                      rating: 4.8,
                      price: '$59'
                    },
                    {
                      title: 'Python for Data Science',
                      instructor: 'IBM',
                      rating: 4.6,
                      price: '$42'
                    }
                  ].map((relatedCourse, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <h4 className="font-medium text-gray-900 mb-1 text-sm">{relatedCourse.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{relatedCourse.instructor}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{relatedCourse.rating}</span>
                        </div>
                        <span className="text-sm font-semibold text-coursera-blue">{relatedCourse.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail