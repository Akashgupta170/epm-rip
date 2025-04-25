import React, { useEffect, useState } from "react";
import { Loader2, Calendar, User, Clock, FileText, BarChart, Search, CheckCircle, XCircle, Pencil } from "lucide-react";
import { useLeave } from "../../context/LeaveContext";
import { SectionHeader } from '../../components/SectionHeader';
import { EditButton, SaveButton, CancelButton, YesButton, DeleteButton, ExportButton, ImportButton, ClearButton, CloseButton, SubmitButton, IconApproveButton, IconRejectButton, IconCancelTaskButton, IconSaveButton, IconDeleteButton, IconEditButton, IconViewButton, } from "../../../components/AllButtons/AllButtons";


export const LeaveManagement = () => {
    const { hrLeaveDetails, hrLeave, postStatuses, loading, error } = useLeave();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [editMode, setEditMode] = useState({});

    const [currentPage, setCurrentPage] = useState(1);  // Track current page
    const [itemsPerPage] = useState(11);

    useEffect(() => {
        hrLeaveDetails();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = hrLeave.filter(leave =>
                leave.employee_name && leave.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [searchTerm, hrLeave]);


    const handleStatusChange = async (id, newStatus) => {
        const updatedStatus = [{ id, status: newStatus }];
        await postStatuses(updatedStatus);
        setEditMode((prev) => ({ ...prev, [id]: false }));
    };

    const toggleEditMode = (id) => {
        setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const dataToDisplay = searchTerm ? filteredData : hrLeave;
    const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = dataToDisplay.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg max-h-screen overflow-y-auto">
            <SectionHeader icon={BarChart} title="Employee Management" subtitle="Manage employees and update details" />
            {/* <div className="p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500">
                <div className="flex items-center gap-3 mb-3">
                    <BarChart className="h-10 w-10 text-blue-100" />
                    <h2 className="text-3xl font-bold text-white">Manage Leaves</h2>
                </div>
                <p className="text-blue-100 text-lg">Track and manage leave requests</p>
            </div> */}

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white z-10 shadow-md">
                {/* <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by Employee Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div> */}
                <div className="flex items-center w-full max-w-md border border-gray-300 px-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                    <Search className="h-5 w-5 text-gray-400 mr-[5px]" />
                    <input
                        type="text"
                        className="w-full rounded-lg focus:outline-none py-2"
                        placeholder="Search by Employee Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[800px]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="table-th-tr-row table-bg-heading">
                                {["Date", "Employee Name", "Leave Type", "Duration", "Reason", "Status"].map((label, index) => (
                                    <th key={index} className="px-4 py-2 text-center font-semibold">{label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentData.map((leave, index) => (
                                <tr key={index} className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out">
                                    <td className="px-6 py-4 text-center text-gray-700">{leave.start_date}</td>
                                    <td className="px-6 py-4 text-center text-gray-700">{leave.user_name}</td>
                                    <td className="px-6 py-4 text-center text-gray-700">{leave.leave_type}</td>
                                    <td className="px-6 py-4 text-center text-gray-700">{leave.hours ? `${leave.hours} Hours` : "Full Day"}</td>
                                    <td className="px-6 py-4 text-center text-gray-700">{leave.reason}</td>
                                    <td className="px-6 py-4 flex items-center justify-center text-center">
                                        {editMode[leave.id] ? (
                                            <div className="flex items-center gap-4">
                                                <IconApproveButton onClick={() => handleStatusChange(leave.id, "Approved")} />
                                                <IconRejectButton onClick={() => handleStatusChange(leave.id, "Approved")} />
                                                {/* <button onClick={() => handleStatusChange(leave.id, "Approved")}>
                                                    <CheckCircle className="text-green-500 h-7 w-7 hover:text-green-600" />
                                                </button>
                                                <button onClick={() => handleStatusChange(leave.id, "Rejected")}>
                                                    <XCircle className="text-red-500 h-7 w-7 hover:text-red-600" />
                                                </button> */}
                                            </div>
                                        ) : leave.status === "Approved" ? (
                                            <div className="flex items-center gap-3">
                                                <IconApproveButton />
                                                <IconEditButton onClick={() => toggleEditMode(leave.id)} />
                                                {/* <CheckCircle className="text-green-500 h-7 w-7" /> */}
                                                {/* <button onClick={() => toggleEditMode(leave.id)}>
                                                    <Pencil className="text-gray-500 h-6 w-6 hover:text-gray-700" />
                                                </button> */}
                                            </div>
                                        ) : leave.status === "Rejected" ? (
                                            <div className="flex items-center gap-3">
                                                <IconRejectButton />
                                                <IconEditButton onClick={() => toggleEditMode(leave.id)} />
                                                {/* <XCircle className="text-red-500 h-7 w-7" /> */}
                                                {/* <button onClick={() => toggleEditMode(leave.id)}>
                                                    <Pencil className="text-gray-500 h-6 w-6 hover:text-gray-700" />
                                                </button> */}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <IconApproveButton onClick={() => handleStatusChange(leave.id, "Approved")} />
                                                <IconRejectButton onClick={() => handleStatusChange(leave.id, "Rejected")} />
                                                {/* <button onClick={() => handleStatusChange(leave.id, "Approved")}>
                                                    <CheckCircle className="text-green-500 h-7 w-7 hover:text-green-600" />
                                                </button> */}
                                                {/* <button onClick={() => handleStatusChange(leave.id, "Rejected")}>
                                                    <XCircle className="text-red-500 h-7 w-7 hover:text-red-600" />
                                                </button> */}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 py-4">
                            <button
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`px-3 py-1 rounded ${currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
