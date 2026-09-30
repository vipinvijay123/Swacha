/**
 * Calculates compliance scores from checklist items.
 * Points: Compliant = 2, Partially Compliant = 1, Non-Compliant = 0, Not Applicable = excluded from max.
 */
const calculateInspectionScores = (checklist) => {
  let totalObtained = 0;
  let totalMax = 0;

  const categoryTotals = {
    'Cleanliness & Hygiene': { obtained: 0, max: 0 },
    'Waste Management': { obtained: 0, max: 0 },
    'Water Management': { obtained: 0, max: 0 },
    'Energy Management': { obtained: 0, max: 0 },
    'Green Environment': { obtained: 0, max: 0 },
    'Sanitation': { obtained: 0, max: 0 },
    'Awareness & Sustainability': { obtained: 0, max: 0 },
  };

  checklist.forEach((item) => {
    if (item.status === 'Not Applicable') return;

    let pts = 0;
    if (item.status === 'Compliant') pts = 2;
    else if (item.status === 'Partially Compliant') pts = 1;
    else if (item.status === 'Non-Compliant') pts = 0;

    item.score = pts;
    totalObtained += pts;
    totalMax += 2;

    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = { obtained: 0, max: 0 };
    }
    categoryTotals[item.category].obtained += pts;
    categoryTotals[item.category].max += 2;
  });

  const compliancePercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  const categoryScores = {};
  Object.keys(categoryTotals).forEach((cat) => {
    const { obtained, max } = categoryTotals[cat];
    categoryScores[cat] = max > 0 ? Math.round((obtained / max) * 100) : 100;
  });

  return {
    totalScore: totalObtained,
    maxPossibleScore: totalMax,
    compliancePercentage,
    categoryScores,
  };
};

const getFacilityStatus = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Compliant';
  if (score >= 50) return 'Needs Improvement';
  return 'Non-Compliant';
};

module.exports = {
  calculateInspectionScores,
  getFacilityStatus,
};
