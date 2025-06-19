import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Star, Users, BookOpen, Award, MapPin, Linkedin, Twitter } from 'lucide-react'

const Instructors = () => {
  useEffect(() => {
    gsap.fromTo('.instructor-card',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    )
  }, [])

  const instructors = [
    {
      id: 1,
      name: 'Andrew Ng',
      title: 'Co-founder of Coursera, Adjunct Professor at Stanford',
      university: 'Stanford University',
      specialization: 'Machine Learning & AI',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      students: '5.2M',
      courses: 12,
      location: 'Stanford, CA',
      bio: 'Andrew Ng is a globally recognized leader in AI. He founded DeepLearning.AI and co-founded Coursera.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      title: 'Senior Data Scientist at Google',
      university: 'MIT',
      specialization: 'Data Science & Analytics',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      students: '2.1M',
      courses: 8,
      location: 'Mountain View, CA',
      bio: 'Dr. Johnson specializes in machine learning applications for large-scale data analysis.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 3,
      name: 'Prof. Michael Chen',
      title: 'Professor of Computer Science',
      university: 'Carnegie Mellon University',
      specialization: 'Software Engineering',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      students: '1.8M',
      courses: 15,
      location: 'Pittsburgh, PA',
      bio: 'Prof. Chen has over 20 years of experience in software engineering and system design.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 4,
      name: 'Dr. Emily Rodriguez',
      title: 'UX Research Director at Meta',
      university: 'Stanford University',
      specialization: 'UX/UI Design',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      students: '900K',
      courses: 6,
      location: 'Menlo Park, CA',
      bio: 'Dr. Rodriguez leads user experience research and has published extensively on human-computer interaction.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 5,
      name: 'James Wilson',
      title: 'Senior Marketing Manager at HubSpot',
      university: 'Harvard Business School',
      specialization: 'Digital Marketing',
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.6,
      students: '1.2M',
      courses: 10,
      location: 'Boston, MA',
      bio: 'James has helped hundreds of companies grow their online presence through strategic digital marketing.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 6,
      name: 'Dr. Lisa Park',
      title: 'Chief Data Officer at Netflix',
      university: 'UC Berkeley',
      specialization: 'Business Analytics',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      students: '750K',
      courses: 7,
      location: 'Los Gatos, CA',
      bio: 'Dr. Park specializes in using data analytics to drive business decisions and strategy.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 7,
      name: 'Robert Thompson',
      title: 'Senior Financial Analyst at Goldman Sachs',
      university: 'Wharton School',
      specialization: 'Finance & Investment',
      image: 'https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      students: '650K',
      courses: 9,
      location: 'New York, NY',
      bio: 'Robert brings Wall Street expertise to online education with practical finance courses.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 8,
      name: 'Dr. Maria Garcia',
      title: 'Professor of Psychology',
      university: 'Yale University',
      specialization: 'Psychology & Behavioral Science',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      students: '500K',
      courses: 5,
      location: 'New Haven, CT',
      bio: 'Dr. Garcia researches human behavior and decision-making processes in digital environments.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ]

  const specializations = [
    'All Specializations',
    'Machine Learning & AI',
    'Data Science & Analytics',
    'Software Engineering',
    'UX/UI Design',
    'Digital Marketing',
    'Business Analytics',
    'Finance & Investment',
    'Psychology & Behavioral Science'
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Expert Instructors
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from industry leaders, university professors, and practitioners 
              who are shaping the future of their fields
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-coursera-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Universities</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15M+</div>
              <div className="text-blue-100">Students Taught</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Specialization</h3>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  index === 0
                    ? 'bg-coursera-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="instructor-card bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-4">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{instructor.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{instructor.title}</p>
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{instructor.location}</span>
                  </div>
                  <span className="inline-block bg-coursera-blue/10 text-coursera-blue text-xs font-medium px-3 py-1 rounded-full">
                    {instructor.specialization}
                  </span>
                </div>

                <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                  {instructor.bio}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-900">{instructor.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{instructor.students}</div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{instructor.courses}</div>
                    <div className="text-xs text-gray-500">Courses</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <a
                      href={instructor.social.linkedin}
                      className="p-2 text-gray-400 hover:text-coursera-blue transition-colors duration-200"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={instructor.social.twitter}
                      className="p-2 text-gray-400 hover:text-coursera-blue transition-colors duration-200"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                  <Link
                    to={`/instructor/${instructor.id}`}
                    className="text-sm font-medium text-coursera-blue hover:text-coursera-darkblue transition-colors duration-200"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-coursera-blue hover:bg-coursera-darkblue text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Load More Instructors
          </button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Become an Instructor?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Share your expertise with millions of learners worldwide and build your personal brand
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-coursera-blue hover:bg-coursera-darkblue text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Apply to Teach
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Instructors