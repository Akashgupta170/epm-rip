import React, { useEffect, useState } from "react";
import { useAccessory } from "../../../context/AccessoryContext";
import {
  IconEditButton,
  IconDeleteButton,
  IconSaveButton,
  IconCancelTaskButton,
  ClearButton,
} from "../../../AllButtons/AllButtons";
import { SectionHeader } from "../../../components/SectionHeader";
import { Accessories } from "./Accessories";
import { useAlert } from "../../../context/AlertContext";
import { BarChart, Search, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAssignAccessory } from "../../../context/AssignAccessoryContext";
// import { Alert } from "@material-tailwind/react";

export const Accessorytable = () => {
  const { accessories, deleteAccessory, fetchAccessories, updateAccessory } = useAccessory();
  const { fetchAccessoryAssign } = useAssignAccessory();
  const { id } = useParams();
  const { alert, setAlert } = useAlert();

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [editAccessoryId, setEditAccessoryId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    brand_name: "",
    vendor_name: "",
    purchase_date: "",
    purchase_amount: "",
    // images: [],
    condition: "good",
    warranty_months: "",
    stock_quantity: "",
    notes: "",
  });
 

  // Fetch all accessories and assigned accessories
  useEffect(() => {
    if (id) fetchAccessories(id);
  }, [id]);

  useEffect(() => {
    fetchAccessoryAssign();
  }, []);

  // Filter accessories based on search and selected brand
  useEffect(() => {
    if (accessories) {
      setFilteredAccessories(
        accessories.filter(
          (accessory) =>
            (selectedBrand ? accessory.brand_name === selectedBrand : true) &&
            (searchQuery
              ? accessory.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                accessory.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                accessory.purchase_date.toLowerCase().includes(searchQuery.toLowerCase())
              : true)
        )
      );
    }
  }, [accessories, selectedBrand, searchQuery]);

  // Initialize edit form data when the edit mode is triggered
  useEffect(() => {
    if (editAccessoryId) {
      const accessoryToEdit = accessories.find((accessory) => accessory.id === editAccessoryId);
      if (accessoryToEdit) {
        setEditFormData({
          brand_name: accessoryToEdit.brand_name,
          vendor_name: accessoryToEdit.vendor_name,
          condition: accessoryToEdit.condition,
          purchase_date: accessoryToEdit.purchase_date,
          stock_quantity: accessoryToEdit.stock_quantity,
          warranty_months: accessoryToEdit.warranty_months,
          category_id: accessoryToEdit.category_id,
          amount: accessoryToEdit.amount,
          note: accessoryToEdit.note,
        });
      }
    }
  }, [editAccessoryId, accessories]);

  const handleSaveClick = async () => {
    // Form validation
    if (
      !editFormData.brand_name ||
      !editFormData.category_id ||
      !editFormData.vendor_name ||
      !editFormData.condition ||
      !editFormData.purchase_date ||
      !editFormData.amount ||
      !editFormData.warranty ||
      !editFormData.stock_quantity ||
      !editFormData.note
    )
    console.log(editFormData);
    await updateAccessory(editAccessoryId, editFormData, editFormData.category_id);
    setEditAccessoryId(null); // Exit edit mode
   
  };

  const handleDeleteClick = async (id) => {
    await deleteAccessory(id);
    setAlert({
      show: true,
      variant: "success",
      title: "Success",
      message: "Accessory deleted successfully!",
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredAccessories(accessories);
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-lg h-screen overflow-y-auto">
      <SectionHeader icon={BarChart} title="Accessories" subtitle="Manage accessory details" />
      <div className="p-4">

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white z-10 shadow-md">
          <Accessories />
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 border p-2 rounded-lg shadow-md bg-white">
            <div className="flex items-center w-full border border-gray-300 px-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <Search className="h-5 w-8 text-gray-400 mr-[5px]" />
              <input
                type="text"
                className="min-w-[300px] rounded-lg focus:outline-none py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search by Brand, Vendor or Purchase Date`}
              />
            </div>
            <ClearButton onClick={handleClearSearch} />
            <button className="add-items-btn">
              <UserPlus /> Assign
            </button>
          </div>
        </div>

        {/* Brand Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 p-4 border-b">
          {accessories.map((accessory) => (
            <button
              key={accessory.id}
              onClick={() => setSelectedBrand(accessory.brand_name)}
              className={
                selectedBrand === accessory.brand_name
                  ? "px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white"
                  : "px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-gray-200 text-gray-600 hover:bg-gray-300"
              }
            >
              {accessory.brand_name}
            </button>
          ))}
        </div>

        <div className="w-full h-screen overflow-auto mt-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="table-bg-heading table-th-tr-row">
                <th className="px-4 py-2 text-center">Brand Name</th>
                <th className="px-4 py-2 text-center">Vendor Name</th>
                <th className="px-4 py-2 text-center">Condition</th>
                <th className="px-4 py-2 text-center">Purchase Date</th>
                <th className="px-4 py-2 text-center">Warranty (Month)</th>
                <th className="px-4 py-2 text-center">Stock</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccessories.length > 0 ? (
                filteredAccessories.map((accessory) => (
                  <tr key={accessory.id} className="border">
                    <td className="px-6 py-4 text-center">
                      {editAccessoryId === accessory.id ? (
                        <input
                          type="text"
                          value={editFormData.brand_name}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, brand_name: e.target.value })
                          }
                          className="border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        accessory.brand_name
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editAccessoryId === accessory.id ? (
                        <input
                          type="text"
                          value={editFormData.vendor_name}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, vendor_name: e.target.value })
                          }
                          className="border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        accessory.vendor_name
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editAccessoryId === accessory.id ? (
                        <input
                          type="text"
                          value={editFormData.condition}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, condition: e.target.value })
                          }
                          className="border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        accessory.condition
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editAccessoryId === accessory.id ? (
                        <input
                          type="date"
                          value={editFormData.purchase_date}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, purchase_date: e.target.value })
                          }
                          className="border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        accessory.purchase_date
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editAccessoryId === accessory.id ? (
                        <input
                          type="text"
                          value={editFormData.warranty_months}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, warranty_months: e.target.value })
                          }
                          className="border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        accessory.warranty_months + ' month'
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editAccessoryId === accessory.id ? (
                        <input
                          type="number"
                          value={editFormData.stock_quantity}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, stock_quantity: e.target.value })
                          }
                          className="border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        accessory.stock_quantity
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {editAccessoryId === accessory.id ? (
                          <>
                            <IconSaveButton onClick={handleSaveClick} />
                            <IconCancelTaskButton onClick={() => setEditAccessoryId(null)} />
                          </>
                        ) : (
                          <>
                            <IconEditButton onClick={() => setEditAccessoryId(accessory.id)} />
                            <IconDeleteButton onClick={() => handleDeleteClick(accessory.id)} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">No matching accessories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
