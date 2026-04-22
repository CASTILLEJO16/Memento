import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Pill, User, Stethoscope, ClipboardList, Home, Users, UserPlus, RefreshCw, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { Toaster, toast } from 'sonner';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, perfil, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const nombrePerfil = perfil && 'nombre' in perfil ? perfil.nombre : '';
  const rolMedico = usuario?.rol === 'medico';

  const navLinks = rolMedico
    ? [
        { to: '/dashboard', label: 'Inicio', icon: Home },
        { to: '/pacientes', label: 'Pacientes', icon: Users },
        { to: '/pacientes/nuevo', label: 'Registrar Paciente', icon: UserPlus },
        { to: '/prescripciones/nueva', label: 'Nueva Prescripción', icon: Pill },
        { to: '/prescripciones/alergia', label: 'Cambiar Prescripción', icon: RefreshCw },
      ]
    : [
        { to: '/dashboard', label: 'Mi Tratamiento', icon: Home },
        { to: '/historial', label: 'Historial', icon: ClipboardList },
      ];

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col">
      <Toaster position="top-right" richColors expand={false} />
      
      {/* Navbar with Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto w-full glass rounded-2xl shadow-premium pointer-events-auto overflow-hidden">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/dashboard" className="flex items-center gap-2 group">
                  <div className="p-2 bg-primary-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                    Dr. Memento
                  </span>
                </Link>
                <div className="hidden md:flex ml-8 space-x-1">
                  {navLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                        location.pathname === to
                          ? 'text-primary-600'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                      {location.pathname === to && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-xl mr-2">
                  {rolMedico ? (
                    <Stethoscope className="w-4 h-4 text-primary-500" />
                  ) : (
                    <User className="w-4 h-4 text-medical-500" />
                  )}
                  <span className="text-sm font-bold text-gray-700">{nombrePerfil}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-gray-100 bg-white"
              >
                <div className="px-4 py-3 space-y-1">
                  {navLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        location.pathname === to
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Content Area with Top Margin for Nav */}
      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 pb-12 w-full max-w-7xl mx-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Cerrar Sesión"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsLogoutModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          ¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver a ingresar tus credenciales para acceder.
        </p>
      </Modal>
    </div>
  );
};

export default Layout;
