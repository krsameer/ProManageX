import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/projects" className="flex items-center gap-2">
              <motion.img whileHover={{ scale: 1.05 }} src="/logo.jpeg" alt="ProManageX Logo" className="h-10 w-auto" />
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-primary-600">ProManageX</motion.span>
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                to="/projects"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Projects
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              {user?.role === 'admin' && (
                <span className="badge badge-high text-xs">Admin</span>
              )}
            </div>
            <motion.button
              onClick={() => { handleLogout(); toast('Logged out'); }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut />
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
