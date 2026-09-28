import React from 'react';
import { Store, Utensils, Flame, Building2, Sun, Droplets, ArrowRight, ShieldCheck, Clock, CreditCard, ChevronRight } from 'lucide-react';

export default function WelcomeCatalog({ onSelectPipeline, onSearchIntent }) {
  const catalog = [
    {
      key: 'cloud_kitchen',
      code: 'CIV-1001',
      title: 'Register a Cloud Kitchen / Bakery',
      dept: 'MCGM Aaple Sarkar Desk & Food Safety',
      fee: '₹8,300',
      sla: '18 - 25 Days',
      stages: '5 Clearance Stages',
      icon: Utensils,
      accent: 'blue',
      desc: 'Complete commercial licensing covering PAN, Gumasta Shop Act, Fire NOC, FSSAI registration, and Health Trade license.'
    },
    {
      key: 'gumasta_license',
      code: 'CIV-1002',
      title: 'Gumasta License (Shop & Establishment Act)',
      dept: 'Labour Department, Maharashtra',
      fee: '₹1,500',
      sla: '3 - 7 Days',
      stages: '4 Clearance Stages',
      icon: Store,
      accent: 'emerald',
      desc: 'Mandatory commercial establishment registration for shops, offices, and trading firms under Maharashtra Shops Act.'
    },
    {
      key: 'fssai_license',
      code: 'CIV-1003',
      title: 'FSSAI Food Safety Operator License',
      dept: 'Food Safety and Standards Authority (FoSCoS)',
      fee: '₹1,000',
      sla: '5 - 10 Days',
      stages: '4 Clearance Stages',
      icon: Utensils,
      accent: 'amber',
      desc: 'Statutory food operator clearance and hygiene compliance certification for restaurants, cafes, and manufacturers.'
    },
    {
      key: 'fire_noc',
      code: 'CIV-1004',
      title: 'Fire Safety Inspection & Clearance NOC',
      dept: 'Mumbai Fire Brigade (MCGM)',
      fee: '₹2,200',
      sla: '7 - 14 Days',
      stages: '4 Clearance Stages',
      icon: Flame,
      accent: 'rose',
      desc: 'Building safety compliance, firefighting equipment installation audit, and municipal CFO certification.'
    },
    {
      key: 'property_tax',
      code: 'CIV-1005',
      title: 'Property Tax Assessment & Name Mutation',
      dept: 'MCGM Assessment & Collection Department',
      fee: '₹850',
      sla: '14 - 21 Days',
      stages: '4 Clearance Stages',
      icon: Building2,
      accent: 'indigo',
      desc: 'Official municipal revenue record update, SAC number transfer, and zero-dues tax clearance certification.'
    },
    {
      key: 'rooftop_solar',
      code: 'CIV-1006',
      title: 'Commercial Rooftop Solar Net-Metering',
      dept: 'MSEDCL & MCGM Building Proposal',
      fee: '₹4,250',
      sla: '21 - 30 Days',
      stages: '5 Clearance Stages',
      icon: Sun,
      accent: 'amber',
      desc: 'Structural roof stability sanction, DISCOM grid connectivity feasibility, CEI inspection, and bi-directional meter setup.'
    },
    {
      key: 'water_connection',
      code: 'CIV-1007',
      title: 'Commercial Water Connection & Meter Tapping',
      dept: 'MCGM Hydraulic Engineering Department',
      fee: '₹6,400',
      sla: '14 - 20 Days',
      stages: '5 Clearance Stages',
      icon: Droplets,
      accent: 'cyan',
      desc: 'Municipal water main tapping sanction, licensed plumber line laying, water quality potability report, and meter commissioning.'
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-6 transition-colors duration-200">
      {/* Header Banner */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-2.5 py-0.5 rounded-full">
              Municipal Compliance Directory
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Brihanmumbai Municipal Corporation (MCGM)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1.5">
            Select a Regulatory Pathway to Begin
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Choose from the standardized civic clearance procedures below, or type your specific commercial or civic intent into the command omnibar above.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 px-3 py-1.5 rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>7 Pre-Audited Statutory Pathways</span>
        </div>
      </div>

      {/* Grid of Pathways */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {catalog.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => onSelectPipeline(item.key, item.title)}
              className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-800 dark:text-zinc-200 group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono-code text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                    {item.code}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                  {item.title}
                </h3>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                  {item.dept}
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span className="font-mono-code font-bold text-zinc-900 dark:text-zinc-100">{item.fee}</span>
                  <span className="text-zinc-300 dark:text-zinc-600">•</span>
                  <span className="text-zinc-500 dark:text-zinc-400">{item.sla}</span>
                </div>

                <div className="flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition">
                  <span>Open Roadmap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
