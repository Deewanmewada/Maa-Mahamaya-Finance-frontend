import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { fetchMyEmployeeIdCard } from '../components/api/employeeAPI.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function EmployeeProfile() {
  const { user } = useContext(AuthContext);
  const [idCard, setIdCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cardRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getIdCard = async () => {
      try {
        const card = await fetchMyEmployeeIdCard(token);
        setIdCard(card);
        setError('');
      } catch (err) {
        if (err.response?.status === 404) {
          setIdCard(null);
          setError('pending');
        } else {
          console.error('Unexpected error:', err);
          setError('error');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'employee') {
      getIdCard();
    }
  }, [user, token]);

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;

    cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise((res) => setTimeout(res, 300));

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('Employee_ID_Card.pdf');
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise((res) => setTimeout(res, 300));

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'Employee_ID_Card.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      <p><strong>Address:</strong> {user?.address}</p>
      <p><strong>Pincode:</strong> {user?.pincode}</p>
      <p><strong>Mobile Number:</strong> {user?.mobileNumber}</p>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Employee ID Card</h3>

        {loading && (
          <p className="text-gray-500 text-sm">Loading ID card...</p>
        )}

        {!loading && error === 'pending' && (
          <p className="text-yellow-500 text-sm font-medium">
            Pending — Your ID card has not been generated by admin yet.
          </p>
        )}

        {!loading && error === 'error' && (
          <p className="text-red-500 text-sm">Failed to fetch ID card.</p>
        )}

        {!loading && !error && idCard && (
          <div className="space-y-3 mt-4">
            <div
              ref={cardRef}
              className="w-[350px] h-[220px] bg-white border-2 border-blue-500 shadow-lg rounded-md p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-center text-blue-600 font-bold text-lg mb-2">Employee ID Card</h3>
                <p className="text-sm"><strong>Name:</strong> {idCard.name}</p>
                <p className="text-sm"><strong>Email:</strong> {idCard.email}</p>
                <p className="text-sm"><strong>Address:</strong> {idCard.address}</p>
                <p className="text-sm"><strong>Pincode:</strong> {idCard.pincode}</p>
                <p className="text-sm"><strong>Mobile Number:</strong> {idCard.mobileNumber}</p>
              </div>
              <div className="text-[10px] text-right text-gray-400">
                Powered by Maa Mahamaya Finance
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download PDF
              </button>

              <button
                onClick={handleDownloadImage}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download Image
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="font-semibold">Profile Upload</p>
        <p className="text-xs text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}

export default EmployeeProfile;
