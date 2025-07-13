import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaSignOutAlt, FaCog, FaHome, FaLeaf, FaUsers, FaCrown } from 'react-icons/fa';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');
  const userRoleName = localStorage.getItem('userRoleName');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleName');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const isAdmin = userRole === '1' || userRole === '2' || userRole === '3';

  return (
      <Navbar expand="lg" className="bg-white shadow-sm border-bottom custom-navbar" sticky="top">
        <Container>
          <Navbar.Brand
              href={isAdmin ? "/" : "/home"}
              className="fw-bold text-primary d-flex align-items-center"
              style={{ fontSize: '1.5rem' }}
          >
            <FaLeaf className="me-2" />
            Orchid Garden
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto align-items-center">
              {isAdmin ? (
                  <>
                    <Nav.Link
                        href="/"
                        className={`d-flex align-items-center ${isActive('/') ? 'text-primary fw-semibold' : 'text-dark'}`}
                    >
                      <FaLeaf className="me-1" />
                      Manage Orchids
                    </Nav.Link>
                    <Nav.Link
                        href="/orchids"
                        className={`d-flex align-items-center ${isActive('/orchids') ? 'text-primary fw-semibold' : 'text-dark'}`}
                    >
                      <FaUsers className="me-1" />
                      Employees
                    </Nav.Link>
                    <Nav.Link
                        href="/admin-orders"
                        className={`d-flex align-items-center ${isActive('/admin-orders') ? 'text-primary fw-semibold' : 'text-dark'}`}
                    >
                      <FaCog className="me-1" />
                      Manage Orders
                    </Nav.Link>
                  </>
              ) : (
                  <>
                    <Nav.Link
                        href="/home"
                        className={`d-flex align-items-center ${isActive('/home') ? 'text-primary fw-semibold' : 'text-dark'}`}
                    >
                      <FaHome className="me-1" />
                      Home
                    </Nav.Link>
                    <Nav.Link
                        href="/"
                        className={`d-flex align-items-center ${isActive('/') ? 'text-primary fw-semibold' : 'text-dark'}`}
                    >
                      <FaLeaf className="me-1" />
                      View Orchids
                    </Nav.Link>
                    <Nav.Link
                        href="/user-orders"
                        className={`d-flex align-items-center ${isActive('/user-orders') ? 'text-primary fw-semibold' : 'text-dark'}`}
                    >
                      <FaCog className="me-1" />
                      Orders
                    </Nav.Link>
                  </>
              )}
            </Nav>

            <Nav className="ms-auto align-items-center">
              <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                  {isAdmin ? (
                      <FaCrown className="me-1 text-warning" title="Admin" />
                  ) : (
                      <FaUser className="me-1 text-secondary" title="User" />
                  )}
                      {username || 'User'}
                </span>
                  }
                  id="basic-nav-dropdown"
                  className="text-dark"
              >
                <NavDropdown.Item href={isAdmin ? "/" : "/home"} className="d-flex align-items-center">
                  <FaUser className="me-2" />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item className="d-flex align-items-center text-muted" disabled>
                  <FaCog className="me-2" />
                  Role: {userRoleName || 'User'}
                </NavDropdown.Item>
                <NavDropdown.Item href="#settings" className="d-flex align-items-center">
                  <FaCog className="me-2" />
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                    onClick={handleLogout}
                    className="d-flex align-items-center text-danger"
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default NavBar;
