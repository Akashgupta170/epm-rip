import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePMContext } from "../../../context/PMContext";

import {
  Loader2, Calendar, Clock, Users,
  BriefcaseBusiness, Briefcase, CheckCircle2,Search
} from "lucide-react";
import { SectionHeader } from "../../../components/SectionHeader";

export const PMAssignedtable = () => {
  const { assignedProjects, isLoading, fetchAssignedProjects } = usePMContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProjects = assignedProjects?.filter((project) => {
    const projectName = project.project_name?.toLowerCase() || "";
    const clientName = project.client?.name?.toLowerCase() || "";
    const deadline = project.deadline?.toLowerCase() || "";
    const requirements = project.requirements?.toLowerCase() || "";
    return (
      projectName.includes(searchTerm) ||
      clientName.includes(searchTerm) ||
      deadline.includes(searchTerm) ||
      requirements.includes(searchTerm)
    );
  });

  const ProjectCard = ({ project }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                {project.project_name || "N/A"}
              </h3>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{project.client?.name || "N/A"}</p>
              </div>
            </div>
            <div
              className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-full cursor-pointer"
              onClick={() => navigate(`/projectmanager/tasks/${project.id}`)}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Tasks</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-medium text-gray-600 ml-2">Deadline</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{project.deadline || "N/A"}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-medium text-gray-600 ml-2">Total Hours</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{project.total_hours || "N/A"}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
              <div className="flex items-center mb-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-medium text-gray-600 ml-2">Working Hours</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{project.total_working_hours || "N/A"}</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
            <p className="text-sm font-medium text-gray-600 mb-2">Requirements</p>
            <p className="text-sm text-gray-700 line-clamp-2">{project.requirements || "N/A"}</p>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Assigned: {project.assigned_by?.updated_at
                ? new Date(project.assigned_by.updated_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <SectionHeader
        icon={BriefcaseBusiness}
        title="Projects Assigned"
        subtitle="Manage and track your assigned projects"
      />
      <div className="max-w-7xl p-4">
        {/* Search Bar */}
        <div className="p-4 flex items-center gap-3">
          <div className="relative w-full max-w-md">
              <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by Project Name, deadline , hours"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
      </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text py-3">
            PROJECTS
          </h2>
        </div>

        {/* Project Grid or Loading/Error */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-3 bg-white px-8 py-6 rounded-xl shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-lg text-gray-600">Loading projects...</span>
            </div>
          </div>
        ) : filteredProjects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
              <p className="text-xl font-semibold text-gray-700 mb-2">No matching projects found</p>
              <p className="text-gray-500">Try a different search term</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PMAssignedtable;
