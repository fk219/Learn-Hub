import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('pk_test_your_publishable_key_here') // Replace with your Stripe publishable key

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }, [])

  const removeFromCart = (courseId) => {
    const updatedCart = cartItems.filter(item => item.id !== courseId)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0)
  }

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice) {
        return total + (item.originalPrice - item.price)
      }
      return total
    }, 0)
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    
    try {
      // In a real application, you would send the cart data to your backend
      // and create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image
          }))
        }),
      })

      const session = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (error) {
        console.error('Stripe error:', error)
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      // For demo purposes, simulate successful checkout
      alert('Demo: Checkout successful! Courses added to your library.')
      localStorage.removeItem('cart')
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-14 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Discover amazing courses and start learning today!</p>
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>Browse Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {cartItems.length} Course{cartItems.length !== 1 ? 's' : ''} in Cart
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">By {item.instructor}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                        )}
                        {item.originalPrice && (
                          <span className="text-xs text-green-600 font-medium">
                            Save ${item.originalPrice - item.price}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${getTotalPrice()}</span>
                </div>
                
                {getTotalSavings() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Savings:</span>
                    <span className="font-medium text-green-600">-${getTotalSavings()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">$0</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">${getTotalPrice()}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Secure checkout powered by Stripe
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">What you'll get:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Lifetime access to all courses</li>
                  <li>• Certificate of completion</li>
                  <li>• 30-day money-back guarantee</li>
                  <li>• Mobile and desktop access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart