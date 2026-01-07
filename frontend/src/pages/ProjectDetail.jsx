import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, issueAPI, analyticsAPI } from '../utils/api';
import { FiSettings, FiUsers, FiBarChart2, FiGrid } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import ProjectSettings from '../components/ProjectSettings';
import Analytics from '../components/Analytics';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('board');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, issuesRes, analyticsRes] = await Promise.all([
        projectAPI.getProject(id),
        issueAPI.getIssuesByProject(id),
        analyticsAPI.getProjectAnalytics(id)
      ]);
      
      setProject(projectRes.data.project);
      setIssues(issuesRes.data.issues);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Error fetching project data:', error);
      if (error.response?.status === 404 || error.response?.status === 403) {
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIssuesUpdate = () => {
    fetchProjectData();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <FiUsers className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {project.members?.length || 0} members
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('board')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'board'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiGrid className="inline mr-2" />
              Board
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiBarChart2 className="inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiSettings className="inline mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'board' && (
          <KanbanBoard 
            projectId={id} 
            issues={issues} 
            onUpdate={handleIssuesUpdate}
          />
        )}
        
        {activeTab === 'analytics' && analytics && (
          <Analytics analytics={analytics} />
        )}
        
        {activeTab === 'settings' && (
          <ProjectSettings 
            project={project} 
            onUpdate={fetchProjectData}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
