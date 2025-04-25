import React, { useState } from "react";
import { useRole } from "../../../context/RoleContext";
import { Loader2, X } from "lucide-react";
import { EditButton, SaveButton, CancelButton, YesButton, DeleteButton, ExportButton, ImportButton, ClearButton, CloseButton, SubmitButton, IconApproveButton, IconRejectButton, IconCancelTaskButton, IconSaveButton, IconDeleteButton, IconEditButton, IconViewButton, } from "../../../AllButtons/AllButtons";


export const Role = () => {
  const { addRole, isLoading, message } = useRole();
  const [roleName, setRoleName] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roleName.trim()) {
      await addRole(roleName);
      setRoleName(""); // Reset input after submission
      setShowMessage(true);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white">
      {/* <h2 className="text-xl font-semibold text-gray-800">Enter Role Details</h2>
      <p className="text-sm text-gray-500 mt-1">Add a new role to the system</p> */}


      <button
        onClick={() => setIsModalOpen(true)}
        className="add-items-btn"
      >
        Add Role
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

            <h2 className="text-xl font-semibold text-gray-800">Enter Role Details</h2>
            <p className="text-sm text-gray-500 mt-1">Add a new role to the system</p>

            {showMessage && message && (
              <div
                className={`mt-4 p-3 rounded-md text-sm font-medium text-center ${message.includes("successfully")
                    ? "bg-green-50 text-green-800 border border-green-300"
                    : "bg-red-50 text-red-800 border border-red-300"
                  }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="role" className="block font-medium text-gray-700 text-sm">
                  Role Name
                </label>
                <input
                  id="role"
                  placeholder="Enter new Role"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>

              {/* <button
                type="submit"
                className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding Role...
                  </>
                ) : (
                  "Submit"
                )}
              </button> */}
              <SubmitButton disabled={isLoading} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};