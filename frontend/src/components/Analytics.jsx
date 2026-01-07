import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = ({ analytics }) => {
  const statusData = [
    { name: 'To-Do', value: analytics.issuesByStatus['To-Do'], color: '#9CA3AF' },
    { name: 'In-Progress', value: analytics.issuesByStatus['In-Progress'], color: '#3B82F6' },
    { name: 'Review', value: analytics.issuesByStatus['Review'], color: '#A855F7' },
    { name: 'Done', value: analytics.issuesByStatus['Done'], color: '#10B981' }
  ];

  const priorityData = [
    { name: 'Low', value: analytics.issuesByPriority['Low'], color: '#9CA3AF' },
    { name: 'Medium', value: analytics.issuesByPriority['Medium'], color: '#3B82F6' },
    { name: 'High', value: analytics.issuesByPriority['High'], color: '#F59E0B' },
    { name: 'Critical', value: analytics.issuesByPriority['Critical'], color: '#EF4444' }
  ];

  const memberData = analytics.memberWiseDistribution.map(member => ({
    name: member.user.name.split(' ')[0],
    total: member.count,
    'To-Do': member.byStatus['To-Do'],
    'In-Progress': member.byStatus['In-Progress'],
    'Review': member.byStatus['Review'],
    'Done': member.byStatus['Done']
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Issues</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalIssues}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics.issuesByStatus['Done']}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">
            {analytics.issuesByStatus['In-Progress']}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Completion Rate</h3>
          <p className="text-3xl font-bold text-primary-600">
            {analytics.completionRate}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member Distribution */}
      {memberData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Member-wise Task Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={memberData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="To-Do" stackId="a" fill="#9CA3AF" />
              <Bar dataKey="In-Progress" stackId="a" fill="#3B82F6" />
              <Bar dataKey="Review" stackId="a" fill="#A855F7" />
              <Bar dataKey="Done" stackId="a" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Team Members List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
        <div className="space-y-3">
          {analytics.memberWiseDistribution.map((member) => (
            <div key={member.user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{member.user.name}</p>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{member.count}</p>
                <p className="text-xs text-gray-500">assigned tasks</p>
              </div>
            </div>
          ))}
          {analytics.unassignedCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Unassigned</p>
                <p className="text-sm text-gray-500">No assignee</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{analytics.unassignedCount}</p>
                <p className="text-xs text-gray-500">unassigned tasks</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
