import { useState, useEffect } from 'react';
import { projectAPI, authAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiUserPlus, FiX } from 'react-icons/fi';

const ProjectSettings = ({ project, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    status: project.status
  });
  const [allUsers, setAllUsers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setAllUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.updateProject(project._id, formData);
      onUpdate();
      alert('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectAPI.deleteProject(project._id);
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await projectAPI.addMember(project._id, {
        userId: selectedUser,
        role: selectedRole
      });
      setShowAddMember(false);
      setSelectedUser('');
      setSelectedRole('member');
      onUpdate();
    } catch (error) {
      console.error('Error adding member:', error);
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await projectAPI.removeMember(project._id, userId);
        onUpdate();
      } catch (error) {
        console.error('Error removing member:', error);
        alert(error.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const availableUsers = allUsers.filter(
    user => !project.members.some(m => m.user._id === user._id)
  );

  return (
    <div className="space-y-6">
      {/* Project Details */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Project Details</h2>
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Update Project
          </button>
        </form>
      </div>

      {/* Team Members */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <button
            onClick={() => setShowAddMember(true)}
            className="btn btn-primary btn-sm flex items-center gap-2"
          >
            <FiUserPlus />
            Add Member
          </button>
        </div>

        <div className="space-y-2">
          {project.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{member.user.name}</p>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${
                  member.role === 'admin' ? 'badge-high' : 'badge-low'
                }`}>
                  {member.role}
                </span>
                {member.user._id !== project.owner._id && (
                  <button
                    onClick={() => handleRemoveMember(member.user._id)}
                    className="p-1 hover:bg-red-50 rounded"
                    title="Remove member"
                  >
                    <FiTrash2 className="text-red-600" size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete a project, there is no going back. Please be certain.
        </p>
        <button onClick={handleDeleteProject} className="btn btn-danger">
          Delete Project
        </button>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Team Member</h2>
              <button onClick={() => setShowAddMember(false)}>
                <FiX size={24} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Choose a user...</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="input"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings;
