import React, { useState, useEffect } from 'react';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';

export default function ProfileSettings() {
  const [profileInfo, setProfileInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    jobTitle: 'Engineering Manager',
    department: 'Engineering',
    location: 'San Francisco',
    phoneNumber: '+1 (555) 123-4567',
    slackUsername: '@johndoe',
    bio: 'Engineering manager with 10+ years of experience in software development. Passionate about building high-performing teams and creating efficient development processes.'
  });
  
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    slackUsername: ''
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Validate the form whenever profileInfo changes
  useEffect(() => {
    validateForm();
  }, [profileInfo]);
  
  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      slackUsername: ''
    };
    
    // Validate first name
    if (profileInfo.firstName.trim() === '') {
      errors.firstName = 'First name is required';
    }
    
    // Validate last name
    if (profileInfo.lastName.trim() === '') {
      errors.lastName = 'Last name is required';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileInfo.email)) {
      errors.email = 'Valid email is required';
    }
    
    // Validate phone number
    const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
    if (profileInfo.phoneNumber && !phoneRegex.test(profileInfo.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number format';
    }
    
    // Validate slack username
    if (profileInfo.slackUsername && !profileInfo.slackUsername.startsWith('@')) {
      errors.slackUsername = 'Slack username should start with @';
    }
    
    setFormErrors(errors);
    
    // Check if form is valid
    const valid = !Object.values(errors).some(error => error !== '');
    setIsFormValid(valid);
    
    return valid;
  };
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    jobTitle: 'Engineering Manager',
    department: 'Engineering',
    location: 'San Francisco',
    phoneNumber: '+1 (555) 123-4567',
    slackUsername: '@johndoe',
    bio: 'Engineering manager with 10+ years of experience in software development. Passionate about building high-performing teams and creating efficient development processes.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileInfo({
      ...profileInfo,
      [name]: value
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form before submission
    const isValid = validateForm();
    if (!isValid) {
      alert('Please fix the form errors before saving.');
      return;
    }
    
    // In a real app, this would save the profile to the backend
    alert('Profile saved successfully!');
  };

  return (
    <Layout title="Profile Settings">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <Link 
                href="/settings" 
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                General
              </Link>
              <Link 
                href="/settings/profile" 
                className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-700"
              >
                Profile Settings
              </Link>
              <Link 
                href="/settings" 
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                Appearance
              </Link>
              <Link 
                href="/settings" 
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                Notifications
              </Link>
              <Link 
                href="/settings" 
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                Integrations
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Profile Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your personal information and preferences.
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-6">
                  {/* Profile picture */}
                  <div className="flex items-center space-x-5">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xl font-medium">
                          {profileInfo.firstName[0]}{profileInfo.lastName[0]}
                        </div>
                        <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></span>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change
                      </button>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <FormInput
                        id="firstName"
                        name="firstName"
                        label="First name"
                        value={profileInfo.firstName}
                        onChange={handleInputChange}
                        required
                        autoComplete="given-name"
                        error={formErrors.firstName}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <FormInput
                        id="lastName"
                        name="lastName"
                        label="Last name"
                        value={profileInfo.lastName}
                        onChange={handleInputChange}
                        required
                        autoComplete="family-name"
                        error={formErrors.lastName}
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <FormInput
                        id="email"
                        name="email"
                        label="Email address"
                        type="email"
                        value={profileInfo.email}
                        onChange={handleInputChange}
                        required
                        autoComplete="email"
                        error={formErrors.email}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <FormInput
                        id="jobTitle"
                        name="jobTitle"
                        label="Job Title"
                        value={profileInfo.jobTitle}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <FormSelect
                        id="department"
                        name="department"
                        label="Department"
                        value={profileInfo.department}
                        onChange={handleInputChange}
                        options={[
                          { value: 'Engineering', label: 'Engineering' },
                          { value: 'Product', label: 'Product' },
                          { value: 'Design', label: 'Design' },
                          { value: 'Marketing', label: 'Marketing' },
                          { value: 'Sales', label: 'Sales' },
                          { value: 'Support', label: 'Support' },
                          { value: 'Operations', label: 'Operations' },
                          { value: 'Finance', label: 'Finance' },
                          { value: 'HR', label: 'HR' },
                          { value: 'Legal', label: 'Legal' }
                        ]}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <FormInput
                        id="location"
                        name="location"
                        label="Location"
                        value={profileInfo.location}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <FormInput
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        type="tel"
                        value={profileInfo.phoneNumber}
                        onChange={handleInputChange}
                        error={formErrors.phoneNumber}
                        helpText="Format: +1 (555) 123-4567"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <FormInput
                        id="slackUsername"
                        name="slackUsername"
                        label="Slack Username"
                        value={profileInfo.slackUsername}
                        onChange={handleInputChange}
                        error={formErrors.slackUsername}
                        helpText="Should start with @"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={profileInfo.bio}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Brief description about yourself. This will be visible to other team members.
                      </p>
                    </div>
                  </div>

                  {/* Notification preferences */}
                  <div>
                    <h3 className="text-md font-medium text-gray-700">Notification Preferences</h3>
                    <div className="mt-2">
                      <div className="divide-y divide-gray-200">
                        <div className="relative flex items-start py-4">
                          <div className="min-w-0 flex-1 text-sm">
                            <label htmlFor="mentions" className="font-medium text-gray-700">
                              Email notifications
                            </label>
                            <p className="text-gray-500">Receive email notifications for reports and alerts.</p>
                          </div>
                          <div className="ml-3 flex items-center h-5">
                            <input
                              id="mentions"
                              name="mentions"
                              type="checkbox"
                              defaultChecked
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                        </div>

                        <div className="relative flex items-start py-4">
                          <div className="min-w-0 flex-1 text-sm">
                            <label htmlFor="dashboard" className="font-medium text-gray-700">
                              Dashboard notifications
                            </label>
                            <p className="text-gray-500">Receive in-app notifications for dashboard updates.</p>
                          </div>
                          <div className="ml-3 flex items-center h-5">
                            <input
                              id="dashboard"
                              name="dashboard"
                              type="checkbox"
                              defaultChecked
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="mt-8 border-t border-gray-200 pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isFormValid}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
