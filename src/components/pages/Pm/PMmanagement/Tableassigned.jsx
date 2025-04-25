import React, { useEffect, useState } from "react";
import { usePMContext } from "../../../context/PMContext";
import { Loader2, Calendar, User, Briefcase, BarChart, Search } from "lucide-react";

export const Tableassigned = () => {
    const { employeeProjects, loading, fetchEmployeeProjects } = usePMContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchEmployeeProjects(); // Fetch employee project details on mount
    }, []);

    console.log("these are employee projects", employeeProjects);

    useEffect(() => {
        if (Array.isArray(employeeProjects?.data?.projects)) {
            const filtered = employeeProjects.data.projects.filter((project) =>
                project.project_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]); // Handle case where no data exists
        }
    }, [searchQuery, employeeProjects]);

    return (
        <div className="overflow-hidden rounded-b-2xl border border-gray-200 bg-white shadow-2xl">
            {/* <div className="top-heading-bg rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                    <BarChart className="h-10 w-10 text-blue-100" />
                    <h2 className="text-3xl font-bold text-white">Assigned Projects</h2>
                </div>
                <p className="text-blue-100 text-lg">Projects Assigned to Team Members</p>
            </div> */}

            {/* Search Input */}
            <div className="p-4 flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by Project Name..."
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center col-span-full">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="text-gray-600 text-lg font-medium mt-4">Loading assigned projects...</p>
                        <p className="text-gray-400">Please wait while we fetch the data</p>
                    </div>
                ) : filteredData.length > 0 ? (
                    filteredData.map((project, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-5 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                {project.project_name}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-2 mt-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Client: {project.client?.name || "N/A"}
                            </p>
                            <p className="text-gray-600 flex items-center gap-2 mt-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Employees: {project.assigned_employees?.map(emp => emp.name).join(", ") || "No Employees Assigned"}
                            </p>
                            <p className="text-gray-600 flex items-center gap-2 mt-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                Deadline: {project.deadline}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">No assigned projects found.</div>
                )}
            </div>
        </div>
    );
};
