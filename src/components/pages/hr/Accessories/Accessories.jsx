import React, { useState } from 'react';
import { Eye, EyeOff, Search, BarChart, Plus } from 'lucide-react';
import { SectionHeader } from "../../../components/SectionHeader";
const initialData = [
  {
    id: 1,
    name: 'John Doe',
    setup: 'laptop',
    condition: 'Good',
    note: 'New employee',
    issueDate: '2025-04-01',
    accessories: {
      Laptop: { model: 'Dell XPS 13', condition: 'Good', issueDate: '2025-04-01', note: 'Primary device' },
      Mouse: { model: 'Logitech M235', condition: 'Good', issueDate: '2025-04-02', note: '' },
      Keyboard: { model: 'Logitech K120', condition: 'Good', issueDate: '2025-04-02', note: '' },
    },
  },
  {
    id: 2,
    name: 'Jane Smith',
    setup: 'pc',
    condition: 'Used',
    note: 'Transferred from IT dept',
    issueDate: '2025-03-15',
    accessories: {
      PC: { model: 'HP EliteDesk', condition: 'Used', issueDate: '2025-03-15', note: '' },
      Monitor: { model: 'Samsung 24"', condition: 'Good', issueDate: '2025-03-16', note: '' },
      Mouse: { model: 'Dell Mouse', condition: 'Good', issueDate: '2025-03-16', note: '' },
      Keyboard: { model: 'Dell KB216', condition: 'Good', issueDate: '2025-03-16', note: '' },
    },
  },
];
export default function EmployeeAccessoriesTable() {
  const [employees, setEmployees] = useState(initialData);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [filters, setFilters] = useState({ name: '', setup: '', date: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccessory, setNewAccessory] = useState({
    employeeId: '',
    name: '',
    model: '',
    condition: '',
    issueDate: '',
    note: '',
  });
  const toggleView = (id) => {
    setExpandedUserId(prev => (prev === id ? null : id));
  };
  const handleFieldChange = (empId, accessoryName, field, value) => {
    const updated = employees.map(emp => {
      if (emp.id === empId) {
        const updatedAccessories = {
          ...emp.accessories,
          [accessoryName]: {
            ...emp.accessories[accessoryName],
            [field]: value,
          },
        };
        return { ...emp, accessories: updatedAccessories };
      }
      return emp;
    });
    setEmployees(updated);
  };
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value.toLowerCase() }));
  };
  const filteredEmployees = employees.filter(emp => {
    return (
      emp.name.toLowerCase().includes(filters.name) &&
      emp.setup.toLowerCase().includes(filters.setup) &&
      emp.issueDate.includes(filters.date)
    );
  });
  const handleAssignAccessory = () => {
    const updated = employees.map(emp => {
      if (emp.id === parseInt(newAccessory.employeeId)) {
        return {
          ...emp,
          accessories: {
            ...emp.accessories,
            [newAccessory.name]: {
              model: newAccessory.model,
              condition: newAccessory.condition,
              issueDate: newAccessory.issueDate,
              note: newAccessory.note,
            },
          },
        };
      }
      return emp;
    });
    setEmployees(updated);
    setIsModalOpen(false);
    setNewAccessory({ employeeId: '', name: '', model: '', condition: '', issueDate: '', note: '' });
  };
  return (
    <div className="max-full mx-auto  bg-white shadow rounded-2xl">
      {/* <h2 className="text-3xl font-semibold mb-6 text-gray-800">Employee Accessories Management</h2> */}
      <SectionHeader icon={BarChart} title="Employee Accessories Management" subtitle="View, edit and manage accessories" />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Assign Accessories</h3>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={newAccessory.employeeId}
              onChange={e => setNewAccessory({ ...newAccessory, employeeId: e.target.value })}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Accessory Name"
              value={newAccessory.name}
              onChange={e => setNewAccessory({ ...newAccessory, name: e.target.value })}
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Model"
              value={newAccessory.model}
              onChange={e => setNewAccessory({ ...newAccessory, model: e.target.value })}
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Condition"
              value={newAccessory.condition}
              onChange={e => setNewAccessory({ ...newAccessory, condition: e.target.value })}
            />
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={newAccessory.issueDate}
              onChange={e => setNewAccessory({ ...newAccessory, issueDate: e.target.value })}
            />
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Note"
              value={newAccessory.note}
              onChange={e => setNewAccessory({ ...newAccessory, note: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleAssignAccessory}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sticky top-0 bg-white z-10 shadow-md">
        <div>
            <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
          >
              <Plus size={16} />
              Assign Accessories
            </button>
          </div>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 border p-2 rounded-lg shadow-md bg-white">
          <div className="flex items-center w-full border border-gray-300 px-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="h-5 w-5 text-gray-400 mr-[5px]" />
            <input
              type="text"
              placeholder="Search by Name"
              className="w-full rounded-lg focus:outline-none py-2"
              onChange={e => handleFilterChange('name', e.target.value)}
            />
          </div>

          <div className="flex items-center w-full border border-gray-300 px-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="h-5 w-5 text-gray-400 mr-[5px]" />
            <input
              type="text"
              placeholder="Search by Setup (laptop/pc)"
              className="w-full rounded-lg focus:outline-none py-2"
              onChange={e => handleFilterChange('setup', e.target.value)}
            />
          </div>
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-md shadow-sm"
            onChange={e => handleFilterChange('date', e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto rounded-lg">
          <thead className="">
            <tr className="table-th-tr-row table-bg-heading">
              <th className="px-4 py-2 text-center">Name</th>
              <th className="px-4 py-2 text-center">Setup</th>
              <th className="px-4 py-2 text-center">Issue Date</th>
              <th className="px-4 py-2 text-center">Condition</th>
              <th className="px-4 py-2 text-center">Note</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEmployees.map((emp) => (
              <React.Fragment key={emp.id}>
                <tr className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out">
                  <td className="px-6 py-4 text-center text-gray-700">{emp.name}</td>
                  <td className="px-6 py-4 text-center text-gray-700">{emp.setup === 'laptop' ? 'Laptop' : 'PC + Monitor'}</td>
                  <td className="px-6 py-4 text-center text-gray-700">{emp.issueDate}</td>
                  <td className="px-6 py-4 text-center text-gray-700">{emp.condition}</td>
                  <td className="px-6 py-4 text-center text-gray-700">{emp.note}</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    <button onClick={() => toggleView(emp.id)} className="text-blue-600 hover:text-blue-800">
                      {expandedUserId === emp.id ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </td>
                </tr>
                {expandedUserId === emp.id && (
                  <tr>
                    <td colSpan="6" className="p-2 border bg-gray-50">
                      <table className="w-full text-sm border">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-2 border">Accessory</th>
                            <th className="p-2 border">Model</th>
                            <th className="p-2 border">Condition</th>
                            <th className="p-2 border">Issue Date</th>
                            <th className="p-2 border">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(emp.accessories).map((accessory, idx) => (
                            <tr key={idx} className="hover:bg-white">
                              <td className="p-2 border font-medium">{accessory}</td>
                              <td className="p-2 border">
                                <input
                                  type="text"
                                  className="border px-2 py-1 w-full rounded"
                                  value={emp.accessories[accessory].model}
                                  onChange={e => handleFieldChange(emp.id, accessory, 'model', e.target.value)}
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="text"
                                  className="border px-2 py-1 w-full rounded"
                                  value={emp.accessories[accessory].condition}
                                  onChange={e => handleFieldChange(emp.id, accessory, 'condition', e.target.value)}
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="date"
                                  className="border px-2 py-1 w-full rounded"
                                  value={emp.accessories[accessory].issueDate}
                                  onChange={e => handleFieldChange(emp.id, accessory, 'issueDate', e.target.value)}
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="text"
                                  className="border px-2 py-1 w-full rounded"
                                  value={emp.accessories[accessory].note}
                                  onChange={e => handleFieldChange(emp.id, accessory, 'note', e.target.value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}