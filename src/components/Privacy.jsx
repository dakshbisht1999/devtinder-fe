import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-base-900 text-base-content py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-base-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <h1 className="text-3xl font-bold text-indigo-400 mb-2">Privacy Policy</h1>
        <p className="text-sm text-base-content mb-6">Effective Date: October 1, 2026</p>

        <p className="text-base-content mb-6 leading-relaxed">
          Welcome to <strong className="text-white">DevTinder</strong>. We respect your privacy and are committed to protecting the personal data you share with us.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            1. Information We Collect
          </h2>
          <p className="text-base-content mb-3">
            When you authenticate using Google Sign-In, we collect basic profile information authorized by you:
          </p>
          <ul className="list-disc list-inside text-base-content space-y-2 ml-2">
            <li><strong className="text-base-content">Google Account ID (<code className="text-indigo-300 bg-base-900 px-1 py-0.5 rounded">sub</code>):</strong> Uniquely identifies your account.</li>
            <li><strong className="text-base-content">Full Name (<code className="text-indigo-300 bg-base-900 px-1 py-0.5 rounded">given_name</code>, <code className="text-indigo-300 bg-base-900 px-1 py-0.5 rounded">family_name</code>):</strong> Displays your identity within DevTinder.</li>
            <li><strong className="text-base-content">Email Address:</strong> Used to manage your account and send essential system updates.</li>
            <li><strong className="text-base-content">Profile Picture URL (<code className="text-indigo-300 bg-base-900 px-1 py-0.5 rounded">picture</code>):</strong> Renders your developer avatar.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-base-content space-y-2 ml-2">
            <li>To create, display, and maintain your public developer profile.</li>
            <li>To authenticate your session securely via Google Sign-In.</li>
            <li>To connect you with other developers on the platform.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            3. Data Sharing and Security
          </h2>
          <p className="text-base-content leading-relaxed">
            We do not sell, rent, or trade your personal information to any third parties. All data is handled securely and strictly utilized to deliver core DevTinder services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-base-content border-b border-slate-700 pb-2 mb-3">
            4. Account & Data Deletion
          </h2>
          <p className="text-base-content leading-relaxed">
            You reserve the right to delete your DevTinder profile and associated Google profile data at any point. Contact us to process immediate account removal.
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-slate-700">
          <h2 className="text-lg font-semibold text-base-content mb-2">5. Contact Us</h2>
          <p className="text-base-content">
            For questions or requests regarding this Privacy Policy, contact us:{' '}
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

export default PrivacyPolicy;