import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import './App.css';
import Body from './components/Body';
import Login from './components/Login';
import Feed from './components/Feed';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import AuthBootstrap from './components/AuthBootstrap';
import { useIsLoggedIn } from './auth';
import { Provider } from 'react-redux'
import appStore from './utils/appStore';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import Signup from './components/Signup';
import Connections from './components/Connections';

const GuestOnlyRoute = ({ children }) => {
  const isLoggedIn = useIsLoggedIn();
  return isLoggedIn ? <Navigate to="/feed" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useIsLoggedIn();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const Page = ({ title }) => <div className="p-4">{title}</div>;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return (
    <>
      <Provider store={appStore}>
        <ToastContainer position="top-right" autoClose={3000} theme={isDarkMode ? 'dark' : 'light'} />
        <AuthBootstrap>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />}>
                <Route index element={<Navigate to="/feed" replace />} />
                <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
                <Route path="/signup" element={<GuestOnlyRoute><Signup /></GuestOnlyRoute>} />
                <Route path="/resetPasswordOtp" element={<GuestOnlyRoute><Page title="Reset Password using OTP"  /></GuestOnlyRoute>} />
                <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/resetPassword" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
                <Route path="/requests" element={<ProtectedRoute><Page title="Requests" /></ProtectedRoute>} />
                <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthBootstrap>
      </Provider>
      {/* <h1 class="text-3xl font-bold underline">Hello World</h1> 

      <div class="bg-zinc-100">
        <div class="border-zinc-200 bg-zinc-50 text-zinc-800">
          This is a hardcoded dark text on a light background, it needs double the amount of class names
          to support dark mode.
        </div>
      </div>

      <div class="bg-base-200">
        <div class="bg-base-100 border-base-300 text-base-content">
          This is dark text on a light background, which switches to light text on a dark background in
          dark mode.
        </div>
      </div>    */}
    </>
  )
}

export default App
