import React, { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import {
  Loader2,
  Calendar,
  User,
  Briefcase,
  Clock,
  FileText,
  Target,
  CheckCircle,
  BarChart,
  Search,
  Save,
  XCircle,
  Pencil,
  Trash2,
  Edit,
} from "lucide-react";
import { SectionHeader } from '../../../components/SectionHeader';

export const EmpSheetHistory = () => {
  const { userProjects, error, editPerformanceSheet } = useUserContext();
  const { performanceSheets, loading } = useUserContext();
  console.log(performanceSheets);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const sheets = performanceSheets?.data?.sheets || [];
  const [editingRow, setEditingRow] = useState(null);
  const [savedEntries, setSavedEntries] = useState(null);
  // const [setEditIndex, setEditingRow] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tags, setTags] = useState([]);
  const recordsPerPage = 11;

  const handleEditClick = (index, sheet) => {
    // console.log("Edit clicked", index);
    setEditingRow(index);
    setEditedData({ ...sheet });
  };


  const handleChange = (e, field) => {
    let value = e.target.value;

    // Ensure only HH:MM format is stored by removing AM/PM parts if present
    value = value.replace(/(AM|PM|am|pm)/gi, "").trim();

    console.log(`Updating ${field}:`, value);

    // If the field is "project_id", update the tags state based on the selected project
    if (field === "project_id") {
      const selectedProject = userProjects.data.find(
        (project) => project.id === parseInt(value)
      );
      if (selectedProject) {
        setTags(selectedProject.tags_activitys);
      }
    }

    // If the field is "activity_type", map the selected tag ID to its name
    if (field === "activity_type") {
      const selectedTag = tags.find((tag) => tag.id.toString() === value);
      if (selectedTag) {
        value = selectedTag.id;
      }
    }

    setEditedData((prevData) => ({ ...prevData, [field]: value }));
  };


  console.log("Saving time:", editedData.time);

  const handleSave = async (editId) => {
    if (!editId) {
      console.error("No ID provided for the sheet being edited.");
      return;
    }

    setEditedData((prevData) => {
      console.log("Final time before saving:", prevData.time);

      const selectedTag = tags.find(tag => tag.id.toString() === prevData.activity_type.toString());
      const activityTypeName = selectedTag ? selectedTag.name : prevData.activity_type;

      const requestData = {
        id: editId,
        data: {
          project_id: prevData.project_id,
          date: prevData.date,
          time: prevData.time,
          work_type: prevData.work_type,
          activity_type: activityTypeName,
          narration: prevData.narration,
          project_type: prevData.project_type,
          project_type_status: prevData.project_type_status,
        },
      };

      editPerformanceSheet(requestData)
        .then((response) => {
          if (response) {
            setEditingRow(null);
          }
        })
        .catch((error) => {
          console.error("Error saving performance sheet:", error);
        });

      return prevData;
    });
  };

  const getStatusStyles = (status) => {
    if (!status || typeof status !== "string") {
      return "bg-gray-50 text-gray-700 ring-1 ring-gray-700/20 hover:bg-gray-100";
    }

    const safeStatus = String(status).toLowerCase();
    switch (safeStatus) {
      case "rejected":
        return "rejected";
      case "pending":
        return "pending";
      case "approved":
      case "completed":
        return "approved";
      default:
        return "bg-gray-50 text-gray-700 ring-1 ring-gray-700/20 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    if (!status || typeof status !== "string") {
      return <Clock className="h-4 w-4" />;
    }

    const safeStatus = String(status).toLowerCase();
    switch (safeStatus) {
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleEdit = (index, field, value) => {
    const updatedEntries = [...savedEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setSavedEntries(updatedEntries);
  };

  const handleDelete = (index) => {
    const updatedEntries = savedEntries.filter((_, i) => i !== index);
    setSavedEntries(updatedEntries);
    console.log("these are saved entries", savedEntries);
  };

  // const handleEditClick = (index) => {
  //   setEditIndex(index);
  //   console.log("these are saved entries", savedEntries);
  // };

  const handleSaveClick = () => {
    setEditIndex(null);
    console.log("these are saved entries", savedEntries);
  };

  // const handleSave = () => {
  //   if (!formData.date || !formData.projectId || !formData.hoursSpent) {
  //     alert("Please fill all required fields before saving.");
  //     return;
  //   }

  //   console.log("these are saved entries", savedEntries);

  //   setSavedEntries([...savedEntries, formData]);
  //   setFormData({
  //     date: new Date().toISOString().split("T")[0], // Keep date reset on save
  //     projectId: "",
  //     hoursSpent: "",
  //     billingStatus: "",
  //     status: "",
  //     notes: "",
  //   });
  // };

  // const handleSave = () => {
  //   if (!formData.date || !formData.projectId || !formData.hoursSpent) {
  //     alert("Please fill all required fields before saving.");
  //     return;
  //   }

  const filteredSheets = sheets.filter((sheet) => {
    const sheetDate = new Date(sheet.date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return (
      (!startDate || sheetDate >= start) && (!endDate || sheetDate <= end)
    );
  });

  const totalPages = Math.ceil(filteredSheets.length / recordsPerPage);

  // Get current records for the current page
  const currentRecords = filteredSheets.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Handle pagination click
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <SectionHeader icon={BarChart} title="Performance History" subtitle="Track your professional journey, monitor progress, and review
              achievements across all your projects and activities." />
      <div className="flex items-center justify-end gap-4 p-4">
        {/* <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <BarChart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Performance History
              </h2>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Track your professional journey, monitor progress, and review
              achievements across all your projects and activities.
            </p>
          </div> */}
        <div className="flex items-center justify-between gap-3 flex-wrap md:flex-nowrap border p-2 px-3 rounded-lg shadow-md bg-white">
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="font-bold text-black">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="font-bold text-black">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="top-tag-bg-color top-tag-size">
              <div className="text-xl font-bold text-white leading-5">
                {sheets.length}
              </div>
              <div className="text-blue-100">Total Records</div>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="table-bg-heading">
                {[
                  { label: "Date", icon: Calendar },
                  { label: "Client Name", icon: User },
                  { label: "Project Name", icon: Briefcase },
                  { label: "Work Type", icon: Target },
                  { label: "Activity", icon: Clock },
                  { label: "Time", icon: Clock },
                  { label: "Project Type", icon: Clock },
                  { label: "Project Type Status", icon: Clock },
                  { label: "Narration", icon: FileText },

                  { label: "Status", icon: CheckCircle },
                ].map(({ label, icon: Icon }, index) => (
                  <th key={index} className="text-center table-th-tr-row">
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="h-4 w-4 text-white" />
                      <span className="text-gray-900 text-nowrap text-white">{label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-20 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((sheet, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out group"
                  >
                    <td className="px-6 py-4 text-gray-700 font-medium text-nowrap text-center">
                      {editingRow === index ? (
                        <input
                          type="date"
                          value={editedData.date}
                          onChange={(e) => handleChange(e, "date")}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        sheet.date
                      )}
                    </td>
                    <td className="px-6 py-4 text-nowrap text-center">
                      {sheet.client_name}
                    </td>
                    <td className="px-6 py-4 text-nowrap text-center">
                      {editingRow === index ? (
                        <select
                          id="projectId"
                          name="projectId"
                          value={editedData.project_id}
                          onChange={(e) => handleChange(e, "project_id")}
                          className="text-nowrap min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                          <option value="">Select Project</option>
                          {loading && <option disabled>Loading...</option>}
                          {error && (
                            <option disabled>Error loading projects</option>
                          )}
                          {Array.isArray(userProjects?.data) &&
                            userProjects.data.length > 0
                            ? userProjects.data.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.project_name}
                              </option>
                            ))
                            : !loading &&
                            !error && (
                              <option disabled>No projects found</option>
                            )}
                        </select>
                      ) : (
                        sheet.project_name
                      )}
                    </td>

                    <td className="px-6 py-4 text-nowrap text-center">
                      {editingRow === index ? (
                        <select
                          id="workType"
                          name="workType"
                          value={editedData.work_type}
                          onChange={(e) => handleChange(e, "work_type")}
                          className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                          <option value="">Select Work Type</option>
                          <option value="WFO">Work From Office</option>
                          <option value="WFH">Work From Home</option>
                        </select>
                      ) : (
                        sheet.work_type
                      )}
                    </td>

                    <td className="px-6 py-4 text-nowrap text-center">
                      {editingRow === index ? (
                        <select
                          id="activityType"
                          name="activityType"
                          value={editedData.activity_type}
                          onChange={(e) => handleChange(e, "activity_type")}
                          className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                          {tags.length > 0 ? (
                            tags.map((tag, index) => (
                              <option key={index} value={tag.id}>{tag.name}</option>
                            ))
                          ) : (
                            <option disabled>No tags available</option>
                          )}
                        </select>
                      ) : (
                        sheet.activity_type
                      )}
                    </td>

                    <td className="px-6 py-4 text-nowrap text-center">
                      {editingRow === index ? (
                        <input
                          type="text"
                          value={editedData.time}
                          onChange={(e) => handleChange(e, "time")}
                          className="border rounded px-2 py-1 text-center"
                          placeholder="HH:MM"
                          maxLength={5} // Ensures max input is 5 characters (HH:MM)
                          inputMode="numeric" // Shows numeric keyboard on mobile
                          onKeyDown={(e) => {
                            const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
                            const isNumber = /^[0-9]$/.test(e.key);
                            const isColon = e.key === ":";

                            if (!isNumber && !isColon && !allowedKeys.includes(e.key)) {
                              e.preventDefault();
                            }

                            if (e.target.value.length === 2 && e.key !== "Backspace") {
                              e.target.value += ":"; // Auto-add colon after HH
                            }
                          }}
                          pattern="^(0[1-9]|1[0-2]):[0-5][0-9]$" // Ensures HH:MM format (12-hour)
                        />
                      ) : (
                        sheet.time
                      )}
                    </td>



                    <td className="px-6 py-4 text-nowrap text-center">
                      {editingRow === index ? (
                        <select
                          id="project_type"
                          name="project_type"
                          value={editedData.project_type}
                          onChange={(e) => handleChange(e, "project_type")}
                          className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                          <option value="">Project Type</option>
                          <option value="Fixed">Fixed</option>
                          <option value="Hourly">Hourly</option>
                        </select>
                      ) : (
                        sheet.project_type
                      )}
                    </td>

                    <td className="px-6 py-4 text-nowrap text-center">
                      {editingRow === index ? (
                        <select
                          id="project_type_status"
                          name="project_type_status"
                          value={editedData.project_type_status}
                          onChange={(e) =>
                            handleChange(e, "project_type_status")
                          }
                          className="min-w-full h-9 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                          <option value="">Project Type</option>
                          <option value="Tracker">Tracker</option>
                          <option value="Offline">Offline</option>
                        </select>
                      ) : (
                        sheet.project_type_status
                      )}
                    </td>
                    <td className="px-6 py-4 text-nowrap text-center relative">
                      {editingRow === index ? (
                        <textarea
                          value={editedData.narration}
                          onChange={(e) => handleChange(e, "narration")}
                          className="border rounded px-2 py-1 w-full min-w-[150px] max-w-[300px] min-h-[50px] max-h-[150px] overflow-auto"
                        />
                      ) : (
                        <div className="relative inline-block max-w-[150px] group">
                          <span className="cursor-pointer">
                            {sheet.narration && sheet.narration.length > 7
                              ? sheet.narration.slice(0, 7) + "..."
                              : sheet.narration || "N/A"} {/* Default fallback */}
                          </span>
                          {sheet.narration && sheet.narration.length > 7 && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-auto max-w-[300px] bg-gray-100 text-black text-sm rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 whitespace-pre-wrap break-words pointer-events-none invisible group-hover:visible">
                              {sheet.narration}
                            </div>
                          )}
                        </div>

                      )}
                    </td>


                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`${getStatusStyles(
                            sheet.status
                          )}`}
                        >
                          {getStatusIcon(sheet.status)}
                          {sheet.status}
                        </span>

                        {editingRow === index ? (
                          <>
                            <button
                              onClick={() => handleSave(sheet.id)}
                              className="save-btn"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingRow("")}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          (sheet.status === "rejected") && (
                            <button
                              onClick={() => handleEditClick(index)}
                              className="edit-btn "
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                          )

                        )}

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-20 text-center text-nowrap"
                  >
                    No performance sheets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700 font-semibold text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
        >
          Next
        </button>
      </div> */}

      <div className="flex justify-center items-center gap-4 py-4">
        <button
          className={`px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${currentPage === 1
            ? "bg-gray-200 disabled:opacity-50"
            : "bg-blue-100 hover:bg-blue-200 ring-2 ring-blue-400 shadow-md font-semibold"
            }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${currentPage === page
              ? "bg-blue-600 text-white font-semibold ring-2 ring-blue-400 shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          className={`px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${currentPage === totalPages
            ? "bg-gray-200 disabled:opacity-50"
            : "bg-blue-100 hover:bg-blue-200 ring-2 ring-blue-400 shadow-md font-semibold"
            }`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmpSheetHistory;
