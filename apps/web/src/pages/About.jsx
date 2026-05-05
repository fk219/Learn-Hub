import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, Globe, Award, TrendingUp, Heart, Target, Eye, Zap } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  useEffect(() => {
    // Hero animation
    gsap.fromTo('.about-hero',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    )

    // Stats animation
    gsap.fromTo('.stat-counter',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        }
      }
    )

    // Values animation
    gsap.fromTo('.value-card',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.values-section',
          start: 'top 80%',
        }
      }
    )
  }, [])

  const stats = [
    { icon: Users, value: '50M+', label: 'Learners Worldwide' },
    { icon: Globe, value: '190+', label: 'Countries' },
    { icon: Award, value: '5,000+', label: 'Courses' },
    { icon: TrendingUp, value: '100+', label: 'University Partners' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Learner-Centric',
      description: 'We put learners at the center of everything we do, designing experiences that help them achieve their goals.'
    },
    {
      icon: Target,
      title: 'Quality First',
      description: 'We maintain the highest standards in course content, instruction, and learning outcomes.'
    },
    {
      icon: Eye,
      title: 'Accessibility',
      description: 'We believe quality education should be accessible to everyone, everywhere, regardless of background.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously innovate to create better learning experiences through technology and pedagogy.'
    }
  ]

  const timeline = [
    {
      year: '2012',
      title: 'Founded',
      description: 'LearnHub was founded with a mission to provide universal access to world-class education.'
    },
    {
      year: '2014',
      title: 'First Million',
      description: 'Reached our first million learners and launched partnerships with top universities.'
    },
    {
      year: '2016',
      title: 'Global Expansion',
      description: 'Expanded to serve learners in over 100 countries with localized content.'
    },
    {
      year: '2018',
      title: 'Corporate Learning',
      description: 'Launched LearnHub for Business to help companies upskill their workforce.'
    },
    {
      year: '2020',
      title: 'Pandemic Response',
      description: 'Provided free access to courses during COVID-19, helping millions learn new skills.'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Integrated AI-powered personalized learning paths and adaptive assessments.'
    }
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Former VP of Product at Google, passionate about democratizing education.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-founder',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Ex-Netflix engineer, expert in building scalable learning platforms.'
    },
    {
      name: 'Dr. Emily Johnson',
      role: 'Chief Learning Officer',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Former Stanford professor, leading expert in online pedagogy and learning science.'
    },
    {
      name: 'David Park',
      role: 'VP of Partnerships',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Former McKinsey consultant, building relationships with universities and companies.'
    }
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="about-hero bg-gradient-to-br from-coursera-blue via-coursera-darkblue to-purple-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transforming Lives Through Learning
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
            We partner with the world's best universities and companies to bring you 
            flexible, affordable, job-relevant online learning.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            To provide universal access to world-class education, partnering with top universities 
            and organizations to offer courses online for anyone to take.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We envision a world where anyone, anywhere has the power to transform their life through learning. 
            Our goal is to give everyone access to a world-class education that has so far been available to a select few.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600">
              Numbers that reflect our commitment to global education
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }, index) => (
              <div key={index} className="stat-counter text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-coursera-blue/10 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-coursera-blue" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
                <div className="text-gray-600 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description }, index) => (
              <div key={index} className="value-card text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-coursera-blue/10 rounded-full mb-6">
                  <Icon className="w-8 h-8 text-coursera-blue" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to democratize education
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-coursera-blue/20"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-2xl font-bold text-coursera-blue mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-4 h-4 bg-coursera-blue rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600">
              The team behind LearnHub's mission
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-coursera-blue font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coursera-blue to-coursera-darkblue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Whether you're a learner, educator, or partner, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-coursera-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Start Learning
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-coursera-blue font-semibold py-3 px-8 rounded-lg transition-all duration-200">
              Partner With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About