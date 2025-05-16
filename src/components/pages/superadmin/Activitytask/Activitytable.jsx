import React, { useEffect, useState } from "react";
import { useActivity } from "../../../context/ActivityContext";
import { Edit, Save, Trash2, Loader2, BarChart } from "lucide-react";
import {
  EditButton, SaveButton, CancelButton, YesButton, DeleteButton, ExportButton,
  ImportButton, ClearButton, CloseButton, SubmitButton, IconApproveButton,
  IconRejectButton, IconCancelTaskButton, IconSaveButton, IconDeleteButton,
  IconEditButton, IconViewButton
} from "../../../AllButtons/AllButtons";
import { SectionHeader } from '../../../components/SectionHeader';
import { Activity } from "./Activity";

export const Activitytable = () => {
  const [isUpdating, setIsUpdating] = useState(false); // Loading state for updates
  const [deleteclient, setDeleteclient] = useState(null);
  const [editid, setEditid] = useState(null);
  const [deleteid, setDeleteid] = useState(null);
  const [newTagName, setNewTagName] = useState(""); // State for new tag name
  const { getActivityTags, activityTags, loading, message, updateActivityTag, deleteTagActivity } = useActivity();

  useEffect(() => {
    // Fetch activity tags on component mount
    getActivityTags();
  }, []);

  const handleUpdateTag = (id) => {
    if (newTagName.trim()) {
      setIsUpdating(true);
      updateActivityTag(id, newTagName);
      setNewTagName(""); // Reset input field after updating
      setEditid(null); // Exit edit mode after updating
    } else {
      alert("Please provide a valid name for the tag");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // Find the tag to delete
      const tagToDelete = activityTags.find((tag) => tag.id === deleteid);
  
      if (tagToDelete) {
        await deleteTagActivity(tagToDelete.id); // Call delete API
        getActivityTags(); // Refresh the activity tags after deletion
        setDeleteclient(false); // Close modal
        setDeleteid(null); // Reset the delete id
      } else {
        alert("No tag selected for deletion.");
      }
    } catch (error) {
      console.error("Failed to delete tag activity", error);
      alert("Failed to delete tag activity.");
    }
  };
  

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg max-h-screen overflow-y-auto">
      <SectionHeader icon={BarChart} title="Activity Tags Management" subtitle="Manage employees and update details" />
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white z-10 shadow-md">
        <Activity />
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <table className="w-full">
            <thead>
              <tr className="table-bg-heading table-th-tr-row">
                <th className="px-4 py-2 font-medium text-center text-sm">Created Date</th>
                <th className="px-4 py-2 font-medium text-center text-sm">Updated Date</th>
                <th className="px-4 py-2 font-medium text-center text-sm">Tag Name</th>
                <th className="px-4 py-2 font-medium text-center text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                      <span className="text-gray-500">Loading tags...</span>
                    </div>
                  </td>
                </tr>
              ) : activityTags.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-gray-100 p-3">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No Tags found</h3>
                      <p className="mt-1 text-sm text-gray-500">No Tags have been created yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activityTags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-center text-gray-600 text-sm">
                      {/* Format the created_at date */}
                      <span className="flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                        {new Date(tag.created_at).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 text-sm">
                      {/* Format the updated_at date */}
                      {new Date(tag.updated_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-800 font-medium text-sm">
                      {editid === tag.id ? (
                        <input
                          type="text"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                        />
                      ) : (
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">{tag.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {editid === tag.id ? (
                          <>
                            <IconSaveButton
                              onClick={() => handleUpdateTag(tag.id)}
                              disabled={isUpdating}
                            />
                            <IconCancelTaskButton onClick={() => setEditid(null)} />
                          </>
                        ) : (
                          <>
                            <IconEditButton onClick={() => { setEditid(tag.id); setNewTagName(tag.name); }} />
                            <IconDeleteButton onClick={() => {
                                setDeleteclient(true);
                                setDeleteid(tag.id); // Track tag to delete
                              }} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteclient && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                Are you sure you want to delete this Activity?
              </h2>
            </div>
            <div id="deleteModalDescription" className="text-sm text-gray-600 mb-4">
              This action cannot be undone. Please confirm if you'd like to proceed.
            </div>
            <div className="flex justify-end gap-2 my-2">
            <CancelButton onClick={() => { setDeleteclient(false); setDeleteid(null); }} />
              <YesButton onClick={handleConfirmDelete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
