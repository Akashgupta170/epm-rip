import React, { useEffect, useState } from "react";
import { useAssignAccessory } from "../../../context/AssignAccessoryContext";
import { Edit, Trash2, Loader2, BarChart } from "lucide-react";
import { IconEditButton, IconDeleteButton, IconSaveButton, IconCancelTaskButton } from "../../../AllButtons/AllButtons";
import { SectionHeader } from '../../../components/SectionHeader';
import { useEmployees } from '../../../context/EmployeeContext';
import { Accessories } from './AssignAccessories';
import { Alert } from "@material-tailwind/react";
import Select from 'react-select';
import axios from "axios";
import { API_URL } from "../../../utils/ApiConfig";

export const AssignAccessoryTable = () => {
  const { accessoryAssign, loading, deleteAccessoryAssign, updateAccessoryAssign } = useAssignAccessory();
  const [editAssignmentId, setEditAssignmentId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const { employees, fetchEmployees } = useEmployees();
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(`${API_URL}/api/allaccessory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccessories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching accessories:", err);
      setAccessories([]);
    }
  };

  useEffect(() => {
    if (editAssignmentId) {
      const assignment = accessoryAssign.find(item => item.id === editAssignmentId);
      setEditFormData({ ...assignment });
      fetchEmployees();
    }
  }, [editAssignmentId, accessoryAssign]);

  const handleSaveClick = async () => {
    if (!editFormData.user_id || !editFormData.accessory_id || !editFormData.assigned_at) return;
    await updateAccessoryAssign(editAssignmentId, editFormData);
    setEditAssignmentId(null);
    fetchEmployees();
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-lg h-screen overflow-y-auto">
      <SectionHeader icon={BarChart} title="Accessory assign" subtitle="Accessory assign and update details" />
      <div className="p-4">
        {alert.show && (
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            onClose={() => {}}
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white z-10 shadow-md">
          <Accessories />
        </div>
        <table className="w-full mt-4">
          <thead>
            <tr className="table-bg-heading table-th-tr-row">
              <th className="px-4 py-2 text-center">User</th>
              <th className="px-4 py-2 text-center">Accessory</th>
              <th className="px-4 py-2 text-center">Assigned At</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                    <span className="text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : accessoryAssign.length > 0 ? (
              accessoryAssign.map((assignment) => (
                <tr key={assignment.id} className="border">
                  <td className="px-6 py-4 text-center">
                    {editAssignmentId === assignment.id ? (
                      <div className="min-w-[200px]">
                        <Select
                          value={employees.find(emp => emp.id === parseInt(editFormData.user_id)) || null}
                          onChange={(selected) =>
                            setEditFormData({ ...editFormData, user_id: selected?.id.toString() })
                          }
                          options={employees}
                          getOptionLabel={(e) => e.name}
                          getOptionValue={(e) => e.id.toString()}
                          placeholder="Select User"
                          isClearable
                        />
                      </div>
                    ) : (
                      assignment.user.name
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {editAssignmentId === assignment.id ? (
                      <div className="min-w-[200px]">
                        <Select
                          value={
                            accessories.find(
                              (accessory) => accessory.id === parseInt(editFormData.accessory_id)
                            ) || null
                          }
                          onChange={(selected) =>
                            setEditFormData({ ...editFormData, accessory_id: selected?.id.toString() })
                          }
                          options={accessories}
                          getOptionLabel={(e) => e.model} // show model name
                          getOptionValue={(e) => e.id.toString()} // use accessory ID as value
                          placeholder="Select Accessory"
                          isClearable
                        />
                      </div>
                    ) : (
                      assignment.accessory.brand_name
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {editAssignmentId === assignment.id ? (
                      <input
                        type="date"
                        value={editFormData.assigned_at}
                        onChange={(e) => setEditFormData({ ...editFormData, assigned_at: e.target.value })}
                        className="border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      assignment.assigned_at
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {editAssignmentId === assignment.id ? (
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="border border-gray-300 rounded-md p-2"
                      >
                        <option value="assigned">Assigned</option>
                        <option value="vacant">Vacant</option>
                        <option value="in-repair">In-Repair</option>
                        <option value="lost">Lost</option>
                      </select>
                    ) : (
                      assignment.status
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      {editAssignmentId === assignment.id ? (
                        <>
                          <IconSaveButton onClick={handleSaveClick} />
                          <IconCancelTaskButton onClick={() => setEditAssignmentId(null)} />
                        </>
                      ) : (
                        <>
                          <IconEditButton onClick={() => setEditAssignmentId(assignment.id)} />
                          <IconDeleteButton onClick={() => deleteAccessoryAssign(assignment.id)} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">No Assignments Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
