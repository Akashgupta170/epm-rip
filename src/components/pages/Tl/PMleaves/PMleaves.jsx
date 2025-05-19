import React, { useEffect, useState, useContext } from "react";
import { Loader2, Calendar, User, Clock, FileText, BarChart, Search } from "lucide-react";
import { useLeave } from "../../../context/LeaveContext";
import { SectionHeader } from '../../../components/SectionHeader';

export const PMleaves = () => {
    const { pmleaves, pmLeavesfnc, postStatuses, loading, error } = useLeave();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    console.log("PM leaves", pmleaves);
    useEffect(() => {
        pmLeavesfnc();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = pmleaves.filter(leave => leave.employee_name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [searchTerm, pmleaves]);

    const handleStatusChange = async (id, newStatus) => {
        const updatedStatus = [{ id, status: newStatus }];

        await postStatuses(updatedStatus);
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md shadow-black/25">
            {/* <div className="top-heading-bg">
                <div className="flex items-center gap-3 mb-3">
                    <BarChart className="h-10 w-10 text-blue-100" />
                    <h2 className="text-3xl font-bold text-white">Manage Leaves</h2>
                </div>
                <p className="text-blue-100 text-lg">Track and manage leave requests</p>
            </div> */}
            <SectionHeader icon={BarChart} title="Employee Management" subtitle="Track and manage leave requests" />

            <div className="p-4 flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Search by Employee Name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[800px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="table-bg-heading table-th-tr-row">
                                {[ 
                                    { label: "Date", icon: Calendar },
                                    { label: "Employee Name", icon: User },
                                    { label: "Leave Type" },
                                    { label: "Duration", icon: Clock },
                                    { label: "Reason", icon: FileText },
                                    { label: "Status" }
                                ].map(({ label, icon: Icon }, index) => (
                                    <th key={index} className="px-4 py-2 text-center font-semibold">
                                        <div className="flex items-center justify-center gap-2">
                                            {Icon && <Icon className="h-4 w-4 text-white" />}
                                            {label}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(searchTerm ? filteredData : pmleaves).map((leave, index) => (
                                <tr key={index} className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out">
                                    <td className="px-4 py-4 text-center text-gray-700">{leave.start_date}</td>
                                    <td className="px-4 py-4 text-center text-gray-700">{leave.user_name}</td>
                                    <td className="px-4 py-4 text-center text-gray-700">{leave.leave_type}</td>
                                    <td className="px-4 py-4 text-center text-gray-700">{leave.hours ? `${leave.hours} Hours` : "Full Day"}</td>
                                    <td className="px-4 py-4 text-center text-gray-700">{leave.reason}</td>
                                    <td className="px-6 py-4 flex items-center justify-center">
                                        <select
                                            className={`px-3 py-2 border rounded-lg cursor-pointer ${
                                                leave.status === "approved" ? "bg-green-100 text-green-700" :
                                                leave.status === "rejected" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}
                                            value={leave.status}
                                            onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <p className="text-center text-blue-600">Updating status...</p>}
                    {error && <p className="text-center text-red-600">Error: {error}</p>}
                </div>
            </div>
        </div>
    );
};
