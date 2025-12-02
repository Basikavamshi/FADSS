'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [contactMethod, setContactMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName) {
      alert('Please enter your first and last name');
      return;
    }
    
    if (contactMethod === 'email' && !formData.email) {
      alert('Please enter your email address');
      return;
    }
    
    if (contactMethod === 'phone' && !formData.phone) {
      alert('Please enter your phone number');
      return;
    }
    
    if (!formData.password || formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.address) {
      alert('Please enter your address');
      return;
    }

    setIsLoading(true);

    // Get existing users from localStorage or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const userExists = existingUsers.some(user => 
      user.email === formData.email || user.phone === formData.phone
    );
    
    if (userExists) {
      setIsLoading(false);
      alert('User with this email or phone already exists!');
      return;
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      username: formData.email || formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password, // In real app, this should be hashed!
      address: formData.address,
      contactMethod: contactMethod,
      createdAt: new Date().toISOString()
    };

    // Add new user to array
    existingUsers.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    console.log('User registered successfully:', newUser);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      alert('Account created successfully! Please login.');
      router.push('/login');
    }, 1000);
  };

  const PasswordInput = ({ name, label, show, setShow }) => (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShow(!show);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            {show ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );

  const SocialButton = ({ provider, icon }) => (
    <button
      type="button"
      onClick={() => console.log(`Signup with ${provider}`)}
      className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
      title={`Continue with ${provider}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-5">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600 text-sm">Join our farmer advisory platform</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {['firstName', 'lastName'].map((field) => (
              <div key={field}>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {field === 'firstName' ? 'First Name' : 'Last Name'}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field === 'firstName' ? 'First name' : 'Last name'}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-3 text-sm font-semibold text-gray-700">Contact Method</label>
            <div className="flex gap-6 mb-3">
              {['email', 'phone'].map((method) => (
                <label key={method} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    checked={contactMethod === method}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {method === 'email' ? 'Email' : 'Phone Number'}
                  </span>
                </label>
              ))}
            </div>

            {contactMethod === 'email' && (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none transition-colors"
              />
            )}

            {contactMethod === 'phone' && (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none transition-colors"
              />
            )}
          </div>

          <PasswordInput name="password" label="Password" show={showPassword} setShow={setShowPassword} />
          <PasswordInput name="confirmPassword" label="Confirm Password" show={showConfirmPassword} setShow={setShowConfirmPassword} />

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your farm/residence address"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center items-center gap-4 mb-6">
          <SocialButton provider="Google" icon={
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          } />
          <SocialButton provider="Facebook" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          } />
          <SocialButton provider="GitHub" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#181717">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          } />
        </div>

        <p className="text-center text-sm text-gray-500 mb-6">Continue with your social account</p>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;