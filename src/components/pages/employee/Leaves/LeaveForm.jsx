import React, { useState, useEffect } from 'react';
import { useLeave } from '../../../context/LeaveContext';
import { Calendar, Clock, BarChart, FileText, Type, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { SectionHeader } from '../../../components/SectionHeader';
function LeaveForm() {
  const [leaveType, setLeaveType] = useState('');
  const [showHours, setShowHours] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    leave_type: '',
    hours: '',
    reason: '',
    status: 'Pending',
  });

  const { addLeave, leaves, loading, error } = useLeave();
  console.log("leaves data", leaves);
  useEffect(() => {
    if (leaveType === 'Short Leave') {
      setShowHours(true);
      setShowEndDate(false);
    } else if (leaveType === 'Multiple Days Leave') {
      setShowHours(false);
      setShowEndDate(true);
    } else {
      setShowHours(false);
      setShowEndDate(false);
    }
  }, [leaveType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');

    if (!token){
      alert('User not authenticated');
      return;
    }

    const leaveData = {
      start_date: formData.start_date,
      leave_type: leaveType,
      reason: formData.reason,
    };

    if (leaveType === 'Multiple Days Leave') {
      leaveData.end_date = formData.end_date;
    }

    if (leaveType === 'Short Leave') {
      leaveData.hours = formData.hours;
    }

    console.log('Submitting Leave Data:', leaveData);

    try {
      const response = await addLeave(leaveData, token);
      console.log('API Response:', response);

      if (response) {
        alert('Leave request submitted successfully');
        setFormData({
          start_date: '',
          end_date: '',
          leave_type: '',
          hours: '',
          reason: '',
        });
        setLeaveType('');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Failed to submit leave request.');
    }
  };


  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <span className="approved">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="rejected">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="pending">
            <Clock3 className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <>
      <SectionHeader icon={Calendar} title="Leave Request" subtitle="Employee Leave Request" />
      <div className="flex flex-col items-center">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg w-full mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Leave Request</h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* <div className="flex items-center justify-between gap-4">
              <div className="relative w-6/12">
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                />
              </div>
              {showEndDate && (
                <div className="relative w-6/12">
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                  />
                </div>
              )}
            </div> */}

            <div className="flex items-center justify-between gap-4">
              {/* Start Date */}
              <div className={`relative ${showEndDate ? 'w-6/12' : 'w-full'}`}>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                />
              </div>

              {/* End Date */}
              {showEndDate && (
                <div className="relative w-6/12">
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                  />
                </div>
              )}
            </div>


            <div className="flex items-center justify-between gap-4">

              <div className={`relative ${showHours ? 'w-6/12' : 'w-full'}`}>
                <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Type className="w-4 h-4 mr-2 text-gray-400" />
                  Leave Type
                </label>
                <div className="relative">
                  <select
                    id="leave-type"
                    name="leave_type"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none bg-white"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Half Day">Half day</option>
                    <option value="Full Leave">Full day</option>
                    <option value="Short Leave">Short Leave</option>
                    <option value="Multiple Days Leave">More Than 1 day</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {showHours && (
                <div className="relative w-6/12">
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    Number of Hours
                  </label>
                  <input
                    type="text"
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    placeholder='3pm to 6pm'
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                  />
                </div>
              )}
            </div>

            {/* Leave Reason */}
            <div className="relative">
              <label htmlFor="leave-reason" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                Leave Reason
              </label>
              <textarea
                id="leave-reason"
                name="reason"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-none"
                placeholder="Please provide a reason for your leave request..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn margin-auto"
            >
              Submit Leave Request
            </button>
          </form>


        </div>
      </div>

      {/* Table for Leave Records */}
      <div className="mt-6 w-full max-w-7xl mx-auto">
        <div className="overflow-x-auto rounded shadow-lg">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <table className="min-w-full bg-white">
            <thead>
              <tr className="table-bg-heading">
                <th className="table-th-tr-row tracking-wider">
                  <div className="flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Start Date
                  </div>
                </th>
                <th className="table-th-tr-row tracking-wider">
                  <div className="flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    End Date
                  </div>
                </th>
                <th className="table-th-tr-row tracking-wider">
                  <div className="flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Leave Type
                  </div>
                </th>
                <th className="table-th-tr-row tracking-wider">
                  Status
                </th>
                <th className="table-th-tr-row tracking-wider">
                  Reason
                </th>
                <th className="table-th-tr-row tracking-wider">
                  Hours
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Action
              </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr
                  key={leave.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                    {leave.start_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                    {leave.end_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                    {leave.leave_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(leave.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                    {leave.reason || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                    {leave.hours !== null ? leave.hours : "N/A"}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    onClick={() => console.log('View details for leave:', leave.id)}
                  >
                    Edit Details
                  </button>
                </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default LeaveForm;