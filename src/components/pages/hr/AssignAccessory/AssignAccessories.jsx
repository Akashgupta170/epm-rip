import React, { useState, useEffect } from 'react';
import { useAssignAccessory } from '../../../context/AssignAccessoryContext';
import { Loader2, X } from 'lucide-react';
import { SubmitButton } from '../../../AllButtons/AllButtons';
import { useEmployees } from '../../../context/EmployeeContext';
import { useCategory } from '../../../context/CategoryContext';
import Select from 'react-select';
import { API_URL } from '../../../utils/ApiConfig';
import axios from 'axios';

export const Accessories = () => {
  const { addAccessoryAssign, loading, error } = useAssignAccessory();
  const { employees, loading: employeeLoading } = useEmployees();
  const { categories, isLoading: categoryLoading, fetchCategories } = useCategory();
  const token = localStorage.getItem('userToken');

  const [accessories, setAccessories] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    category_id: '',
    accessory_id: '',
    assigned_at: '',
    status: 'assigned',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch accessories when category changes
  useEffect(() => {
    const fetchAccessories = async () => {
      if (!formData.category_id) return;

      try {
        const res = await axios.get(`${API_URL}/api/getaccessory/${formData.category_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccessories(res.data.data || []);
      } catch (err) {
        console.error('Error fetching accessories:', err);
        setAccessories([]);
      }
    };

    fetchAccessories();
  }, [formData.category_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.user_id && formData.accessory_id && formData.assigned_at) {
      await addAccessoryAssign(formData);
      setFormData({
        user_id: '',
        category_id: '',
        accessory_id: '',
        assigned_at: '',
        status: 'assigned',
      });
      setIsModalOpen(false);
      setShowMessage(true);
    }
  };

  return (
    <div className="bg-white">
      <button onClick={() => setIsModalOpen(true)} className="add-items-btn">
        Accessory Assign
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800">Assign Accessory</h2>
            <p className="text-sm text-gray-500 mt-1">Assign a new accessory to a user</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* User */}
              <div>
                <label htmlFor="user_id" className="block font-medium text-gray-700 text-sm">
                  User
                </label>
                <Select
                  options={employees.map(emp => ({ value: emp.id, label: emp.name }))}
                  value={
                    formData.user_id
                      ? {
                          value: formData.user_id,
                          label: employees.find(emp => emp.id === formData.user_id)?.name || '',
                        }
                      : null
                  }
                  onChange={selected =>
                    setFormData({ ...formData, user_id: selected.value })
                  }
                  isLoading={employeeLoading}
                  placeholder="Search User"
                  className="mt-1"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category_id" className="block font-medium text-gray-700 text-sm">
                  Category
                </label>
                <Select
                  options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                  value={
                    formData.category_id
                      ? {
                          value: formData.category_id,
                          label: categories.find(cat => cat.id === formData.category_id)?.name || '',
                        }
                      : null
                  }
                  onChange={selected =>
                    setFormData({ ...formData, category_id: selected.value, accessory_id: '' }) // clear accessory on change
                  }
                  isLoading={categoryLoading}
                  placeholder="Search Category"
                  className="mt-1"
                />
              </div>

              {/* Accessory */}
              <div>
                <label htmlFor="accessory_id" className="block font-medium text-gray-700 text-sm">
                  Accessory
                </label>
                <Select
                  options={accessories.map(acc => ({
                    value: acc.id,
                    label: acc.accessory_no,
                  }))}
                  value={
                    formData.accessory_id
                      ? {
                          value: formData.accessory_id,
                          label:
                            accessories.find(acc => acc.id === formData.accessory_id)
                              ?.accessory_no || '',
                        }
                      : null
                  }
                  onChange={selected =>
                    setFormData({ ...formData, accessory_id: selected.value })
                  }
                  isDisabled={!formData.category_id}
                  placeholder="Select Accessory"
                  className="mt-1"
                />
              </div>

              {/* Assigned At */}
              <div>
                <label htmlFor="assigned_at" className="block font-medium text-gray-700 text-sm">
                  Assigned At
                </label>
                <input
                  id="assigned_at"
                  type="date"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.assigned_at}
                  onChange={e =>
                    setFormData({ ...formData, assigned_at: e.target.value })
                  }
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block font-medium text-gray-700 text-sm">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.status}
                  onChange={e =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="assigned">Assigned</option>
                  <option value="vacant">Vacant</option>
                  <option value="in-repair">In-Repair</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <SubmitButton disabled={loading} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
