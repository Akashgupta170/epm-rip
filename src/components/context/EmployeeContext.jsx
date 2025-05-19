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
  useEffect(() => {
    fetchEmployees();
  }, []);
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
  const token = localStorage.getItem("userToken");

  const formData = new FormData();
  formData.append("name", updatedData.name);
  formData.append("email", updatedData.email);
  formData.append("phone_num", updatedData.phone_num || "");
  formData.append("emergency_phone_num", updatedData.emergency_phone_num || "");
  formData.append("address", updatedData.address || "");
  formData.append("team_id", updatedData.team_id || "");
  formData.append("role_id", updatedData.role_id || "");
  formData.append('_method', 'PUT');

  if (updatedData.profile_pic instanceof File) {
    formData.append("profile_pic", updatedData.profile_pic);
  }

  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update employee");
  }

  fetchEmployees();
  showAlert({ variant: "success", title: "Success", message: "Employee updated successfully" });
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
