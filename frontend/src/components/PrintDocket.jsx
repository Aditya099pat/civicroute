import React from 'react';

export default function PrintDocket({ pipeline }) {
  if (!pipeline) return null;

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div id="print-docket" className="hidden p-8 text-black bg-white font-sans max-w-4xl mx-auto">
      {/* Official Government Header with Project Logo Crest */}
      <div className="border-b-2 border-black pb-4 text-center">
        <div className="w-14 h-14 mx-auto mb-2 rounded-xl overflow-hidden bg-black p-0.5 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="CivicRoute Official Crest"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-xs font-bold tracking-widest uppercase">
          GOVERNMENT OF MAHARASHTRA • URBAN DEVELOPMENT DEPARTMENT
        </h2>
        <h1 className="text-xl font-extrabold uppercase mt-1">
          CITIZEN STATUTORY CLEARANCE DOCKET &amp; PREREQUISITE AUDIT
        </h1>
        <p className="text-[11px] text-gray-700 mt-0.5">
          CivicRoute Municipal Dependency Visualizer • Citizen Facilitation Counter Desk Copy
        </p>
      </div>

      {/* Meta Specifications Box */}
      <div className="mt-4 border border-black p-3.5 text-xs grid grid-cols-2 gap-2 bg-gray-50">
        <div>
          <p><strong>Civic Task:</strong> {pipeline.title}</p>
          <p><strong>Docket Ref ID:</strong> {pipeline.id}</p>
          <p><strong>Jurisdiction:</strong> {pipeline.jurisdiction}</p>
          <p><strong>Primary Desk:</strong> {pipeline.primaryDept}</p>
        </div>
        <div>
          <p><strong>Date Generated:</strong> {today}</p>
          <p><strong>Total Statutory Fees:</strong> {pipeline.totalFee} (Official Challan)</p>
          <p><strong>Estimated SLA:</strong> {pipeline.cycleTime}</p>
          <p><strong>Statutory Act:</strong> Maharashtra Right to Public Services Act (RTS Act) 2015</p>
        </div>
      </div>

      {/* Blocker Notice if present */}
      {pipeline.conflictText && (
        <div className="mt-3 p-2.5 border border-black text-xs font-semibold">
          <strong>CRITICAL PREREQUISITE DEPENDENCY NOTICE:</strong> {pipeline.conflictText}
        </div>
      )}

      {/* Sequential Milestone Checklist */}
      <div className="mt-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
          Topological Clearance Sequence &amp; Counter Verification Sign-Off
        </h3>

        {pipeline.nodes.map((node, i) => {
          const dept = node.department || node.dept;
          const time = node.estimatedDays || node.time;
          const url = node.officialUrl || node.url;
          const officeType = node.officeType || node.type;
          const docs = node.documentsRequired || node.docs || [];

          return (
            <div key={node.id} className="border border-black p-3.5 text-xs space-y-2">
              <div className="flex justify-between items-start border-b border-gray-300 pb-1.5">
                <div>
                  <span className="font-extrabold text-sm">
                    Step {i + 1}: {node.title}
                  </span>
                  <div className="text-[11px] text-gray-700 font-mono">
                    Code: {node.code} | Dept: {dept} {node.wardFacet ? `(${node.wardFacet})` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs uppercase px-2 py-0.5 border border-black">
                    {node.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                <div><strong>Statutory Fee:</strong> {node.fee}</div>
                <div><strong>SLA Duration:</strong> {time}</div>
                <div><strong>Mode:</strong> {officeType}</div>
              </div>

              <div className="text-[11px]">
                <strong>Verified Portal:</strong> {url}
              </div>

              <div className="text-[11px]">
                <strong>Mandatory Enclosures:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 pl-1">
                  {docs.map((doc, idx) => (
                    <li key={idx}>[  ] {doc}</li>
                  ))}
                </ul>
              </div>

            {/* Ward Counter Sign-off Box */}
            <div className="mt-2 pt-2 border-t border-dashed border-gray-400 flex justify-between items-center text-[10px] text-gray-800">
              <span>Ward Clerk Inspection &amp; Scrutiny Check: [  ] Approved  [  ] Queried</span>
              <span>Clerk Initial &amp; Date Stamp: ______________________</span>
            </div>
          </div>
        );
      })}
      </div>

      {/* Institutional Citizen Rights Disclaimer */}
      <div className="mt-6 pt-3 border-t-2 border-black text-[10px] text-gray-700 leading-tight">
        <p>
          <strong>Notice under RTS Act 2015:</strong> Under Section 4 of the Maharashtra Right to Public Services Act, designated officers are statutory bound to deliver the notified services within the stipulated SLA period. For grievance escalation or appeals, citizens may file First Appeal before the Ward Designated Officer within 30 days.
        </p>
        <p className="mt-1">
          Generated via CivicRoute System • Authenticated government registry endpoints (.gov.in)
        </p>
      </div>
    </div>
  );
}
