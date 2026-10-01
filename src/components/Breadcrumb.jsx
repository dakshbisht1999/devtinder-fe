import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();

  // Split path into segments and filter out empty strings
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Return nothing if on homepage
  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="px-6 py-4 bg-base-200 border-b border-base-300 text-sm text-base-content/70">
      <ol className="flex items-center space-x-2">
        {/* Home Link */}
        <li>
          <Link to="/" className="hover:underline text-primary font-medium">
            Home
          </Link>
        </li>

        {pathnames.map((value, index) => {
          // Reconstruct the route path up to the current segment
          const routeTo = `/${pathnames.slice(0, index + 1).join('>')}`;
          const isLast = index === pathnames.length - 1;

          // Capitalize and format path text (e.g., "dev-tinder" -> "Dev Tinder")
          const formattedName = value
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <React.Fragment key={routeTo}>
              <span className="text-base-content/40">/</span>
              <li>
                {isLast ? (
                  // Current Active Page (not clickable)
                  <span className="font-semibold text-base-content">{formattedName}</span>
                ) : (
                  // Parent Link
                  <Link to={routeTo} className="hover:underline text-primary font-medium">
                    {formattedName}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;