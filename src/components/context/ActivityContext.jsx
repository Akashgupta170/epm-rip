import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/ApiConfig';

const ActivityContext = createContext();

export const useActivity = () => {
  return useContext(ActivityContext);
};

export const ActivityProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activityTags, setActivityTags] = useState([]);
  const token = localStorage.getItem("userToken");

  const addActivity = async (name) => {
    setLoading(true);
    setMessage(""); 

    try {
      const response = await axios.post(
        `${API_URL}/api/addtagsactivity`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("Tag added successfully!");
      }
    } catch (error) {
      setMessage("Failed to add tag. Please try again.");
    } finally {
      setLoading(false);
      getActivityTags();
    }
  };


  const getActivityTags = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/getactivity-tag`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setActivityTags(response.data); 
      }
    } catch (error) {
      setMessage("Failed to fetch activity tags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateActivityTag = async (id, name) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/api/updatetagsactivity/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      setMessage(response.data.message || "Tag updated successfully");
      setLoading(false);
      getActivityTags(); 
    } catch (error) {
      setMessage("Error updating activity tag");
      setLoading(false);
    }
  };

  const deleteTagActivity = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/deletetagsactivitys/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting tag activity:', error);
      throw error;
    }
  };

  return (
    <ActivityContext.Provider value={{ updateActivityTag, addActivity, getActivityTags, activityTags, loading, message, deleteTagActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};
