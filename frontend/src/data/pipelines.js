/**
 * Master Verified Municipal Roadmaps
 * Jurisdiction: Maharashtra & Municipal Corporation (MCGM)
 */
export const INITIAL_PIPELINES = {
  cloud_kitchen: {
    id: "CIV-1001",
    title: "Register a Cloud Kitchen / Bakery",
    jurisdiction: "Mumbai (MCGM Ward K-West)",
    totalFee: "₹8,300",
    primaryDept: "MCGM Aaple Sarkar Desk",
    cycleTime: "18 - 25 Business Days",
    nodes: [
      {
        id: "1",
        code: "DOC-8812",
        title: "Business Tax Registration (PAN/TAN)",
        department: "Income Tax Department",
        officeType: "Online",
        estimatedDays: "Instant (Existing)",
        fee: "₹0",
        officialUrl: "https://incometax.gov.in",
        documentsRequired: ["Personal PAN Card", "Identity Proof", "Active Mobile for OTP"],
        prerequisites: [],
        status: "available"
      },
      {
        id: "2",
        code: "DOC-9043",
        title: "Gumasta License (Shop & Establishment Act)",
        department: "MCGM & Aaple Sarkar Portal",
        officeType: "Online",
        estimatedDays: "3-5 Business Days",
        fee: "₹1,500",
        officialUrl: "https://aaplesarkar.mahaonline.gov.in",
        documentsRequired: ["Registered Rental Agreement", "Landlord NOC", "Identity Proof Copy", "Premises Electricity Bill"],
        prerequisites: ["1"],
        status: "locked"
      },
      {
        id: "3",
        code: "DOC-4190",
        title: "Fire Safety Compliance NOC",
        department: "Mumbai Fire Brigade (MCGM)",
        officeType: "Physical Ward Office",
        estimatedDays: "7-10 Business Days",
        fee: "₹2,200",
        officialUrl: "https://portal.mcgm.gov.in/fire-services",
        documentsRequired: ["Floor Layout Blueprint", "Gumasta Certificate", "Fire Extinguisher Invoices"],
        prerequisites: ["2"],
        status: "locked"
      },
      {
        id: "4",
        code: "DOC-3321",
        title: "FSSAI Basic Food Registration",
        department: "Food Safety and Standards Authority of India (FoSCoS)",
        officeType: "Online",
        estimatedDays: "5 Business Days",
        fee: "₹100 / Year",
        officialUrl: "https://foscos.fssai.gov.in",
        documentsRequired: ["Gumasta Certificate Copy", "Government Photo ID", "List of Proposed Food Items"],
        prerequisites: ["2"],
        status: "locked"
      },
      {
        id: "5",
        code: "DOC-1108",
        title: "MCGM Health Trade License Approval",
        department: "MCGM Public Health Department",
        officeType: "Hybrid",
        estimatedDays: "10-14 Business Days",
        fee: "₹4,500",
        officialUrl: "https://portal.mcgm.gov.in/health-trade",
        documentsRequired: ["FSSAI Certificate", "Fire Safety NOC", "Water Potability Report", "Property Tax Receipt"],
        prerequisites: ["3", "4"],
        status: "locked"
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-5", source: "3", target: "5" },
      { id: "e4-5", source: "4", target: "5" }
    ]
  },

  gumasta_license: {
    id: "CIV-1002",
    title: "Gumasta License (Shop & Establishment Act)",
    jurisdiction: "Labour Department, Maharashtra",
    totalFee: "₹1,500",
    primaryDept: "Aaple Sarkar Labour Facilitation",
    cycleTime: "3 - 7 Business Days",
    nodes: [
      {
        id: "1",
        code: "GUM-01",
        title: "Proprietor / Partner KYC Verification",
        department: "Income Tax & UIDAI Gateway",
        officeType: "Online",
        estimatedDays: "Instant",
        fee: "₹0",
        officialUrl: "https://incometax.gov.in",
        documentsRequired: ["PAN Card Copy", "Identity Proof", "Passport Size Photograph"],
        prerequisites: [],
        status: "available"
      },
      {
        id: "2",
        code: "GUM-02",
        title: "Commercial Premises Tenancy Validation",
        department: "Department of Registration & Stamps",
        officeType: "Online",
        estimatedDays: "1 Business Day",
        fee: "₹0",
        officialUrl: "https://igrmaharashtra.gov.in",
        documentsRequired: ["Registered Rent Agreement / Lease Deed", "Property Card or Latest Electricity Bill", "Owner NOC Form"],
        prerequisites: ["1"],
        status: "locked"
      },
      {
        id: "3",
        code: "GUM-03",
        title: "Form 'A' / Intimation Submission (Aaple Sarkar)",
        department: "Maharashtra Labour Commission",
        officeType: "Online",
        estimatedDays: "2 - 3 Business Days",
        fee: "₹1,000",
        officialUrl: "https://aaplesarkar.mahaonline.gov.in",
        documentsRequired: ["Shop Name Board Photo in Devanagari (Marathi)", "Employee Count Declaration", "Partnership Deed / MoA (if applicable)"],
        prerequisites: ["2"],
        status: "locked"
      },
      {
        id: "4",
        code: "GUM-04",
        title: "Digital Certificate Sanction & Download",
        department: "MCGM Ward Citizen Facilitation Centre",
        officeType: "Online",
        estimatedDays: "1 Business Day",
        fee: "₹500",
        officialUrl: "https://lms.mahaonline.gov.in",
        documentsRequired: ["Fee Payment Challan Receipt", "Signed Self-Declaration"],
        prerequisites: ["3"],
        status: "locked"
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" }
    ]
  },

  fssai_license: {
    id: "CIV-1003",
    title: "FSSAI Food Safety Operator License",
    jurisdiction: "Food Safety and Standards Authority of India (FoSCoS)",
    totalFee: "₹2,100",
    primaryDept: "FSSAI Western Regional Desk",
    cycleTime: "7 - 14 Business Days",
    nodes: [
      {
        id: "1",
        code: "FSS-01",
        title: "Business Establishment Registration",
        department: "Municipal Corporation / Labour Dept",
        officeType: "Online",
        estimatedDays: "3 Days",
        fee: "₹1,500",
        officialUrl: "https://aaplesarkar.mahaonline.gov.in",
        documentsRequired: ["Gumasta Certificate / Trade License", "Partnership Deed or Incorporation Certificate"],
        prerequisites: [],
        status: "available"
      },
      {
        id: "2",
        code: "FSS-02",
        title: "Food Safety Management Declaration",
        department: "FoSCoS Regulatory Cell",
        officeType: "Online",
        estimatedDays: "1 Day",
        fee: "₹0",
        officialUrl: "https://foscos.fssai.gov.in",
        documentsRequired: ["List of Food Categories Handled", "FSMS Plan Undertaking", "Photo ID of Food Safety Supervisor"],
        prerequisites: ["1"],
        status: "locked"
      },
      {
        id: "3",
        code: "FSS-03",
        title: "FoSCoS Application Form 'B' Filing",
        department: "Food Safety Designated Officer",
        officeType: "Online",
        estimatedDays: "5 - 7 Business Days",
        fee: "₹2,000 / Year",
        officialUrl: "https://foscos.fssai.gov.in",
        documentsRequired: ["Premises Possession Proof", "Equipment & Machinery List", "Water Potability Lab Report"],
        prerequisites: ["2"],
        status: "locked"
      },
      {
        id: "4",
        code: "FSS-04",
        title: "Designated Officer Scrutiny & License Issuance",
        department: "FDA Maharashtra",
        officeType: "Hybrid",
        estimatedDays: "3 - 5 Business Days",
        fee: "₹100",
        officialUrl: "https://fda.maharashtra.gov.in",
        documentsRequired: ["Signed Application Copy", "Inspection Checklist Clearance"],
        prerequisites: ["3"],
        status: "locked"
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" }
    ]
  },

  fire_noc: {
    id: "CIV-1004",
    title: "Fire Safety Inspection & Clearance NOC",
    jurisdiction: "Mumbai Fire Brigade / Maharashtra Fire Services",
    totalFee: "₹3,700",
    primaryDept: "Chief Fire Officer (CFO) Cell",
    cycleTime: "14 - 20 Business Days",
    nodes: [
      {
        id: "1",
        code: "FIR-01",
        title: "Approved Architectural Blueprint Sanction",
        department: "MCGM Building Proposal Department",
        officeType: "Ward Office",
        estimatedDays: "5 Days",
        fee: "₹0",
        officialUrl: "https://autodcr.mcgm.gov.in",
        documentsRequired: ["Floor Layout Plan with Emergency Exits", "Structural Stability Certificate"],
        prerequisites: [],
        status: "available"
      },
      {
        id: "2",
        code: "FIR-02",
        title: "Fire Fighting Equipment Deployment (Form 'A')",
        department: "Licensed Fire Protection Agency",
        officeType: "Physical Ward Office",
        estimatedDays: "3 Days",
        fee: "₹1,500",
        officialUrl: "https://mahafireservice.gov.in",
        documentsRequired: ["ABC Dry Powder Extinguisher Invoices", "Smoke Detector Installation Receipts", "Licensed Agency Form A"],
        prerequisites: ["1"],
        status: "locked"
      },
      {
        id: "3",
        code: "FIR-03",
        title: "Ward Fire Station Field Inspection",
        department: "Mumbai Fire Brigade (Zonal)",
        officeType: "Physical Ward Office",
        estimatedDays: "7 Business Days",
        fee: "₹1,200",
        officialUrl: "https://portal.mcgm.gov.in/fire-services",
        documentsRequired: ["Provisional Scrutiny Challan", "Premises Key Plan & Gas Pipeline Clearance"],
        prerequisites: ["2"],
        status: "locked"
      },
      {
        id: "4",
        code: "FIR-04",
        title: "Final CFO Operational Fire NOC Endorsement",
        department: "Office of the Chief Fire Officer",
        officeType: "Hybrid",
        estimatedDays: "4 Business Days",
        fee: "₹1,000",
        officialUrl: "https://mahafireservice.gov.in",
        documentsRequired: ["Station Officer Inspection Report", "Paid Fire Premium Cess Receipt"],
        prerequisites: ["3"],
        status: "locked"
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" }
    ]
  },

  property_tax: {
    id: "CIV-1005",
    title: "Property Tax Assessment & Name Mutation",
    jurisdiction: "Assessment & Collection Department, MCGM",
    totalFee: "₹850",
    primaryDept: "Ward Assessment & Collection Desk",
    cycleTime: "10 - 15 Business Days",
    nodes: [
      {
        id: "1",
        code: "PTX-01",
        title: "Sale Deed & Index-II Registration Clearance",
        department: "Inspector General of Registration (IGR)",
        officeType: "Online",
        estimatedDays: "1 Day",
        fee: "₹0",
        officialUrl: "https://igrmaharashtra.gov.in",
        documentsRequired: ["Certified Index-II Copy", "Registered Sale Deed / Agreement"],
        prerequisites: [],
        status: "available"
      },
      {
        id: "2",
        code: "PTX-02",
        title: "Society NOC & Previous Tax Dues Clearance",
        department: "Co-operative Housing Society / Ward",
        officeType: "Physical Ward Office",
        estimatedDays: "2 Days",
        fee: "₹0",
        officialUrl: "https://ptaxportal.mcgm.gov.in",
        documentsRequired: ["Society Share Certificate Copy", "Zero Dues Receipt of Last Financial Year"],
        prerequisites: ["1"],
        status: "locked"
      },
      {
        id: "3",
        code: "PTX-03",
        title: "Mutation Application Form Submission",
        department: "MCGM Property Tax Portal",
        officeType: "Online",
        estimatedDays: "5 Business Days",
        fee: "₹500",
        officialUrl: "https://ptaxportal.mcgm.gov.in",
        documentsRequired: ["Property SAC Number", "Attested Index-II Copy", "Ownership Transfer Application"],
        prerequisites: ["2"],
        status: "locked"
      },
      {
        id: "4",
        code: "PTX-04",
        title: "Ward Inspector Field Assessment & Ledger Transfer",
        department: "Assessment & Collection Ward Desk",
        officeType: "Hybrid",
        estimatedDays: "5 Business Days",
        fee: "₹350",
        officialUrl: "https://portal.mcgm.gov.in",
        documentsRequired: ["Field Inspection Verification Token", "Public Notice Clearance"],
        prerequisites: ["3"],
        status: "locked"
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" }
    ]
  },

  water_connection: {
    id: "CIV-1006",
    title: "Commercial Water Meter Sanction",
    jurisdiction: "Hydraulic Engineer Department, MCGM",
    totalFee: "₹4,200",
    primaryDept: "Ward Hydraulic Office",
    cycleTime: "12 - 18 Business Days",
    nodes: [
      {
        id: "1",
        code: "WTR-01",
        title: "Property Assessment Tax Clearance",
        department: "MCGM Assessment & Collection",
        officeType: "Online",
        estimatedDays: "2 Business Days",
        fee: "₹0",
        officialUrl: "https://ptaxportal.mcgm.gov.in",
        documentsRequired: ["Property SAC Number", "Paid Tax Receipt for Current Year"],
        prerequisites: [],
        status: "available"
      },
      {
        id: "2",
        code: "WTR-02",
        title: "Licensed Plumber Internal Pipeline Blueprint",
        department: "Licensed Plumbing Services Cell",
        officeType: "Physical Ward Office",
        estimatedDays: "4 Business Days",
        fee: "₹800",
        officialUrl: "https://portal.mcgm.gov.in/water",
        documentsRequired: ["Internal Pipeline Blueprint", "Licensed Plumber Signature & ID"],
        prerequisites: ["1"],
        status: "locked"
      },
      {
        id: "3",
        code: "WTR-03",
        title: "Road Opening & Trenching Clearance",
        department: "MCGM Roads & Traffic Ward Desk",
        officeType: "Hybrid",
        estimatedDays: "5 Business Days",
        fee: "₹1,500",
        officialUrl: "https://portal.mcgm.gov.in",
        documentsRequired: ["Plumbing Route Map", "Traffic Police Ward NOC"],
        prerequisites: ["2"],
        status: "locked"
      },
      {
        id: "4",
        code: "WTR-04",
        title: "Final Water Meter Tapping & Connection Sanction",
        department: "Hydraulic Engineer Department",
        officeType: "Hybrid",
        estimatedDays: "5 Business Days",
        fee: "₹1,900",
        officialUrl: "https://portal.mcgm.gov.in/water-sanction",
        documentsRequired: ["Plumber Verification Report", "Road Trenching Payment Challan"],
        prerequisites: ["3"],
        status: "locked"
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" }
    ]
  },

  rooftop_solar: {
    id: "CIV-1007",
    title: "Grid-Connected Rooftop Solar Net Metering",
    jurisdiction: "MSEDCL (Mahavitaran) & MEDA",
    totalFee: "₹2,500",
    primaryDept: "Mahavitaran Renewable Energy Cell",
    cycleTime: "20 - 30 Business Days",
    nodes: [
      {
        id: "1",
        code: "SOL-01",
        title: "Sanctioned Load & Bill Dues Verification",
        department: "MSEDCL Customer Billing Portal",
        officeType: "Online",
        estimatedDays: "1 Business Day",
        fee: "₹0",
        officialUrl: "https://www.mahadiscom.in",
        documentsRequired: ["Latest Paid Electricity Bill", "Consumer 12-Digit Number"],
        prerequisites: [],
        status: "available"
      },
      {
        id: "2",
        code: "SOL-02",
        title: "Technical Feasibility Approval by DISCOM",
        department: "MSEDCL Sub-Division Office",
        officeType: "Online",
        estimatedDays: "7 Business Days",
        fee: "₹1,000",
        officialUrl: "https://solarrooftop.gov.in",
        documentsRequired: ["Roof Ownership Proof / Society NOC", "Proposed Solar Plant Capacity (kW)"],
        prerequisites: ["1"],
        status: "locked"
      },
      {
        id: "3",
        code: "SOL-03",
        title: "Plant Installation by Empanelled Vendor",
        department: "MNRE Empanelled EPC Agency",
        officeType: "Physical Ward Office",
        estimatedDays: "10 Business Days",
        fee: "₹0 (Equipment Cost Separate)",
        officialUrl: "https://mnre.gov.in",
        documentsRequired: ["Solar Inverter Serial Number", "Module Flash Test Reports", "Work Completion Report"],
        prerequisites: ["2"],
        status: "locked"
      },
      {
        id: "4",
        code: "SOL-04",
        title: "Electrical Inspector Inspection & Net Meter Testing",
        department: "Chief Electrical Inspectorate (CEI Maharashtra)",
        officeType: "Hybrid",
        estimatedDays: "5 Business Days",
        fee: "₹1,500",
        officialUrl: "https://www.mahadiscom.in",
        documentsRequired: ["CEI Inspection Certificate", "Earth Resistance Test Report"],
        prerequisites: ["3"],
        status: "locked"
      },
      {
        id: "5",
        code: "SOL-05",
        title: "Bi-Directional Meter Commissioning & PPA Signing",
        department: "MSEDCL Circle Office",
        officeType: "Hybrid",
        estimatedDays: "4 Business Days",
        fee: "₹0",
        officialUrl: "https://www.mahadiscom.in",
        documentsRequired: ["Signed Connection Agreement (PPA)", "Testing & Commissioning Certificate"],
        prerequisites: ["4"],
        status: "locked"
      }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" }
    ]
  }
};

/**
 * Intelligent Keyword Matcher for Search Console & Quick Demo Pills
 */
export function searchOrSynthesizePipeline(query = "", currentPipelines = INITIAL_PIPELINES) {
  const normalized = query.toLowerCase().trim();

  // 1. Check exact key matches
  if (currentPipelines[normalized]) {
    return { key: normalized, pipeline: currentPipelines[normalized], isDynamic: false };
  }

  // 2. Keyword routing to dedicated verified pipelines
  if (normalized.includes("cloud kitchen") || normalized.includes("bakery")) {
    return { key: "cloud_kitchen", pipeline: currentPipelines.cloud_kitchen || INITIAL_PIPELINES.cloud_kitchen, isDynamic: false };
  }
  if (normalized.includes("gumasta") || normalized.includes("shop act") || normalized.includes("establishment")) {
    return { key: "gumasta_license", pipeline: currentPipelines.gumasta_license || INITIAL_PIPELINES.gumasta_license, isDynamic: false };
  }
  if (normalized.includes("fssai") || normalized.includes("food") || normalized.includes("restaurant")) {
    return { key: "fssai_license", pipeline: currentPipelines.fssai_license || INITIAL_PIPELINES.fssai_license, isDynamic: false };
  }
  if (normalized.includes("fire") || normalized.includes("cfo") || normalized.includes("extinguisher")) {
    return { key: "fire_noc", pipeline: currentPipelines.fire_noc || INITIAL_PIPELINES.fire_noc, isDynamic: false };
  }
  if (normalized.includes("property") || normalized.includes("tax") || normalized.includes("mutation") || normalized.includes("sac")) {
    return { key: "property_tax", pipeline: currentPipelines.property_tax || INITIAL_PIPELINES.property_tax, isDynamic: false };
  }
  if (normalized.includes("solar") || normalized.includes("rooftop") || normalized.includes("msedcl") || normalized.includes("net meter") || normalized.includes("net-meter") || normalized.includes("pv")) {
    return { key: "rooftop_solar", pipeline: currentPipelines.rooftop_solar || INITIAL_PIPELINES.rooftop_solar, isDynamic: false };
  }
  if (normalized.includes("water") || normalized.includes("plumber") || normalized.includes("tapping") || normalized.includes("pipeline")) {
    return { key: "water_connection", pipeline: currentPipelines.water_connection || INITIAL_PIPELINES.water_connection, isDynamic: false };
  }

  // Default to Cloud Kitchen / Bakery as representative baseline
  return { key: "cloud_kitchen", pipeline: currentPipelines.cloud_kitchen || INITIAL_PIPELINES.cloud_kitchen, isDynamic: false };
}

export const PIPELINES = INITIAL_PIPELINES;