import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAccessory } from "../../../context/AccessoryContext";
import { X } from "lucide-react";
import { SubmitButton } from "../../../AllButtons/AllButtons";

export const Accessories = () => {
  const { id } = useParams();
  const { addAccessory, loading } = useAccessory();

  const [formData, setFormData] = useState({
    brand_name: "",
    category_id: id || "",
    vendor_name: "",
    condition: "",
    purchase_date: "",
    amount: "",
    images: [],
    note: "",
    status: "available",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      brand_name,
      category_id,
      vendor_name,
      condition,
      purchase_date,
      amount,
    } = formData;

    if (brand_name && category_id && vendor_name && condition && purchase_date && amount) {
      await addAccessory(formData);

      // Reset form
      setFormData({
        brand_name: "",
        category_id,
        vendor_name: "",
        condition: "",
        purchase_date: "",
        amount: "",
        images: [],
        note: "",
        status: "available",
      });

      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white">
      <button onClick={() => setIsModalOpen(true)} className="add-items-btn">
        Add Accessory
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800">Add Accessory</h2>
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-4">
              <input type="hidden" value={formData.category_id} />

              <div>
                <label>Brand Name</label>
                <input
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Brand name"
                />
              </div>

              <div>
                <label>Vendor Name</label>
                <input
                  type="text"
                  value={formData.vendor_name}
                  onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="vendor name"
                />
              </div>

              <div>
                <label>Condition</label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="condition"
                />
              </div>

              <div>
                <label>Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Purchase date"
                />
              </div>

              <div>
                <label>Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Amount"
                />
              </div>

              <div>
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="available">Available</option>
                  <option value="in_use">In Use</option>
                  <option value="damaged">Damaged</option>
                  <option value="under_repair">Under Repair</option>
                </select>
              </div>

              <div className="col-span-2">
                <label>Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setFormData({ ...formData, images: Array.from(e.target.files) })
                  }
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-2">
                <label>Note</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="write note"
                />
              </div>

              <div className="col-span-2">
                <SubmitButton disabled={loading} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
