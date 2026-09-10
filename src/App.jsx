import './App.css';

function App() {
  return (
    <>
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">💻 DevTinder</a>
        </div>
        <div className="flex gap-2">
          {/* <input type="text" placeholder="Search" className="input w-24 md:w-auto" /> */}
          <div className="dropdown dropdown-end mx-5">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
      <h1 class="text-3xl font-bold underline">Hello World</h1> 

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
      </div>   
    </>
  )
}

export default App
