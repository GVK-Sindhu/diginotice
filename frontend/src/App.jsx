import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateNotice from './pages/CreateNotice';
import ManageNotices from './pages/ManageNotices';
import DriveAnalytics from './pages/DriveAnalytics';
import EditNotice from './pages/EditNotice';
import Contact from './pages/Contact';
import Notices from './pages/Notices';
import NoticeDetail from './pages/NoticeDetail';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="notices" element={<Notices />} />
            <Route path="notices/:id" element={<NoticeDetail />} />

            <Route path="create-notice" element={
              <ProtectedRoute adminOnly>
                <CreateNotice />
              </ProtectedRoute>
            } />

            <Route path="manage-notices" element={
              <ProtectedRoute adminOnly>
                <ManageNotices />
              </ProtectedRoute>
            } />

            <Route path="edit-notice/:id" element={
              <ProtectedRoute adminOnly>
                <EditNotice />
              </ProtectedRoute>
            } />

            <Route path="contact" element={<Contact />} />

            <Route path="drive-analytics" element={
              <ProtectedRoute adminOnly>
                <DriveAnalytics />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;
