import React, { useEffect, useState } from "react";
import { useAccessory } from "../../../context/AccessoryContext"; // Use only the AccessoryContext now
import {
  IconEditButton,
  IconDeleteButton,
  IconSaveButton,
  IconCancelTaskButton,
} from "../../../AllButtons/AllButtons";
import { SectionHeader } from "../../../components/SectionHeader";
import { Accessories } from "./Accessories";
import { Alert } from "@material-tailwind/react";
import { BarChart, Loader2 } from "lucide-react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useCategory } from "../../../context/CategoryContext";

export const Accessorytable = () => {
  const {
    accessories,
    deleteAccessory,
    fetchAccessories,
    updateAccessory,
  } = useAccessory();
  const { categories } = useCategory();
  const { id } = useParams();

    useEffect(() => {
      if (id) fetchAccessories(id);
    }, [id]);

  const [editAccessoryId, setEditAccessoryId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    variant: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (editAccessoryId) {
      const accessory = accessories.find((item) => item.id === editAccessoryId);
      setEditFormData({ ...accessory });
    }
  }, [editAccessoryId, accessories]);

  const handleSaveClick = async () => {
    if (
      !editFormData.name ||
      !editFormData.category_id ||
      !editFormData.vendor_name ||
      !editFormData.condition ||
      !editFormData.purchase_date ||
      !editFormData.amount ||
      !editFormData.status
    )
      return;

    await updateAccessory(editAccessoryId, editFormData, editFormData.category_id);
    setEditAccessoryId(null);
  };

  const handleDeleteClick = async (id) => {
    await deleteAccessory(id);
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-lg h-screen overflow-y-auto">
      <SectionHeader
        icon={BarChart}
        title="Accessories"
        subtitle="Manage accessory details"
      />
      <div className="p-4">
        {alert.show && (
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white z-10 shadow-md">
          <Accessories />
        </div>

       <div className="w-full overflow-auto mt-4">
       <table className="min-w-full table-auto">
          <thead>
            <tr className="table-bg-heading table-th-tr-row">
              <th className="px-4 py-2 text-center">Accessory No</th>
              <th className="px-4 py-2 text-center">Brand Name</th>
              <th className="px-4 py-2 text-center">Category</th>
              <th className="px-4 py-2 text-center">Vendor Name</th>
              <th className="px-4 py-2 text-center">Condition</th>
              <th className="px-4 py-2 text-center">Purchase Date</th>
              <th className="px-4 py-2 text-center">Amount</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accessories.length > 0 ? (
              accessories.map((accessory) => (
                <tr key={accessory.id} className="border">
                  <td className="px-6 py-4 text-center">{accessory.accessory_no}</td>
                  <td className="px-6 py-4 text-center">
                    {editAccessoryId === accessory.id ? (
                      <input
                        type="text"
                        value={editFormData.brand_name}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, name: e.target.value })
                        }
                        className="border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      accessory.brand_name
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {categories.find((cat) => cat.id === accessory.category_id)?.name || accessory.category.name}
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
                          setEditFormData({
                            ...editFormData,
                            purchase_date: e.target.value,
                          })
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
                        type="number"
                        value={editFormData.amount}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, amount: e.target.value })
                        }
                        className="border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      accessory.amount
                    )}
                  </td>
                  <td className="px-6 py-4 text-center min-w-[180px]">
                    {editAccessoryId === accessory.id ? (
                      <Select
                        options={[
                          { value: "available", label: "available" },
                          { value: "in_use", label: "in use" },
                          { value: "damaged", label: "damaged" },
                          { value: "under_repair", label: "under repair" },
                        ]}
                        value={{
                          value: editFormData.status,
                          label:
                            {
                              available: "available",
                              in_use: "in use",
                              damaged: "damaged",
                              under_repair: "under repair",
                            }[editFormData.status] || editFormData.status,
                        }}
                        onChange={(selected) =>
                          setEditFormData({ ...editFormData, status: selected.value })
                        }
                      />
                    ) : (
                      {
                        available: "available",
                        in_use: "in use",
                        damaged: "damaged",
                        under_repair: "under repair",
                      }[accessory.status] || accessory.status
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
                          <IconDeleteButton
                            onClick={() => handleDeleteClick(accessory.id)}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-8 text-center">
                  No Accessories Found
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
