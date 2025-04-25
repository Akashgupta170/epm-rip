import React, { useState } from "react";
import { useActivity } from "../../../context/ActivityContext";
import { Loader2, X } from "lucide-react";
import { SubmitButton } from "../../../AllButtons/AllButtons";

export const Activity = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const { addActivity, loading, message } = useActivity();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    await addActivity(tagName);
    setTagName("");
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white">
      <button onClick={() => setIsModalOpen(true)} className="add-items-btn">
        Add Activity Tag
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

            <h2 className="text-xl font-semibold text-gray-800">Enter Tag Details</h2>
            <p className="text-sm text-gray-500 mt-1">Add a new Tag to the system</p>

            {/* Show Success or Error Message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-md text-sm font-medium text-center ${
                  message.includes("successfully")
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
                  Activity Name
                </label>
                <input
                  id="role"
                  placeholder="Enter new activity Tag"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <SubmitButton disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding Tag...
                  </>
                ) : (
                  "Submit"
                )}
              </SubmitButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
