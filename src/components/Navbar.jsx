import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white px-6 flex items-center justify-between z-50 shadow-lg">
      <Link to="/" className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
        KBindumentaria
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200">
                Hola, <span className="text-violet-400 font-bold">{user?.username}</span>
              </p>
              <p className="text-xs text-slate-400 capitalize">
                Rol: {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
              </p>
            </div>
            
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-md shadow-indigo-600/20"
              >
                Panel Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold px-4 py-2 rounded-lg border border-slate-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-md shadow-violet-600/20"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
