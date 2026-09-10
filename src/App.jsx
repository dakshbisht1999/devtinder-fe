import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Body from './Body';
import Login from './Login';
import Profile from './Profile';
import ResetPassword from './ResetPassword';
import { isLoggedIn } from './auth';

const GuestOnlyRoute = ({ children }) =>
  isLoggedIn() ? <Navigate to="/feed" replace /> : children;

const ProtectedRoute = ({ children }) =>
  isLoggedIn() ? children : <Navigate to="/login" replace />;

const Feed = () => <div className="p-4">Feed</div>;
const Page = ({ title }) => <div className="p-4">{title}</div>;

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Navigate to="/feed" replace />} />
            <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
            <Route path="/signup" element={<GuestOnlyRoute><Page title="Sign up" /></GuestOnlyRoute>} />
            <Route path="/resetPassword" element={<GuestOnlyRoute><ResetPassword /></GuestOnlyRoute>} />
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Page title="Settings" /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><Page title="Requests" /></ProtectedRoute>} />
            <Route path="/connections" element={<ProtectedRoute><Page title="Connections" /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
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
