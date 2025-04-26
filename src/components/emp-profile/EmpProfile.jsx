import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidebarEmp from '../sidebar/SidebarEmp';
import Profile from '../../assets/profile-pic.png';

const EmpProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Checkify',
    lastName: 'Checkify',
    email: 'Checkify2112@gmail.com',
    phone: '012 345 678',
    country: 'Cambodia',
    city: 'Phnom Penh',
    gender: 'Male',
    experience: '05 years'
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password fields state
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log('Updated info:', personalInfo);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Password update:', passwordFields);
    setPasswordFields({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Logout function: clear authToken and userRole, then navigate to homepage
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  // --- StatusBadge Component ---
  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";
    if (status === "Approve") {
      bgColor = "bg-green-100";
      textColor = "text-green-800";
    } else if (status === "Deny") {
      bgColor = "bg-red-100";
      textColor = "text-red-800";
    } else if (status === "Pending") {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
    }
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  // Renders content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mb-4">
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src={Profile} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{personalInfo.firstName + " " + personalInfo.lastName}</h3>
                  <p className="text-sm text-gray-500">ID H-0003</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="flex items-center text-green-500 hover:text-green-700"
              >
                <span className="mr-1">{isEditing ? "Cancel" : "Edit"}</span>
                <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </button>
            </div>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <h4 className="text-md font-semibold mb-4">Personal Info</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="firstName" value={personalInfo.firstName} onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="lastName" value={personalInfo.lastName} onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" value={personalInfo.email} onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                    <input type="text" name="phone" value={personalInfo.phone} onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg" />
                  </div>
                </div>
                <h4 className="text-md font-semibold mb-4">Address</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input type="text" name="country" value={personalInfo.country} onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City / Province</label>
                    <input type="text" name="city" value={personalInfo.city} onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select name="gender" value={personalInfo.gender} onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg bg-white">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <input type="text" name="experience" value={personalInfo.experience} onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h4 className="text-md font-semibold mb-4">Personal Info</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 p-2 border rounded-lg bg-gray-50">{personalInfo.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 p-2 border rounded-lg bg-gray-50">{personalInfo.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 p-2 border rounded-lg bg-gray-50">{personalInfo.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                    <p className="mt-1 p-2 border rounded-lg bg-gray-50">{personalInfo.phone}</p>
                  </div>
                </div>
                <h4 className="text-md font-semibold mb-4">Address</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <p className="mt-1 p-2 border rounded-lg bg-gray-50">{personalInfo.country}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City / Province</label>
                    <p className="mt-1 p-2 border rounded-lg bg-gray-50">{personalInfo.city}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 p-2 border rounded-lg bg-gray-50">{personalInfo.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="mt-1 p-2 border rounded-lg bg-gray-50">{personalInfo.experience}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      
      case 'password':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Password Settings</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    name="currentPassword"
                    value={passwordFields.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 p-2 w-full border rounded-lg pr-10" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                  >
                    {showCurrentPassword ? (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.543-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.543-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordFields.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 p-2 w-full border rounded-lg pr-10" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)} 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                  >
                    {showNewPassword ? (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.543-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.543-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordFields.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 p-2 w-full border rounded-lg pr-10" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.543-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.543-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-primary-color text-white px-4 py-2 rounded-lg hover:bg-primary-color/90"
              >
                Update Password
              </button>
            </form>
          </div>
        );
      
      case 'logout':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Log Out</h3>
            <p className="mb-4">Are you sure you want to log out?</p>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Confirm Logout
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Global Sidebar */}
      <SidebarEmp />
      
      {/* Main Profile Section */}
      <div className="flex-1 p-6">
        <header className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Account Settings</h2>
        </header>
        <div className="flex">
          {/* Profile Tabs Sidebar */}
          <div className="w-64 bg-white border rounded-lg border-gray-200 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                    activeTab === 'personal' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                  Personal Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                    activeTab === 'password' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                  Password
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('logout')}
                  className={`w-full flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                    activeTab === 'logout' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3 3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Log out
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content for Active Tab */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;
