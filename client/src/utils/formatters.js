export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getComplianceStatus = (score) => {
  if (score >= 90) return { label: 'Excellent Compliance', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  if (score >= 75) return { label: 'Good Compliance', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  if (score >= 50) return { label: 'Needs Improvement', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  return { label: 'Poor Compliance', color: 'rose', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
};

export const getSeverityBadge = (severity) => {
  switch (severity) {
    case 'Critical':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'High':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Medium':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Low':
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export const getStatusBadge = (status) => {
  switch (status) {
    case 'Excellent':
    case 'Compliant':
    case 'Resolved':
    case 'Closed':
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Good':
    case 'In Progress':
    case 'Submitted':
    case 'Under Review':
    case 'Corrective Action Submitted':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Needs Improvement':
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Non-Compliant':
    case 'Open':
    case 'Overdue':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
};
