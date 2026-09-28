import React from 'react';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="mt-auto border-t border-[#e2e4e8] dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 px-6 lg:px-8 text-xs text-zinc-500 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Left: Project Logo & Identity (No problem statement code) */}
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md overflow-hidden bg-[#070d19] ring-1 ring-zinc-300 dark:ring-zinc-700 p-0.5 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="CivicRoute Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">CivicRoute</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Municipal Bureaucracy Path Visualizer</span>
        </div>

        {/* Center: Cleanly aligned navigation links (No schema option) */}
        <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              alert("CivicRoute: Enterprise civic-tech navigator for municipal clearance roadmaps and verified government endpoints.");
            }}
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition"
          >
            About CivicRoute
          </a>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <a
            href="#portals"
            onClick={(e) => {
              e.preventDefault();
              alert("Verified Government Gateways: aaplesarkar.mahaonline.gov.in, portal.mcgm.gov.in, foscos.fssai.gov.in, incometax.gov.in");
            }}
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition"
          >
            Official Portals Directory
          </a>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <button onClick={onOpenAdmin} className="hover:text-zinc-900 dark:hover:text-zinc-200 transition">
            Clerk Gazette Audit
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              alert("Citizen Helpdesk: MCGM Right to Services Helpdesk (Toll Free 1800-22-1234) • civicroute@gov.in");
            }}
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition"
          >
            Contact Helpdesk
          </a>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              alert("Data Governance: Zero PII retained on public client. Compliant with Digital Personal Data Protection Act (DPDPA 2023).");
            }}
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition"
          >
            Privacy Policy
          </a>
        </div>

        {/* Right: Statutory Attribution */}
        <div className="text-zinc-400 dark:text-zinc-500 text-[11px] whitespace-nowrap">
          Government of Maharashtra • RTS Act 2015
        </div>
      </div>
    </footer>
  );
}
