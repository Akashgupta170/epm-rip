import React, { useState } from "react";
import { useTeams } from "../../../context/BDTeamContext";
import { Loader2, Users, Mail, Phone, Building2,BarChart } from "lucide-react";
import { SectionHeader } from '../../../components/SectionHeader';



const TeamSection = ({ team }) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200/80">
      <div className="px-8 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200/80">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Building2 className="w-5 h-5 mr-3 text-blue-600" />
          {team.name}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-8 py-5 font-semibold text-gray-700 text-left text-sm tracking-wide uppercase">
                User Name
              </th>
              <th className="px-8 py-5 font-semibold text-gray-700 text-left text-sm tracking-wide uppercase">
                User Email
              </th>
              <th className="px-8 py-5 font-semibold text-gray-700 text-left text-sm tracking-wide uppercase">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {team.users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50/50 transition-colors duration-200 group"
              >
                <td className="px-8 py-5">
                  <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors flex items-center">
                    <Users className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                    {user.name}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="text-gray-600 text-sm flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                    {user.email}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="text-gray-600 text-sm flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                    {user.phone || "N/A"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const BDTeam = () => {
  const { teams, loading } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
      <SectionHeader icon={BarChart} title="Team Management" subtitle="Overview of Teams and Their Members" />
      <div className="p-8">
        {/* Team Selection Buttons */}
        <div className="flex space-x-3 mb-6">
          {teams.map((team) => (
            <button
              key={team.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTeam?.id === team.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedTeam(team)}
            >
              {team.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="flex items-center justify-center space-x-3 bg-white rounded-xl shadow-sm py-6 px-8 inline-block">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-700 font-medium">Loading teams...</span>
            </div>
          </div>
        ) : selectedTeam ? (
          <TeamSection team={selectedTeam} />
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-600 font-medium">Select a team to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BDTeam;
