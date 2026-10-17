import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { useTheme } from '../../Context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { userToken, setUserToken, userData, setuserData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  function toggleNav() {
    setIsOpen(!isOpen);
  }

  function logOut() {
    localStorage.removeItem('token');
    setUserToken(null);
    setuserData(null);
    navigate('/');
  }

  const linkClass = ({ isActive }) =>
    [
      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-brand/10 text-fg-brand md:bg-transparent'
        : 'text-body hover:bg-neutral-secondary-soft hover:text-heading',
    ].join(' ');

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-default/80 bg-neutral-primary/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:flex-nowrap">
        <NavLink to={userToken ? '/home' : '/'} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-sm font-bold text-primary-foreground shadow-sm">
            F
          </span>
          <span className="text-lg font-semibold tracking-tight text-primary-foreground">FaceNoTe</span>
        </NavLink>

        <button
          onClick={toggleNav}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary md:hidden"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        </button>

        <div
          id="navbar-default"
          className={`${!isOpen && 'hidden'} w-full md:flex md:items-center md:justify-between md:gap-8`}
        >
          <ul className="mt-3 flex flex-col gap-1 rounded-xl border border-default bg-neutral-secondary-soft p-2 md:mt-0 md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0">
            {userToken ? (
              <>
                <li>
                  <NavLink to="/home" className={linkClass} onClick={() => setIsOpen(false)}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" className={linkClass} onClick={() => setIsOpen(false)}>
                    Profile
                  </NavLink>
                </li>
              </>
            ) : null}
          </ul>

          <ul className="mt-2 flex flex-col gap-1 rounded-xl border border-default bg-neutral-secondary-soft p-2 md:mt-0 md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0">
            {!userToken ? (
              <>
                <li>
                  <NavLink to="/register" className={linkClass} onClick={() => setIsOpen(false)}>
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-heading hover:bg-neutral-secondary-soft"
                  >
                    <img
                      src={userData?.photo}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-primary"
                    />
                    <span className="font-medium">{userData?.name || 'Account'}</span>
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={logOut}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-body transition hover:bg-red-50 hover:text-red-600 md:text-center"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleTheme}
                    type="button"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-heading hover:bg-neutral-secondary-soft"
                    aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
