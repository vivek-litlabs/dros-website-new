export const route = '/book-meeting';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';

export default function BookMeeting() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>Book a Demo | DROS AI for Collections</title>
        <meta name="description" content="Book a meeting with DROS to see how AI agents, account context, and workflow orchestration support collections and recovery teams." />
      </Helmet>
      <Navbar />

      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Book a Meeting</h1>
          <div
            className="meetings-iframe-container"
            data-src="https://meetings-na2.hubspot.com/anshul20/dros?embed=true"
          />
        </div>
      </div>
    </div>
  );
}
