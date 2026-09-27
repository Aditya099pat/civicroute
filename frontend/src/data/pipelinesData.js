export const INITIAL_PIPELINES = {
  cloud_kitchen: {
    id: "CIV-1001",
    shortCode: "CK",
    title: "Register a Cloud Kitchen / Bakery",
    jurisdiction: "Mumbai (MCGM Ward K-West)",
    totalFee: "₹8,300",
    primaryDept: "MCGM Aaple Sarkar Desk",
    cycleTime: "18 - 25 Business Days",
    tier: "Priority Clearance Tier",
    conflictText: "Health Trade License is blocked pending Fire NOC inspection receipt and FoSCoS registration.",
    nodes: [
      {
        id: "1",
        code: "DOC-8812",
        title: "Identity & Business Incorporation (Aadhaar & PAN)",
        dept: "Identity & Tax",
        type: "Online",
        fee: "₹0",
        time: "Instant",
        url: "https://incometax.gov.in",
        docs: ["Personal PAN Card", "Aadhaar / Digital ID", "Active Mobile Number"],
        prereqs: [],
        status: "completed"
      },
      {
        id: "2",
        code: "DOC-9043",
        title: "Gumasta License (Shop & Establishment Act)",
        dept: "MCGM",
        type: "Online",
        fee: "₹1,500",
        time: "3-5 Days",
        url: "https://aaplesarkar.mahaonline.gov.in",
        docs: ["Registered Rental Agreement", "Landlord NOC Certificate", "Identity Proof", "Electricity Bill"],
        prereqs: ["1"],
        status: "available"
      },
      {
        id: "3",
        code: "DOC-4190",
        title: "Fire Safety Compliance & Inspection NOC",
        dept: "Fire",
        type: "Ward Office",
        fee: "₹2,200",
        time: "7-10 Days",
        url: "https://portal.mcgm.gov.in/fire-services",
        docs: ["Commercial Kitchen Layout", "Gumasta Copy", "Fire Extinguisher Vendor Invoice"],
        prereqs: ["2"],
        status: "locked"
      },
      {
        id: "4",
        code: "DOC-3321",
        title: "FSSAI Basic Food Operator Registration",
        dept: "FSSAI",
        type: "Online",
        fee: "₹100 / yr",
        time: "5 Days",
        url: "https://foscos.fssai.gov.in",
        docs: ["Gumasta License Copy", "Government Photo ID", "Food Category List"],
        prereqs: ["2"],
        status: "locked"
      },
      {
        id: "5",
        code: "DOC-1108",
        title: "MCGM Health Trade License Approval",
        dept: "MCGM",
        type: "Hybrid",
        fee: "₹4,500",
        time: "10-14 Days",
        url: "https://portal.mcgm.gov.in/health-trade",
        docs: ["FSSAI Food Certificate", "Fire Department NOC", "Potable Water Test Report", "Property Tax Clearance"],
        prereqs: ["3", "4"],
        status: "locked"
      }
    ]
  },
  water_connection: {
    id: "CIV-1002",
    shortCode: "WC",
    title: "Commercial Water Meter Sanction",
    jurisdiction: "Municipal Corporation (MCGM)",
    totalFee: "₹4,200",
    primaryDept: "Hydraulic Engineer Desk",
    cycleTime: "10 - 15 Business Days",
    tier: "Verified Route",
    conflictText: "Final Water Tapping requires prior Licensed Plumber Internal Blueprint approval.",
    nodes: [
      {
        id: "1",
        code: "DOC-2011",
        title: "Property Assessment Tax Clearance",
        dept: "MCGM",
        type: "Online",
        fee: "₹0",
        time: "2 Days",
        url: "https://ptaxportal.mcgm.gov.in",
        docs: ["SAC Assessment Number", "Receipt of Current Paid Year"],
        prereqs: [],
        status: "completed"
      },
      {
        id: "2",
        code: "DOC-2012",
        title: "Licensed Plumber Internal Blueprint",
        dept: "MCGM",
        type: "Ward Office",
        fee: "₹800",
        time: "4 Days",
        url: "https://portal.mcgm.gov.in/water",
        docs: ["Internal Pipe Drawing", "Licensed Plumber Signature"],
        prereqs: ["1"],
        status: "available"
      },
      {
        id: "3",
        code: "DOC-2013",
        title: "Final Water Tapping & Meter Installation",
        dept: "MCGM",
        type: "Hybrid",
        fee: "₹3,400",
        time: "8 Days",
        url: "https://portal.mcgm.gov.in/water-sanction",
        docs: ["Inspection Report", "Tax Clearance"],
        prereqs: ["2"],
        status: "locked"
      }
    ]
  },
  street_vendor: {
    id: "CIV-1003",
    shortCode: "SV",
    title: "Street Vending Vending Zone Certificate",
    jurisdiction: "Town Vending Committee (TVC)",
    totalFee: "₹600",
    primaryDept: "Town Vending Desk",
    cycleTime: "25 - 30 Business Days",
    tier: "Action Needed",
    conflictText: "Ward allocation pending town vending committee review cycle.",
    nodes: [
      {
        id: "1",
        code: "DOC-6101",
        title: "Domicile & Identification Verification",
        dept: "Identity",
        type: "Online",
        fee: "₹100",
        time: "7 Days",
        url: "https://aaplesarkar.mahaonline.gov.in",
        docs: ["Domicile Certificate", "Ration / Voter Card"],
        prereqs: [],
        status: "available"
      },
      {
        id: "2",
        code: "DOC-6102",
        title: "Town Vending Committee (TVC) Allocation",
        dept: "MCGM",
        type: "Ward Office",
        fee: "₹500",
        time: "20 Days",
        url: "https://portal.mcgm.gov.in/vending",
        docs: ["Voter ID", "Survey Token Number"],
        prereqs: ["1"],
        status: "locked"
      }
    ]
  }
};
