import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from "../utils/ApiConfig";

const AccessoryCategoryContext = createContext();

export const useAccessoryCategory = () => {
  const context = useContext(AccessoryCategoryContext);
  if (!context) {
    throw new Error('useAccessoryCategory must be used within AccessoryCategoryProvider');
  }
  return context;
};

export const AccessoryCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCategory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/getaccessorycategory`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Error fetching categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCategory = async (name) => {
    try {
      await axios.post(`${API_URL}/api/addaccessorycategory`, { name });
      fetchCategory();
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage('Error adding category');
    }
  };

  const updateCategory = async (id, name) => {
    try {
      await axios.put(`${API_URL}/api/updateaccessorycategory/${id}`, { name });
      fetchCategory();
    } catch (error) {
      console.error('Error updating category:', error);
      setMessage('Error updating category');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/deleteaccessorycategory/${id}`);
      fetchCategory();
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage('Error deleting category');
    }
  };

  return (
    <AccessoryCategoryContext.Provider value={{ categories, isLoading, message, fetchCategory, addCategory, updateCategory, deleteCategory }}>
      {children}
    </AccessoryCategoryContext.Provider>
  );
};
