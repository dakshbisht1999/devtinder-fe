import React from 'react';
import GoogleLoginBtn from './GoogleLoginBtn';
import { Link } from 'react-router-dom';
import { useIsLoggedIn } from '../auth';
import devTinderLogo from "./../assets/devtinder-logo-120x120.jpg";

const LandingPage = ({ onGoogleLogin }) => {
    const loggedIn = useIsLoggedIn();
  return (
    <div className="min-h-[calc(100vh-136px)] bg-base-100 text-base-content flex flex-col justify-between">

      {/* Hero Section / App Purpose */}
      <main className="hero my-auto py-12">
        <div className="hero-content text-center max-w-2xl">
          <div>
            <h1 className="flex flex-col items-center text-4xl sm:text-5xl font-extrabold tracking-tight">
                Connect & Match with <span className="text-primary">Developers</span>at
                <span className="my-4" >
                    <img src={devTinderLogo} alt="devtinder-logo-square" className='rounded' />
                </span>
            </h1>
            <p className="text-lg text-base-content/80 mb-8 leading-relaxed">
              DevTinder is a networking platform for software engineers, designers, and tech enthusiasts. 
              Discover fellow developers, showcase your tech stack, collaborate on open-source projects, and build meaningful tech connections.
            </p>

            {/* Google Sign-In Action */}
            <div className="card bg-base-200 shadow-xl border border-base-300 p-6 max-w-sm mx-auto">
              {!loggedIn ? (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Get Started Today</h2>
                        <p className="text-xs text-base-content/70 mb-6">
                            Sign in securely using your Google account to create your developer profile.
                        </p>
                        <GoogleLoginBtn />
                    </>
              ) : ( <Link to="/feed" className='btn btn-success'>Continue to Feed</Link> )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;