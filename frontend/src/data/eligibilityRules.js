/**
 * Lightweight, keyword-driven eligibility engine.
 * A short questionnaire tailors which clearances apply and adds informational
 * notes. Results are advisory only and never mutate the underlying pipeline.
 */

export const ELIGIBILITY_QUESTIONS = [
  {
    id: 'structure',
    label: 'Business structure',
    options: ['Proprietorship', 'Partnership', 'Pvt Ltd / LLP'],
  },
  {
    id: 'premises',
    label: 'Premises',
    options: ['Owned', 'Rented / Leased'],
  },
  {
    id: 'turnover',
    label: 'Expected annual turnover',
    options: ['Under ₹12 lakh', '₹12 lakh – ₹20 crore', 'Over ₹20 crore'],
  },
  {
    id: 'staff',
    label: 'Number of employees',
    options: ['Just me', '1 – 9', '10 or more'],
  },
];

const has = (node, ...keywords) => {
  const t = `${node.title || ''} ${node.code || ''}`.toLowerCase();
  return keywords.some((k) => t.includes(k));
};

/**
 * Evaluate answers against the pipeline's nodes.
 * @returns { summary: string[], nodeNotes: { [nodeId]: { tone, note } } }
 */
export function evaluateEligibility(pipeline, answers = {}) {
  const nodes = pipeline?.nodes || [];
  const summary = [];
  const nodeNotes = {};

  const addNote = (predicate, note, tone = 'info') => {
    nodes.forEach((n) => {
      if (predicate(n)) nodeNotes[n.id] = { tone, note };
    });
  };

  // Premises
  if (answers.premises === 'Rented / Leased') {
    summary.push('Rented premises: keep a registered rent agreement and a landlord NOC ready — several steps require them.');
    addNote((n) => has(n, 'gumasta', 'establishment', 'tenancy', 'premises', 'trade'), 'You selected rented premises → a registered rent agreement + landlord NOC are typically mandatory here.');
  } else if (answers.premises === 'Owned') {
    summary.push('Owned premises: keep the property tax receipt / ownership index-II handy instead of a rent agreement.');
  }

  // Structure
  if (answers.structure === 'Partnership' || answers.structure === 'Pvt Ltd / LLP') {
    summary.push(`${answers.structure}: carry the partnership deed / incorporation certificate and authorised-signatory proof.`);
    addNote((n) => has(n, 'registration', 'kyc', 'establishment', 'gumasta'), `As a ${answers.structure.toLowerCase()}, attach the partnership deed / incorporation certificate here.`);
  }

  // Turnover — FSSAI tiering
  if (answers.turnover) {
    if (answers.turnover === 'Under ₹12 lakh') {
      summary.push('Turnover under ₹12L: FSSAI Basic Registration applies (not the State/Central licence).');
      addNote((n) => has(n, 'fssai', 'food'), 'At your turnover, FSSAI Basic Registration (₹100/yr) applies — not the State licence.');
    } else if (answers.turnover === 'Over ₹20 crore') {
      summary.push('Turnover over ₹20Cr: you need an FSSAI Central Licence, not the State licence.');
      addNote((n) => has(n, 'fssai', 'food'), 'At your turnover, an FSSAI Central Licence is required (higher fee, longer SLA).');
    } else {
      addNote((n) => has(n, 'fssai', 'food'), 'At your turnover, an FSSAI State Licence typically applies.');
    }
  }

  // Staff — Shops & Establishment nuance
  if (answers.staff === 'Just me') {
    summary.push('Owner-only: some states exempt zero-employee shops from parts of the Shops & Establishment Act — registration is still recommended.');
    addNote((n) => has(n, 'gumasta', 'establishment'), 'Owner-only businesses may get relaxed Shops & Establishment requirements — still recommended to register.');
  }

  if (!summary.length) {
    summary.push('Based on your answers, the standard pathway below applies. Keep identity and premises proofs ready.');
  }

  return { summary, nodeNotes };
}
