import React from 'react';
import { CheckCircle } from 'lucide-react';

const MembersCard = ({ members }) => {
    if (!members || members.length === 0) return null;

    return (
        <div id="membersCard" className="lumine-card p-0 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-sand flex justify-between items-center">
                <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wide">
                    Group Members
                </h3>
                <span className="text-xs font-bold text-orange-600" id="totalMembers">
                    {members.length} Person(s)
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-gray-400 font-medium text-xs uppercase border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Age</th>
                            <th className="px-6 py-4">Aadhaar</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody id="membersTableBody" className="divide-y divide-gray-50">
                        {members.map((member, index) => (
                            <tr key={index} className="bg-white border-b border-gray-50">
                                <td className="px-6 py-4 font-medium text-navy-900">
                                    {member.name}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{member.age}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                    {member.aadhaar_mask}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">
                                        Verified <CheckCircle className="w-3 h-3" />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembersCard;

