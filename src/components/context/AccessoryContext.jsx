import { createContext, useContext, useEffect, useState } from "react";
import { useAlert } from "./AlertContext";

const AccessoryContext = createContext();

export const AccessoryProvider = ({ children }) => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchAccessories();
  }, []);

  // 📦 Fetch Accessories
  const fetchAccessories = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("Unauthorized");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/getaccessory`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch accessories");

      const data = await response.json();
      setAccessories(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add Accessory
  const addAccessory = async (accessoryData) => {
    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();

      Object.entries(accessoryData).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const response = await fetch(`http://127.0.0.1:8000/api/addaccessory`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const message =
          errorResponse?.message || "Something went wrong while adding";
        showAlert({ variant: "error", title: "Error", message });
        return;
      }

      const result = await response.json();
      setAccessories((prev) => [...prev, result.data]);
      showAlert({ variant: "success", title: "Success", message: "Accessory added successfully" });
    } catch (err) {
      showAlert({ variant: "error", title: "Error", message: err.message });
    }
  };

  // ✏️ Update Accessory
  const updateAccessory = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(
        `http://127.0.0.1:8000/api/updateaccessory/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error("Failed to update accessory");

      const updated = await response.json();
      setAccessories((prev) =>
        prev.map((item) => (item.id === id ? updated.data : item))
      );

      showAlert({
        variant: "success",
        title: "Success",
        message: "Accessory updated successfully",
      });
    } catch (err) {
      showAlert({ variant: "error", title: "Error", message: err.message });
    }
  };

  // ❌ Delete Accessory
  const deleteAccessory = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(
        `http://127.0.0.1:8000/api/deleteaccessory/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete accessory");

      setAccessories((prev) => prev.filter((item) => item.id !== id));
      showAlert({
        variant: "success",
        title: "Success",
        message: "Accessory deleted successfully",
      });
    } catch (err) {
      showAlert({ variant: "error", title: "Error", message: err.message });
    }
  };

  return (
    <AccessoryContext.Provider
      value={{
        accessories,
        loading,
        error,
        fetchAccessories,
        addAccessory,
        updateAccessory,
        deleteAccessory,
      }}
    >
      {children}
    </AccessoryContext.Provider>
  );
};

export const useAccessory = () => {
  const context = useContext(AccessoryContext);
  if (!context) {
    throw new Error("useAccessory must be used within an AccessoryProvider");
  }
  return context;
};
