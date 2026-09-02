import ReactGA from 'react-ga4';

export function trackCta(buttonName: string) {
  ReactGA.event('cta_click', { button_name: buttonName });
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  ReactGA.event(name, params);
}
