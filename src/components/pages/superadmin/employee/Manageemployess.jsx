import React, { useState, useEffect,useRef  } from "react";
import { useEmployees } from "../../../context/EmployeeContext";
import { useTeam } from "../../../context/TeamContext";
import { useRole } from "../../../context/RoleContext";
import { useAlert } from "../../../context/AlertContext";
import { FaFileExcel, FaGoogle } from "react-icons/fa";
import user_profile from "../../../aasests/profile-img.jpg"
import user_profile_bg from "../../../aasests/user-profile-bg.jpg"
import user_profile_bg_2 from "../../../aasests/user-profile-bg-2.jpg"
import { BarChart, Search } from "lucide-react";
import { SectionHeader } from '../../../components/SectionHeader';
import { exportToExcel, importFromExcel, useImportEmployees, fetchGoogleSheetData } from "../../../components/excelUtils";
import { CancelButton, ExportButton, SaveChangeButton, ImportButton, ClearButton, IconDeleteButton, IconEditButton, IconViewButton } from "../../../AllButtons/AllButtons";
import { useNavigate } from 'react-router-dom';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const { employees, loading, addEmployee, deleteEmployee, updateEmployee, error } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [importType, setImportType] = useState(null); // Track selected import type
  const [showImportOptions, setShowImportOptions] = useState(false); // FIX: Define state
  const [filterBy, setFilterBy] = useState("name"); // Default filter by name
  // const [importedEmployees, setImportedEmployees] = useState([]);
  // const [importedData, setImportedData] = useState([]);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const { importEmployees } = useImportEmployees();
  // const fileInputRef = useRef(null);
  // Filtering employees
  const filteredEmployees = employees.filter((employee) => {
    const value = employee[filterBy]?.toLowerCase() || "";
    return value.includes(searchQuery.toLowerCase());
  });


  // 📌 Handle File Import
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    importFromExcel(file, (data) => {
      console.log("Imported Data (Before adding to system):", data);
      importEmployees(data); // ✅ Add employees to the system
    });
  };


  // Function to clear filter
  const clearFilter = () => {
    setSearchQuery("");
    setFilterBy("name");
  };

  const handleGoogleSheetImport = () => {
    if (!googleSheetUrl) {
      alert("Please enter a Google Sheets link.");
      return;
    }
    fetchGoogleSheetData(googleSheetUrl, importEmployees);
  };

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    phone_num: "",
    emergency_phone_num: "",
    address: "",
    team_id: "",
    role_id: "",
    profile_pic: null,
    pm_id: 1,
  });
  const { showAlert } = useAlert();
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditingEmployee({ ...employee });
  };

  const handleUpdateEmployee = async () => {
    console.log("before sending",editingEmployee);
    if (!editingEmployee) return;

    try {
      await updateEmployee(editingEmployee.id, { ...editingEmployee });
      setEditingEmployee(null);
      setSelectedEmployee(null);
    } catch (error) {
      // console.error("❌ Error updating employee:", error);
      showAlert({ variant: "error", title: "Failed", message: error.message });
    }
  };


  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id);
    } catch (error) {
      // showAlert("error", "Failed", error.message); // ✅ Fixed error alert
      showAlert({ variant: "error", title: "Failed", message: error.message });
    }
  };




  const handleAddEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.password ||
      !newEmployee.phone_num ||
      !newEmployee.emergency_phone_num ||
      !newEmployee.address ||
      !newEmployee.team_id ||
      !newEmployee.role_id

    ) {
      showAlert({ variant: "warning", title: "Required fields", message: "Please fill all fields" });
      console.log("❌ Missing required fields");
      return;
    }

    console.log("✅ New Employee Data:", newEmployee);

    try {
      await addEmployee(newEmployee);
      setNewEmployee({
        name: "",
        email: "",
        password: "",
        phone_num: "",
        emergency_phone_num: "",
        address: "",
        team_id: "",
        role_id: "",
        profile_pic: null,
      });
      // closeModal();
    } catch (error) {
      console.log("❌ Error:", error);
      showAlert({ variant: "error", title: "Failed", message: error.message });
    }
  };




  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { teams, fetchTeams } = useTeam();
  const { roles, fetchRoles } = useRole();

  useEffect(() => {
    fetchTeams();
    fetchRoles();
    console.log("emplyeess", employees);
  }, []);

  useEffect(() => {
    console.log("Updated Roles:", roles);
  }, [roles]);

  const employeeList = Array.isArray(employees) ? employees : [];
  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
  };


  const handleViewEmployeeDetail = (employee) => {
  
    navigate(`/superadmin/users/${employee.id}`, { state: { employee } });
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white !shadow-md max-h-screen overflow-y-auto">
      <SectionHeader icon={BarChart} title="Employee Management" subtitle="Manage employees and update details" />
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white z-10 shadow-md">
        {/* Add Employee Button */}
        <button onClick={openModal} className="add-items-btn">
          Add Employee
        </button>
        {/* Add Employee Button */}
        {/* <button
          onClick={openModal}
          className="add-items-btn"
        >
          Add Employee
        </button> */}

        {/* Search & Filter */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 border p-2 rounded-lg shadow-md bg-white">
          {/* <input
            type="text"
            placeholder={`Search by ${filterBy}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          /> */}
          <div className="flex items-center w-full border border-gray-300 px-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="h-5 w-5 text-gray-400 mr-[5px]" />
            <input
              type="text"
              className="w-full rounded-lg focus:outline-none py-2"
              placeholder={`Search by ${filterBy}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white cursor-pointer focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="team">Department</option>
          </select>

          {/* <button
            onClick={() => setSearchQuery("")}
            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Clear
          </button> */}
          <ClearButton onClick={() => setSearchQuery("")} />
          <div className="flex items-center gap-3 bg-white relative">
            {/* <button
              onClick={() => exportToExcel(employees, "employees.xlsx")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Export to Excel
            </button> */}
            <ImportButton onClick={() => setShowImportOptions(!showImportOptions)} />
            <div className="relative">
              <ExportButton onClick={() => exportToExcel(employees, "employees.xlsx")} />
              {/* <button
                onClick={() => setShowImportOptions(!showImportOptions)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Import
              </button> */}
              {showImportOptions && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-30">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-96 flex flex-col gap-4 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-gray-800 text-center">Select Import Type</h3>

                    <button
                      onClick={() => {
                        setImportType("excel");
                        setShowImportOptions(false);
                      }}
                      className="flex items-center justify-center gap-3 w-full px-4 py-3 text-gray-700 border rounded-md hover:bg-gray-100 transition"
                    >
                      <FaFileExcel className="text-green-600 text-xl" />
                      <span>Import Excel</span>
                    </button>

                    <button
                      onClick={() => {
                        setImportType("googleSheet");
                        setShowImportOptions(false);
                      }}
                      className="flex items-center justify-center gap-3 w-full px-4 py-3 text-gray-700 border rounded-md hover:bg-gray-100 transition"
                    >
                      <FaGoogle className="text-blue-500 text-xl" />
                      <span>Import Google Sheet</span>
                    </button>

                    {/* <button
                      onClick={() => setShowImportOptions(false)}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Cancel
                    </button> */}
                    <CancelButton onClick={() => setShowImportOptions(false)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Dynamic Import Section */}
        {importType === "excel" && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="mt-3 p-4 border rounded-lg bg-white shadow-md flex flex-col gap-3">
              <p className="text-gray-700 font-medium">Upload an Excel File:</p>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImport}
                className="px-3 py-2 border rounded-md cursor-pointer"
              />
              {/* <button
                onClick={() => setImportType("")}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Cancel
              </button> */}
              <CancelButton onClick={() => setImportType("")} />
            </div>

          </div>
        )}

        {importType === "googleSheet" && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="mt-3 p-4 border rounded-lg bg-white shadow-md flex flex-col gap-3">
              <p className="text-gray-700 font-medium">Paste Google Sheet Link:</p>
              <input
                type="text"
                placeholder="Enter Google Sheet link"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                className="px-3 py-2 border rounded-md w-72 focus:outline-none"
              />
              <button
                onClick={handleGoogleSheetImport}
                className="assign-btn items-center justify-center"
              >
                Import from Google Sheets
              </button>
              <CancelButton onClick={() => setImportType("")} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="">
            <tr className="table-th-tr-row table-bg-heading">
              <th className="px-4 py-2 text-center"></th>
              <th className="px-4 py-2 text-center">Name</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Phone</th>
              <th className="px-4 py-2 text-center">Department</th>
              <th className="px-4 py-2 text-center">Role</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">Loading employees...</td>
              </tr>
            ) : employeeList.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">No employees found</td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="px-4 py-3 text-gray-900">
                    <img
                      className="border-2 shadow-[5px_8px_10px_-7px_rgba(128,128,128,1)] rounded-full w-12 h-12"
                      src={employee.profile_pic ? employee.profile_pic : user_profile }
                      alt=""
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900 text-center">{employee.name}</td>
                  <td className="px-4 py-3 text-gray-900 text-center">{employee.email}</td>
                  <td className="px-4 py-3 text-gray-900 text-center">{employee.phone_num || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-900 text-center">{employee.team || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-900 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">{employee.roles || "N/A"}</span>
                  </td>
                  <td className="px-4 py-3 flex gap-2 flex items-center justify-center">
                    {/* <button
                      onClick={() => handleViewEmployee(employee)}
                      className="flex items-center space-x-2 text-base px-3 py-1 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition"
                    ><Eye className="h-4 w-4 mr-1" />
                      View
                    </button> */}
                    <IconViewButton key={employee.id} onClick={() => {if(employee.roles === "Team"){
                      handleViewEmployeeDetail(employee);
                    }
                    else{
                      setSelectedEmployee(employee);
                    }
                    } 
                  }

                      />
                    <IconEditButton onClick={() => handleEditEmployee(employee)} />
                    <IconDeleteButton onClick={() => handleDeleteEmployee(employee.id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg">
            <button onClick={() => {setSelectedEmployee(null);
              setEditingEmployee(null)}}
            className="absolute top-4 right-4 text-gray-500 hover:text-black">
              &times;
            </button>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold text-center mb-4 mt-2">Employee Details</h2>
              <img
                className="border-2 border-[#d7d7d7] outline outline-[5px] outline-white p-[3px] shadow-[5px_12px_15px_-6px_rgba(128,128,128,1)] rounded-full w-28 h-28 cursor-pointer"
                src={editingEmployee.profile_pic || user_profile}
                alt={editingEmployee.name}
              />
                <input
                className="relative left-14 top-4 mb-8"
                  type="file"
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, profile_pic: e.target.files[0] })}
                />
            </div>
            {editingEmployee ? (
              <>
                <input type="text" name="name" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} className="border p-2 w-full mb-2" placeholder="Name" />
                <input type="email" name="email" value={editingEmployee.email} onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })} className="border p-2 w-full mb-2" placeholder="Email" />
                <input type="text" name="phone_num" value={editingEmployee.phone_num || ""} onChange={(e) => setEditingEmployee({ ...editingEmployee, phone_num: e.target.value })} className="border p-2 w-full mb-2" placeholder="Phone Number" />
                <select
                  name="role_id"
                  value={editingEmployee.role_id || ""}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, role_id: e.target.value })}
                  className="border p-2 w-full mb-2"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>

                <select
                  name="team_id"
                  value={editingEmployee.team_id || ""}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, team_id: e.target.value })}
                  className="border p-2 w-full mb-2"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <SaveChangeButton onClick={handleUpdateEmployee}/>
              </>
            ) : (
              <>
                <div className="user_details [#CECECE] shadow-[0px_0px_11px_-6px_grey] border rounded-[20px]">
                  <div className="flex bg-cover bg-center flex justify-center items-center p-[11px] rounded-t-[20px] flex flex-col gap-3 text-[25px]" style={{ backgroundImage: `url(${user_profile_bg_2})` }}>
                    <img className="border-2 border-[#d7d7d7] outline outline-[5px] outline-white p-[3px] shadow-[5px_12px_15px_-6px_rgba(128,128,128,1)] rounded-full w-36 h-36" src={user_profile} alt="" />
                    <p>{selectedEmployee.name}</p>
                  </div>
                  <div className="m-[18px] flex flex-col gap-[5px]">
                    <p><strong>Email:</strong> {selectedEmployee.email}</p>
                    <p><strong>Phone:</strong> {selectedEmployee.phone_num || "N/A"}</p>
                    <p><strong>Emergency Phone:</strong> {selectedEmployee.emergency_phone_num || "N/A"}</p>
                    <p><strong>Role:</strong> {selectedEmployee.roles || "N/A"}</p>
                    <p><strong>Department:</strong> {selectedEmployee.team || "N/A"}</p>
                    <p><strong>address:</strong> {selectedEmployee.address || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-center px-[15px] pt-[10px] pb-[22px]">
                    <button onClick={() => handleEditEmployee(selectedEmployee)} className="bg-green-600 text-white px-4 py-2 rounded-md w-full hover:bg-green-700">
                      Edit
                    </button>
                  </div>
                </div>
              </>

            )}
          </div>
        </div>
      )}



      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50 animate-fadeIn">
          <div className="relative w-full h-[650px] overflow-y-scroll max-w-lg p-6 bg-white bg-opacity-90 rounded-3xl shadow-2xl transform scale-95 animate-slideUp border border-gray-300 backdrop-filter backdrop-blur-lg">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl transition-all"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Add Employee</h2>

            <form
              className="space-y-5"
              onSubmit={(e) => { e.preventDefault(); handleAddEmployee(); }}
            >
              <div className="grid grid-cols-1 gap-4">
                <label className="block text-sm font-medium text-gray-700">Client Name</label>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
                  autoComplete="username"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
                  autoComplete="current-password"
                />

                <div className="flex items-center border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="pl-3 text-gray-500">+91</span>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newEmployee.phone_num}
                    onChange={(e) => {
                      const inputVal = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      if (inputVal.length <= 10) {
                        setNewEmployee({ ...newEmployee, phone_num: inputVal });
                      }
                    }}
                    className="w-full p-3 outline-none"
                  />
                </div>

                <div className="flex items-center border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="pl-3 text-gray-500">+91</span>
                  <input
                    type="text"
                    placeholder="Emergency Contact"
                    value={newEmployee.emergency_phone_num}
                    onChange={(e) => {
                      const inputVal = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      if (inputVal.length <= 10) {
                        setNewEmployee({ ...newEmployee, emergency_phone_num: inputVal });
                      }
                    }}
                    className="w-full p-3 outline-none"
                  />
                </div>


                {/* <input 
                  type="text" 
                  placeholder="Emergency Contact" 
                  value={newEmployee.emergency_phone_num} 
                  onChange={(e) => setNewEmployee({ ...newEmployee, emergency_phone_num: e.target.value })} 
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm" 
                /> */}

                <input
                  type="text"
                  placeholder="Home Address"
                  value={newEmployee.address}
                  onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
                />

                <select
                  value={newEmployee.team_id}
                  onChange={(e) => setNewEmployee({ ...newEmployee, team_id: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>

                <select
                  value={newEmployee.role_id}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role_id: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>

                <input
                  type="file"
                  onChange={(e) => setNewEmployee({ ...newEmployee, profile_pic: e.target.files[0] })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Inline error message */}
              <button
                type="submit"
                className="add-employee"
              >
                Add Employee
              </button>
            </form>
          </div>
        </div>
      )}

      {/* {alert && <Alert {...alert} />} */}

    </div>
  );
};
export default EmployeeManagement;