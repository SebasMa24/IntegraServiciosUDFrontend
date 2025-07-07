import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, getRoles, getSub, logout } from "../services/auth";

interface UserInfo {
  sub: string;
  roles: string[];
  primaryRole: string;
}

interface NavLinkProps {
  to: string;
  icon: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children, isActive = false }) => (
  <Link 
    className={`nav-link px-3 py-2 position-relative transition-all ${isActive ? 'active' : ''}`} 
    to={to}
    aria-current={isActive ? 'page' : undefined}
    style={{
      borderRadius: '8px',
      margin: '0 2px',
      transition: 'all 0.3s ease',
      background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      backdropFilter: isActive ? 'blur(10px)' : 'none',
      border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }}
  >
    <i className={`bi ${icon} me-2`} aria-hidden="true"></i>
    {children}
    {isActive && (
      <div 
        className="position-absolute bottom-0 start-50 translate-middle-x"
        style={{
          width: '20px',
          height: '2px',
          background: 'linear-gradient(45deg, #0d6efd, #6610f2)',
          borderRadius: '2px',
        }}
      />
    )}
  </Link>
);

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userInfo: null as UserInfo | null,
  });

  // Función para actualizar el estado de autenticación
  const updateAuthState = useCallback(() => {
    const isAuth = isLoggedIn();
    
    if (isAuth) {
      const roles = getRoles();
      const sub = getSub();
      
      setAuthState({
        isAuthenticated: true,
        userInfo: {
          sub: sub || "Usuario",
          roles: roles || [],
          primaryRole: roles && roles.length > 0 ? roles[0] : "Sin rol"
        }
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        userInfo: null
      });
    }
  }, []);

  // Efecto para actualizar el estado cuando cambia la ubicación
  useEffect(() => {
    updateAuthState();
  }, [location.pathname, updateAuthState]);

  // Efecto inicial para establecer el estado
  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setAuthState({
        isAuthenticated: false,
        userInfo: null
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('userDropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const navigationItems = useMemo(() => [
    { to: "/home", icon: "bi-house-door", label: "Home", isPublic: true },
    { to: "/troyadev", icon: "bi-code-slash", label: "TroyaDev", isPublic: true },
    { to: "/reservations", icon: "bi-calendar-check", label: "Reservations", isPublic: false },
    { to: "/operation", icon: "bi-gear", label: "Operation", isPublic: false }
  ], []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav 
        className="navbar navbar-expand-lg navbar-dark fixed-top shadow-lg" 
        role="navigation"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '64px',
        }}
      >
        <div className="container-fluid">
          {/* Brand */}
          <Link 
            className="navbar-brand d-flex align-items-center fw-bold position-relative" 
            to="/home"
            aria-label="IntegraServiciosUD - Página principal"
            style={{
              fontSize: '1.3rem',
              transition: 'all 0.3s ease',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div 
              className="me-3 d-flex align-items-center justify-content-center"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <img 
                src="https://images.seeklogo.com/logo-png/14/3/universidad-distrital-francisco-jose-de-caldas-logo-png_seeklogo-145737.png?v=1955246906122213448"
                alt="Logo Universidad Distrital Francisco José de Caldas" 
                style={{ 
                  height: '32px',
                  width: '32px',
                  objectFit: 'contain',
                  filter: 'brightness(1.1)',
                }}
                loading="lazy"
              />
            </div>
            <div className="d-flex flex-column">
              <span className="d-none d-sm-inline" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                IntegraServiciosUD
              </span>
              <span className="d-sm-none" style={{ fontSize: '1rem', fontWeight: '600' }}>
                IntegraSUD
              </span>
              <small 
                className="d-none d-md-block text-light opacity-75" 
                style={{ fontSize: '0.7rem', fontWeight: '400', letterSpacing: '0.5px' }}
              >
                Sistema Integrado de Servicios
              </small>
            </div>
          </Link>
          
          {/* Toggler button */}
          <button 
            className="navbar-toggler border-0 position-relative" 
            type="button" 
            onClick={toggleMobileMenu}
            aria-controls="navbarContent"
            aria-expanded={isMobileMenuOpen}
            aria-label="Abrir menú de navegación"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar content */}
          <div 
            className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} 
            id="navbarContent"
          >
            <ul className="navbar-nav ms-auto align-items-center" role="menubar">
              {/* Public navigation items - shown to all users */}
              {navigationItems
                .filter(item => item.isPublic)
                .map((item) => (
                  <li key={item.to} className="nav-item" role="none">
                    <NavLink 
                      to={item.to} 
                      icon={item.icon}
                      isActive={location.pathname === item.to}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}

              {authState.isAuthenticated ? (
                <>
                  {/* Private navigation items - only shown to authenticated users */}
                  {navigationItems
                    .filter(item => !item.isPublic)
                    .map((item) => (
                      <li key={item.to} className="nav-item" role="none">
                        <NavLink 
                          to={item.to} 
                          icon={item.icon}
                          isActive={location.pathname === item.to}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  
                  {/* User Dropdown */}
                  <li className="nav-item dropdown ms-3" role="none">
                    <button
                      className="nav-link dropdown-toggle btn btn-link text-light border-0 px-3 py-2 d-flex align-items-center position-relative"
                      type="button"
                      id="userDropdown"
                      onClick={toggleDropdown}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      aria-label={`Menú de usuario: ${authState.userInfo?.sub}`}
                      style={{
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        minWidth: '180px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div 
                        className="me-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <i className="bi bi-person-fill text-white" style={{ fontSize: '1.1rem' }}></i>
                      </div>
                      <div className="d-flex flex-column align-items-start text-start">
                        <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                          {authState.userInfo?.sub}
                        </span>
                        <small 
                          className="text-light opacity-75" 
                          style={{ fontSize: '0.7rem', fontWeight: '400' }}
                        >
                          {authState.userInfo?.primaryRole}
                        </small>
                      </div>
                    </button>
                    
                    <ul 
                      className={`dropdown-menu dropdown-menu-end shadow-lg ${isDropdownOpen ? 'show' : ''}`}
                      aria-labelledby="userDropdown"
                      role="menu"
                      style={{
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        minWidth: '280px',
                        marginTop: '8px',
                      }}
                    >
                      {/* User Info Header */}
                      <li role="none">
                        <div 
                          className="dropdown-header"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '8px 8px 0 0',
                            margin: '0',
                            padding: '16px',
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div 
                              className="me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              <i className="bi bi-person-fill text-white" style={{ fontSize: '1.5rem' }}></i>
                            </div>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: '1rem' }}>
                                {authState.userInfo?.sub}
                              </div>
                              <small className="text-light opacity-90" style={{ fontSize: '0.8rem' }}>
                                Usuario activo
                              </small>
                            </div>
                          </div>
                        </div>
                      </li>
                      
                      {/* Roles Section */}
                      <li role="none">
                        <div className="dropdown-header" style={{ padding: '12px 16px 8px' }}>
                          <small className="text-muted fw-semibold">
                            <i className="bi bi-shield-check me-2 text-success"></i>
                            Roles asignados
                          </small>
                        </div>
                      </li>
                      
                      {authState.userInfo?.roles.map((role, index) => (
                        <li key={index} role="none">
                          <div 
                            className="dropdown-item-text d-flex align-items-center"
                            style={{ padding: '8px 16px' }}
                          >
                            <div 
                              className="me-2"
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              }}
                            ></div>
                            <small className="fw-medium">{role}</small>
                          </div>
                        </li>
                      ))}
                      
                      {authState.userInfo?.roles.length === 0 && (
                        <li role="none">
                          <div 
                            className="dropdown-item-text text-muted d-flex align-items-center"
                            style={{ padding: '8px 16px' }}
                          >
                            <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                            <small>Sin roles asignados</small>
                          </div>
                        </li>
                      )}
                      
                      <li role="none">
                        <hr className="dropdown-divider" style={{ margin: '8px 0' }} />
                      </li>
                      
                      {/* Logout */}
                      <li role="none" style={{ padding: '8px' }}>
                        <button
                          className="dropdown-item text-danger d-flex align-items-center"
                          onClick={handleLogout}
                          type="button"
                          role="menuitem"
                          aria-label="Cerrar sesión y salir de la aplicación"
                          style={{
                            borderRadius: '8px',
                            padding: '12px 16px',
                            transition: 'all 0.3s ease',
                            fontWeight: '500',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <i className="bi bi-box-arrow-right me-3" style={{ fontSize: '1.1rem' }}></i>
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <li className="nav-item" role="none">
                  <Link 
                    className="nav-link px-4 py-2 d-flex align-items-center"
                    to="/login"
                    style={{
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer para compensar el navbar fixed */}
      <div style={{ height: '64px' }} aria-hidden="true"></div>
    </>
  );
};

export default Navbar;
