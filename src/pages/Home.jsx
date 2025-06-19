import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, Star, Users, BookOpen, Award, TrendingUp, Clock, Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const featuresRef = useRef(null)

  useEffect(() => {
    // Hero Animation
    const tl = gsap.timeline()
    tl.fromTo('.hero-title', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    )
    .fromTo('.hero-subtitle', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.hero-buttons', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )

    // Stats Animation
    gsap.fromTo('.stat-item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        }
      }
    )

    // Features Animation
    gsap.fromTo('.feature-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        }
      }
    )
  }, [])

  const stats = [
    { icon: Users, value: '50M+', label: 'Learners Worldwide' },
    { icon: BookOpen, value: '5,000+', label: 'Expert-Led Courses' },
    { icon: Award, value: '100+', label: 'University Partners' },
    { icon: Globe, value: '190+', label: 'Countries Served' }
  ]

  const features = [
    {
      icon: TrendingUp,
      title: 'Industry-Relevant Skills',
      description: 'Learn the most in-demand skills from industry experts and top universities.'
    },
    {
      icon: Clock,
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access to course materials.'
    },
    {
      icon: Award,
      title: 'Recognized Certificates',
      description: 'Earn certificates that are recognized by employers worldwide.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with millions of learners and get help when you need it.'
    }
  ]

  const popularCourses = [
    {
      id: 1,
      title: 'Machine Learning Specialization',
      instructor: 'Andrew Ng',
      university: 'Stanford University',
      rating: 4.9,
      students: '2.1M',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$49',
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Google Data Analytics Certificate',
      instructor: 'Google Career Certificates',
      university: 'Google',
      rating: 4.8,
      students: '500K',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$39',
      level: 'Beginner'
    },
    {
      id: 3,
      title: 'Full Stack Web Development',
      instructor: 'Meta',
      university: 'Meta',
      rating: 4.7,
      students: '800K',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$59',
      level: 'Intermediate'
    },
    {
      id: 4,
      title: 'Digital Marketing Specialization',
      instructor: 'University of Illinois',
      university: 'University of Illinois',
      rating: 4.6,
      students: '300K',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$45',
      level: 'Beginner'
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-coursera-blue via-coursera-darkblue to-purple-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Learn Without
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Limits
                </span>
              </h1>
              <p className="hero-subtitle text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Access world-class education from top universities and industry leaders. 
                Build skills that advance your career.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                  Explore Courses
                </Link>
                <button className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-all duration-200">
                  <Play className="w-5 h-5" />
                  <span className="text-lg font-medium">Watch Demo</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Online Learning"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }, index) => (
              <div key={index} className="stat-item text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-coursera-blue/10 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-coursera-blue" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
                <div className="text-gray-600 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LearnHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join millions of learners who trust us to help them achieve their goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div key={index} className="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-coursera-blue/10 rounded-lg mb-6">
                  <Icon className="w-6 h-6 text-coursera-blue" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Most Popular Courses
              </h2>
              <p className="text-xl text-gray-600">
                Start learning with our top-rated courses
              </p>
            </div>
            <Link to="/courses" className="btn-secondary hidden md:inline-flex">
              View All Courses
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularCourses.map((course) => (
              <div key={course.id} className="card-hover bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-coursera-blue text-xs font-semibold px-2 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{course.university}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="text-sm text-gray-600 mb-4">{course.instructor}</div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                      <span className="text-sm text-gray-500">({course.students})</span>
                    </div>
                    <div className="text-lg font-bold text-coursera-blue">{course.price}</div>
                  </div>
                  
                  <Link
                    to={`/course/${course.id}`}
                    className="w-full bg-coursera-blue hover:bg-coursera-darkblue text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 font-medium inline-block"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 md:hidden">
            <Link to="/courses" className="btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coursera-blue to-coursera-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join millions of learners and start building the skills you need to succeed in your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses" className="bg-white text-coursera-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Browse Courses
            </Link>
            <button className="border-2 border-white text-white hover:bg-white hover:text-coursera-blue font-semibold py-3 px-8 rounded-lg transition-all duration-200">
              Start Free Trial
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home