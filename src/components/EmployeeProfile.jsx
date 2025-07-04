import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

function EmployeeProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full p-6 bg-white rounded-md shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      <p><strong>Address:</strong> {user?.address}</p>
      <p><strong>Pincode:</strong> {user?.pincode}</p>
      <p><strong>Mobile Number:</strong> {user?.mobileNumber}</p>
      {/* Placeholder for profile upload section */}
      <div className="mt-4 border-t pt-2">
        <p className="font-semibold">Profile Upload</p>
        <p className="text-xs text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}

export default EmployeeProfile;
