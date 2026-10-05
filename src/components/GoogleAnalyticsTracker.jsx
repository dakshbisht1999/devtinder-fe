import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
let lastTrackedPage;

export default function GoogleAnalyticsTracker() {
  const location = useLocation();
  const page = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (!measurementId) return;

    if (!ReactGA.isInitialized) {
      ReactGA.initialize(measurementId, {
        gtagOptions: { send_page_view: false },
      });
    }

    // Prevent duplicate initial page views from React StrictMode in development.
    if (lastTrackedPage === page) return;
    lastTrackedPage = page;

    ReactGA.send({
      hitType: 'pageview',
      page,
      title: document.title,
    });
  }, [page]);

  return null;
}
