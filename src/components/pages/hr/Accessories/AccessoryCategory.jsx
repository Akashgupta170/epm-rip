import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, BarChart, X } from 'lucide-react';
import { SectionHeader } from "../../../components/SectionHeader";
import { IconDeleteButton, IconEditButton } from "../../../AllButtons/AllButtons";
import { API_URL } from "../../../utils/ApiConfig";
import { useAccessoryCategory } from "../../../context/AccessoryCategoryContext";

// Reusable Button Component
const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', icon, className = '', disabled = false }) => {
  const baseStyles = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-blue-500',
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${icon ? 'inline-flex items-center' : ''} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Form for Add/Edit
const AccessoryForm = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(formData, initialData?.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">{initialData ? 'Edit Accessory' : 'Add New Accessory'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Accessory Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Laptop, Watch"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Update Accessory' : 'Add Accessory'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
function AccessoryCategory() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/getaccessorycategory`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching accessory categories:', error);
    }
  };

  const handleSubmit = async (formData, id) => {
    const url = id
      ? `${API_URL}/api/updateaccessorycategory/${id}`
      : `${API_URL}/api/addaccessorycategory`;
  
    try {
      const response = id
        ? await axios.put(url, formData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        : await axios.post(url, formData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
  
      if (response.data && response.data.data) {
        fetchCategories();
        setIsFormOpen(false);
        setEditingCategory(null);
      }
    } catch (error) {
      console.error('Failed to save accessory category:', error);
      alert('Error saving category');
    }
  };

  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/editaccessorycategory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        setEditingCategory(response.data.data);
        setIsFormOpen(true);
      }
    } catch (error) {
      console.error('Error fetching category for edit:', error);
      alert('Failed to fetch category');
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`${API_URL}/api/deleteaccessorycategory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete accessory category:', error);
      alert('Error deleting category');
    }
  };

  return (
    <div className="w-full bg-white shadow rounded-2xl">
      <SectionHeader icon={BarChart} title="Accessories Category" subtitle="View, edit and manage accessories" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <Button variant="primary" size="md" icon={<Plus size={18} />} onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}>
            Add category
          </Button>
          <input type="search" placeholder="Search Category..." className="ml-auto border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <main className="w-full py-6">
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-gray-800 bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-center">Created Date</th>
                <th className="px-4 py-2 text-center">Updated Date</th>
                <th className="px-4 py-2 text-center">Category Name</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">No categories available.</td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">{new Date(item.updated_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">{item.name}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <IconEditButton onClick={() => handleEditClick(item.id)} />
                        <IconDeleteButton onClick={() => handleDeleteClick(item.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isFormOpen && (
        <AccessoryForm
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCategory(null);
          }}
          initialData={editingCategory}
        />
      )}
    </div>
  );
}

export default AccessoryCategory;
