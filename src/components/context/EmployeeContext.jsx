import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../utils/ApiConfig";
import Alert from "../components/Alerts";
import { useAlert } from "./AlertContext";
const EmployeeContext = createContext(undefined);
export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();
  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("Unauthorized");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      console.log("all employess,",data);
      setEmployees(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const addEmployee = async (employeeData) => {
    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("name", employeeData.name);
      formData.append("email", employeeData.email);
      formData.append("password", employeeData.password);
      formData.append("team_id", employeeData.team_id ? employeeData.team_id : "");
      formData.append("address", employeeData.address);
      formData.append("phone_num", employeeData.phone_num);
      formData.append("emergency_phone_num", employeeData.emergency_phone_num);
      formData.append("role_id", employeeData.role_id ? employeeData.role_id : "");
      formData.append("pm_id", employeeData.pm_id ? employeeData.pm_id : "");
      formData.append("profile_pic", employeeData.profile_pic);
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorResponse = await response.json(); 
        const errorMessage = errorResponse?.errors?.email?.[0] || errorResponse?.message || "Something went wrong";
        showAlert({ variant: "error", title: "Error", message: errorMessage });
        console.log("error", errorMessage);
        throw new Error(errorMessage);
    }
      const newEmployee = await response.json();
      setEmployees((prev) => [...prev, newEmployee.data]);
      showAlert({ variant: "success", title: "Success", message: "Employee added successfully" });
    } catch (err) {
      console.log(err);
      showAlert({ variant: "error", title: "Error", message: err.message });
    }
  };
  const updateEmployee = async (id, updatedData) => {
    console.log("Sending updatedData:", updatedData);
    try {
        const token = localStorage.getItem("userToken");
        const requestBody = {
            name: updatedData.name,
            email: updatedData.email,
            phone_num: updatedData.phone_num,
            emergency_phone_num: updatedData.emergency_phone_num,
            address: updatedData.address,
            team_id: updatedData.team_id,
            profile_pic: updatedData.profile_pic || null, 
            role_id: updatedData.role_id,
        };
        console.log("Final requestBody:", requestBody); 
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        fetchEmployees();
        showAlert({ variant: "success", title: "Success", message: "Employee updated successfully" });
        console.log("Response:", response);
        if (!response.ok) {
          showAlert({ variant: "error", title: "Error", message: "Failed to update employee" });
            throw new Error("Failed to update employee");
        }
    } catch (err) {
        console.error("Error:", err.message);
        showAlert({ variant: "error", title: "Error", message: err.message });
        setError(err.message);
    }
};
const deleteEmployee = async (id) => {
  try {
    const token = localStorage.getItem("userToken");
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete employee");
    }
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    showAlert({ variant: "success", title: "Success", message: "Deleted Successfully" });
  } catch (err) {
    console.error(":x: Error deleting employee:", err);
    showAlert({ variant: "error", title: "Error", message: err.message });
  }
};
  return (
    <EmployeeContext.Provider value={{ employees, loading, error, fetchEmployees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};
export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
