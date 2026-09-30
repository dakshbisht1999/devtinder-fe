import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-base-900 text-base-content py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-base-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <h1 className="text-3xl font-bold text-indigo-400 mb-2">Terms of Service</h1>
        <p className="text-sm text-base-content mb-6">Effective Date: October 1, 2026</p>

        <p className="text-base-content mb-6 leading-relaxed">
          By accessing or using <strong className="text-white">DevTinder</strong>, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using the app.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            1. Authentication & Profile
          </h2>
          <p className="text-base-content leading-relaxed">
            You must authenticate using a valid Google account to access DevTinder. You are responsible for all actions taken through your session.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            2. Acceptable Conduct
          </h2>
          <p className="text-base-content mb-3">When using DevTinder, you agree not to:</p>
          <ul className="list-disc list-inside text-base-content space-y-2 ml-2">
            <li>Upload abusive, offensive, or inappropriate content on your developer profile.</li>
            <li>Impersonate other individuals, developers, or entities.</li>
            <li>Attempt to spam, scrape, or disrupt the platform's infrastructure.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            3. Public Information
          </h2>
          <p className="text-base-content leading-relaxed">
            Your name, profile picture, and public tech stack details will be visible to other registered developers for networking and discovery purposes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            4. Access Termination
          </h2>
          <p className="text-base-content leading-relaxed">
            We reserve the right to suspend or revoke access to your DevTinder account if you violate any guidelines mentioned in these Terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            5. Limitation of Liability
          </h2>
          <p className="text-base-content leading-relaxed">
            DevTinder is provided on an "AS IS" basis without warranties. We are not liable for direct or indirect damages resulting from platform usage.
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-slate-700">
          <h2 className="text-lg font-semibold text-base-content mb-2">6. Contact Us</h2>
          <p className="text-base-content">
            For inquiries regarding these Terms, contact us:{' '}
            <a 
            href="https://dishantbisht.in/contact" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-400 hover:underline"
            >
            here
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;