import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Body from './Body';
import Login from './Login';
import Profile from './Profile';

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
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
