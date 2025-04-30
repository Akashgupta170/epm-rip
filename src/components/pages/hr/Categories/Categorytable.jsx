import React, { useEffect, useState } from "react";
import { useCategory } from "../../../context/CategoryContext";
import { Edit, Save, Trash2, Loader2, BarChart } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Category } from './Category';
import Alert from "../../../components/Alerts"; // import Alert
import { SectionHeader } from '../../../components/SectionHeader';
import {
  IconSaveButton,
  IconDeleteButton,
  IconEditButton,
  IconCancelTaskButton,
  YesButton
} from "../../../AllButtons/AllButtons";

export const Categorytable = () => {
  const {
    categories,
    fetchCategories,
    deleteCategory,
    updateCategory,
    isLoading,
    alert,
  } = useCategory();
  const navigate = useNavigate();
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  console.log("these are cat", categories);

  const handleEditClick = (category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleSaveClick = async () => {
    if (!editCategoryName.trim()) return;
    setIsUpdating(true);
    await updateCategory(editCategoryId, editCategoryName);
    setIsUpdating(false);
    setEditCategoryId(null);
  };

  const handleViewClick = (id) => {
    navigate(`/hr/add-accessories/${id}`);
  };

  const handleDeleteClick = async (categoryId) => {
    if (deleteConfirm === categoryId) {
      await deleteCategory(categoryId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(categoryId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-lg max-h-screen overflow-y-auto">
      <SectionHeader icon={BarChart} title="Category Management" subtitle="View, edit and manage categories" />
      {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          onClose={() => {}}
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white z-10 shadow-md">
        <Category />
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1020px]">
          <table className="w-full">
            <thead>
              <tr className="table-bg-heading table-th-tr-row">
                <th className="px-4 py-2 text-center text-sm font-medium">Created Date</th>
                <th className="px-4 py-2 text-center text-sm font-medium">Updated Date</th>
                <th className="px-4 py-2 text-center text-sm font-medium">Category Name</th>
                <th className="px-4 py-2 text-center text-sm font-medium">Actions</th>
                <th className="px-4 py-2 text-center text-sm font-medium">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                      <span className="text-gray-500">Loading Category...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {formatDate(category.updated_at)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-800">
                      {editCategoryId === category.id ? (
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
                        />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                          {category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        {editCategoryId === category.id ? (
                          <>
                            <IconSaveButton onClick={handleSaveClick} disabled={isUpdating} />
                            <IconCancelTaskButton onClick={() => setEditCategoryId(null)} />
                          </>
                        ) : (
                          <>
                            <IconEditButton onClick={() => handleEditClick(category)} />
                            {deleteConfirm === category.id ? (
                              <YesButton onClick={() => handleDeleteClick(category.id)} />
                            ) : (
                              <IconDeleteButton onClick={() => setDeleteConfirm(category.id)} />
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-800">
                      <div>
                        <button className="bg-blue-600 text-white py-2 px-3 rounded-lg" onClick={() => handleViewClick(category.id)} >Manage</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No Categories Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
