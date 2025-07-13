import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router'
import ListOfOrchids from './orchid/ListOfOrchids.jsx';
import EditOrchid from './orchid/EditOrchid.jsx';
import HomeScreen from './components/HomeScreen';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ListOfEmployees from './components/ListOfEmployees';
import DetailOrchid from './orchid/DetailOrchid.jsx';
import LoginPage from './components/Auth/LoginPage.jsx';
import RegisterPage from './components/Auth/RegisterPage.jsx';
import { isAuthenticated, validateTokenData, isAdminUser } from './utils/authUtils';
import UserOrders from './components/Order/UserOrders.jsx';
import AdminOrders from './components/Order/AdminOrders.jsx';
import { AuthProvider, useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  validateTokenData();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleBasedRoute = ({ adminComponent, userComponent }) => {
  validateTokenData();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return isAdminUser() ? adminComponent : userComponent;
};

function AppContent() {
  const { auth } = useAuth();

  return (
      <div className="d-flex flex-column min-vh-100">
        {auth && <NavBar />}
        <main className="flex-grow-1">
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route path='/' element={
              <RoleBasedRoute
                  adminComponent={<ListOfOrchids />}
                  userComponent={<HomeScreen />}
              />
            } />

            <Route path='/home' element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            } />

            <Route path='/orchids' element={
              <ProtectedRoute>
                <ListOfEmployees />
              </ProtectedRoute>
            } />
            <Route path='/detail/:id' element={
              <ProtectedRoute>
                <DetailOrchid />
              </ProtectedRoute>
            } />
            <Route path='/edit/:id' element={
              <ProtectedRoute>
                <EditOrchid />
              </ProtectedRoute>
            } />
            <Route path='/user-orders' element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            } />
            <Route path='/admin-orders' element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        {auth && <Footer />}
      </div>
  );
}

function App() {
  return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
  );
}

export default App;
