import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { API_URL } from '../../../utils/ApiConfig';

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

const EmployeeDetail = () => {
  const { id } = useParams();
  const userToken = localStorage.getItem('userToken');

  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [doughnutChartData, setDoughnutChartData] = useState(null);

  useEffect(() => {
    const computeDoughnutChartData = (projects) => {
      const activityTypeTotals = {};

      projects.forEach(project => {
        project.activities.forEach(activity => {
          const [h, m] = activity.total_hours.split(":").map(Number);
          const hours = h + m / 60;
          const type = activity.activity_type;

          activityTypeTotals[type] = (activityTypeTotals[type] || 0) + hours;
        });
      });

      const labels = Object.keys(activityTypeTotals);
      const values = Object.values(activityTypeTotals);

      setDoughnutChartData({
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800'],
          },
        ],
      });
    };

    if (projects.length > 0) computeDoughnutChartData(projects);
  }, [projects]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!userToken) return;

      try {
        const response = await axios.get(
          `${API_URL}/api/getfull_proileemployee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setEmployee(response.data.data.user);
        setProjects(response.data.data.project_user);
        prepareBarChartData(response.data.data.project_user);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [id, userToken]);

  const prepareBarChartData = (projects) => {
    let totalBillable = 0;
    let totalNonBillable = 0;

    projects.forEach(project => {
      project.activities.forEach(activity => {
        const [hours, mins] = activity.total_hours.split(':').map(Number);
        const activityHours = hours + mins / 60;

        if (activity.activity_type === "Billable") {
          totalBillable += activityHours;
        } else if (activity.activity_type === "Non-Billable") {
          totalNonBillable += activityHours;
        }
      });
    });

    setBarChartData({
      labels: ['Billable', 'Non-Billable'],
      datasets: [
        {
          label: 'Hours',
          data: [totalBillable, totalNonBillable],
          backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }
      ]
    });
  };

  const handleProjectChange = (e) => {
    const selectedName = e.target.value;
    setSelectedProject(selectedName);

    const selected = projects.find(p => (p.project_name || 'Unnamed Project') === selectedName);
    if (!selected) return setPieChartData({});

    const types = ['Billable', 'Non-Billable', 'In-House', 'Learning (R&D)', 'No Work'];
    const data = types.map(type => {
      const act = selected.activities.find(a => a.activity_type?.toLowerCase() === type.toLowerCase());
      return act ? parseFloat(act.total_hours.split(":")[0]) + parseFloat(act.total_hours.split(":")[1]) / 60 : 0;
    });

    setPieChartData({
      labels: types,
      datasets: [{
        data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#FF5722'],
        hoverOffset: 10
      }]
    });
  };

  if (!employee) return <div className="text-center py-20 text-xl text-gray-600">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-10 bg-gray-50 min-h-screen">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Employee Details</h2>
  
    {/* Profile Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col items-center">
        <img
  src={employee.profile_pic_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} // example online icon
  alt="Profile"
          className="w-36 h-36 rounded-full object-cover shadow-lg mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-900">{employee.name}</h2>
        <p className="text-sm text-gray-600">{employee.email}</p>
      </div>
  
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><span className="font-semibold">Designation:</span> {employee.roles}</p>
        <p><span className="font-semibold">Phone:</span> {employee.phone_num}</p>
        <p><span className="font-semibold">Emergency Phone:</span> {employee.emergency_phone_num}</p>
        <p><span className="font-semibold">Team:</span> {employee.team}</p>
        <p><span className="font-semibold">Address:</span> {employee.address}</p>
      </div>
    </div>
  
    {/* Charts Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Hours</h3>
        <Bar data={barChartData} />
      </div>
  
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Types (All Projects)</h3>
        {doughnutChartData && <Doughnut data={doughnutChartData} />}
      </div>
    </div>
  
    {/* Pie Chart Per Project */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Specific Activity</h3>
  
      <div className="flex flex-col md:flex-row items-center gap-4">
        <select
          value={selectedProject}
          onChange={handleProjectChange}
          className="w-full md:w-1/2 p-2 border rounded-lg"
        >
          <option value="" disabled>Select a project</option>
          {projects.map((project, index) => (
            <option key={index} value={project.project_name || 'Unnamed Project'}>
              {project.project_name || 'Unnamed Project'}
            </option>
          ))}
        </select>
  
        {pieChartData?.datasets?.length > 0 && (
          <div className="w-full md:w-1/2">
            <Pie data={pieChartData} />
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default EmployeeDetail;
