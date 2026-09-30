const User = require('../models/User');
const Facility = require('../models/Facility');
const ComplianceStandard = require('../models/ComplianceStandard');
const Inspection = require('../models/Inspection');
const Violation = require('../models/Violation');
const CorrectiveAction = require('../models/CorrectiveAction');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already contains users. Skipping auto-seed.');
      return;
    }

    console.log('[Seed] Auto-seeding initial demo data...');

    const adminUser = await User.create({
      name: 'Dr. Rajesh Verma (Admin)',
      email: 'admin@swachhta.gov.in',
      password: 'password123',
      role: 'admin',
      phone: '+91 98765 43210',
      status: 'active',
    });

    const inspectorUser = await User.create({
      name: 'Priya Sharma (Chief Inspector)',
      email: 'inspector@swachhta.gov.in',
      password: 'password123',
      role: 'inspector',
      phone: '+91 98765 43211',
      status: 'active',
    });

    const managerUser = await User.create({
      name: 'Amitabh Sen (Facility Director)',
      email: 'manager@swachhta.gov.in',
      password: 'password123',
      role: 'facility_manager',
      phone: '+91 98765 43212',
      status: 'active',
    });

    const standardsData = [
      // A. Cleanliness & Hygiene
      { code: 'STD-101', category: 'Cleanliness & Hygiene', criterion: 'Campus cleanliness and litter control', description: 'All corridors, common grounds, and pathways must be free of debris and dust.', maximumScore: 2 },
      { code: 'STD-102', category: 'Cleanliness & Hygiene', criterion: 'Toilet cleanliness and sanitation', description: 'Restrooms disinfected every 4 hours with visible cleaning logs.', maximumScore: 2 },
      { code: 'STD-103', category: 'Cleanliness & Hygiene', criterion: 'Handwashing facilities and soap availability', description: 'Touchless handwash units stocked with liquid soap.', maximumScore: 2 },
      { code: 'STD-104', category: 'Cleanliness & Hygiene', criterion: 'Dustbin availability and color coding', description: 'Dual/triple color-coded bins placed every 50 meters.', maximumScore: 2 },

      // B. Waste Management
      { code: 'STD-201', category: 'Waste Management', criterion: 'Source waste segregation (Wet/Dry/E-Waste)', description: 'Proper segregation bins at points of waste generation.', maximumScore: 2 },
      { code: 'STD-202', category: 'Waste Management', criterion: 'Composting of organic waste', description: 'Functional vermicompost or organic waste converter on-site.', maximumScore: 2 },
      { code: 'STD-203', category: 'Waste Management', criterion: 'Recycling of paper, plastic and metal', description: 'Tie-up with authorized recycling agencies.', maximumScore: 2 },
      { code: 'STD-204', category: 'Waste Management', criterion: 'Hazardous and biomedical waste handling', description: 'Safe disposal protocols for bio-medical or chemical waste.', maximumScore: 2 },

      // C. Water Management
      { code: 'STD-301', category: 'Water Management', criterion: 'Rainwater harvesting system functionality', description: 'Operable catchment basins and groundwater recharge pits.', maximumScore: 2 },
      { code: 'STD-302', category: 'Water Management', criterion: 'Water leakage monitoring and low-flow fixtures', description: 'Sensors or regular audits to fix pipe/tap leakages.', maximumScore: 2 },
      { code: 'STD-303', category: 'Water Management', criterion: 'Drinking water quality testing & filtration', description: 'Certified quarterly lab report of drinking water purity.', maximumScore: 2 },

      // D. Energy Management
      { code: 'STD-401', category: 'Energy Management', criterion: '100% LED lighting adoption', description: 'All indoor and outdoor fixtures upgraded to LED.', maximumScore: 2 },
      { code: 'STD-402', category: 'Energy Management', criterion: 'Rooftop solar PV installation', description: 'Solar energy generation covering at least 20% total load.', maximumScore: 2 },
      { code: 'STD-403', category: 'Energy Management', criterion: 'Energy-efficient star-rated HVAC and appliances', description: 'BLDC fans and 5-star rated AC units installed.', maximumScore: 2 },

      // E. Green Environment
      { code: 'STD-501', category: 'Green Environment', criterion: 'Green cover percentage (>30% campus area)', description: 'Maintained lawns, vertical gardens, and tree canopy.', maximumScore: 2 },
      { code: 'STD-502', category: 'Green Environment', criterion: 'Single-use plastic ban enforcement', description: 'Zero single-use plastic bottles or polythene permitted.', maximumScore: 2 },
      { code: 'STD-503', category: 'Green Environment', criterion: 'Native tree plantation drive & biodiversity', description: 'Botanical signage and native tree density.', maximumScore: 2 },

      // F. Sanitation
      { code: 'STD-601', category: 'Sanitation', criterion: 'Sewage treatment plant (STP) & greywater reuse', description: 'Treated water recycled for flushing and horticulture.', maximumScore: 2 },
      { code: 'STD-602', category: 'Sanitation', criterion: 'Drainage line clearance & vector control', description: 'Drains covered and free of stagnant water to prevent mosquitoes.', maximumScore: 2 },
      { code: 'STD-603', category: 'Sanitation', criterion: 'Incinerator for sanitary waste disposal', description: 'Eco-friendly disposal units in female restrooms.', maximumScore: 2 },

      // G. Awareness & Sustainability
      { code: 'STD-701', category: 'Awareness & Sustainability', criterion: 'Green audit & Swachhta student/staff workshops', description: 'Regular cleanliness drives and sustainability pledges.', maximumScore: 2 },
      { code: 'STD-702', category: 'Awareness & Sustainability', criterion: 'Display of eco-policy & environmental signage', description: 'Prominent boards educating occupants on energy & water saving.', maximumScore: 2 },
    ];

    const createdStandards = await ComplianceStandard.insertMany(standardsData);

    const facilitiesData = [
      {
        facilityId: 'FAC-101',
        name: 'Green Valley College',
        facilityType: 'Educational Institution',
        location: { address: 'Sector 62, Knowledge Park III', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
        manager: managerUser._id,
        contact: { person: 'Amitabh Sen', email: 'manager@swachhta.gov.in', phone: '+91 98765 43212' },
        numberOfOccupants: 4500,
        description: 'Premier eco-campus spanning 45 acres with rooftop solar and organic gardens.',
        complianceScore: 88,
        status: 'Compliant',
        categoryScores: {
          'Cleanliness & Hygiene': 92,
          'Waste Management': 90,
          'Water Management': 85,
          'Energy Management': 88,
          'Green Environment': 94,
          'Sanitation': 84,
          'Awareness & Sustainability': 85,
        },
        lastInspectionDate: new Date('2026-09-15'),
      },
      {
        facilityId: 'FAC-102',
        name: 'City Municipal Office',
        facilityType: 'Government Office',
        location: { address: 'Civic Centre, M.G. Road', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
        manager: managerUser._id,
        contact: { person: 'S. K. Gupta', email: 'civic@delhi.gov.in', phone: '+91 11 2345 6789' },
        numberOfOccupants: 1200,
        description: 'Central administrative headquarters handling civic administration.',
        complianceScore: 72,
        status: 'Needs Improvement',
        categoryScores: {
          'Cleanliness & Hygiene': 70,
          'Waste Management': 65,
          'Water Management': 75,
          'Energy Management': 80,
          'Green Environment': 60,
          'Sanitation': 72,
          'Awareness & Sustainability': 82,
        },
        lastInspectionDate: new Date('2026-09-10'),
      },
      {
        facilityId: 'FAC-103',
        name: 'EcoTech Industrial Park',
        facilityType: 'Commercial & Industrial',
        location: { address: 'Plot 45, Electronic City Phase 1', city: 'Bengaluru', state: 'Karnataka', pincode: '560100' },
        manager: managerUser._id,
        contact: { person: 'Rohan Mehra', email: 'facility@ecotech.com', phone: '+91 80 4455 6677' },
        numberOfOccupants: 8000,
        description: 'High-tech IT and manufacturing hub certified for zero liquid discharge.',
        complianceScore: 94,
        status: 'Excellent',
        categoryScores: {
          'Cleanliness & Hygiene': 96,
          'Waste Management': 95,
          'Water Management': 92,
          'Energy Management': 96,
          'Green Environment': 92,
          'Sanitation': 94,
          'Awareness & Sustainability': 90,
        },
        lastInspectionDate: new Date('2026-09-18'),
      },
      {
        facilityId: 'FAC-104',
        name: 'Sunrise Public School',
        facilityType: 'Educational Institution',
        location: { address: 'Block C, Vasant Kunj', city: 'New Delhi', state: 'Delhi', pincode: '110070' },
        manager: managerUser._id,
        contact: { person: 'Meenakshi Iyer', email: 'info@sunriseschool.edu', phone: '+91 11 2689 1234' },
        numberOfOccupants: 2200,
        description: 'Senior secondary school with dedicated Herbal Garden and Swachhta Club.',
        complianceScore: 81,
        status: 'Compliant',
        categoryScores: {
          'Cleanliness & Hygiene': 85,
          'Waste Management': 82,
          'Water Management': 78,
          'Energy Management': 80,
          'Green Environment': 86,
          'Sanitation': 80,
          'Awareness & Sustainability': 84,
        },
        lastInspectionDate: new Date('2026-09-05'),
      },
      {
        facilityId: 'FAC-105',
        name: 'Community Health Centre',
        facilityType: 'Healthcare Facility',
        location: { address: 'Hospital Road, Civil Lines', city: 'Jaipur', state: 'Rajasthan', pincode: '302006' },
        manager: managerUser._id,
        contact: { person: 'Dr. Neha Sharma', email: 'chc@jaipurhealth.org', phone: '+91 141 236 7890' },
        numberOfOccupants: 650,
        description: '100-bed government public hospital facility with specialized biomedical waste unit.',
        complianceScore: 48,
        status: 'Non-Compliant',
        categoryScores: {
          'Cleanliness & Hygiene': 45,
          'Waste Management': 40,
          'Water Management': 55,
          'Energy Management': 60,
          'Green Environment': 50,
          'Sanitation': 42,
          'Awareness & Sustainability': 44,
        },
        lastInspectionDate: new Date('2026-09-02'),
      },
    ];

    const createdFacilities = await Facility.insertMany(facilitiesData);

    const inspectionsData = [
      {
        inspectionId: 'INSP-1001',
        facility: createdFacilities[0]._id,
        inspector: inspectorUser._id,
        inspectionType: 'Routine',
        inspectionDate: new Date('2026-09-15'),
        checklist: createdStandards.map((std, idx) => ({
          standard: std._id,
          category: std.category,
          criterion: std.criterion,
          score: idx % 4 === 0 ? 1 : 2,
          status: idx % 4 === 0 ? 'Partially Compliant' : 'Compliant',
          remarks: idx % 4 === 0 ? 'Requires minor maintenance or upgrading.' : 'Exceeds standard guidelines.',
          evidencePhotos: [],
        })),
        totalScore: 38,
        maxPossibleScore: 42,
        compliancePercentage: 88,
        remarks: 'Overall impressive cleanliness and green practices across campus. Water harvesting pit cleared.',
        evidence: [],
      },
      {
        inspectionId: 'INSP-1002',
        facility: createdFacilities[1]._id,
        inspector: inspectorUser._id,
        inspectionType: 'Surprise',
        inspectionDate: new Date('2026-09-10'),
        checklist: createdStandards.map((std, idx) => ({
          standard: std._id,
          category: std.category,
          criterion: std.criterion,
          score: idx % 3 === 0 ? 0 : 1,
          status: idx % 3 === 0 ? 'Non-Compliant' : 'Partially Compliant',
          remarks: idx % 3 === 0 ? 'Dustbins overflowing, wet waste not segregated.' : 'Adequate.',
          evidencePhotos: [],
        })),
        totalScore: 28,
        maxPossibleScore: 42,
        compliancePercentage: 72,
        remarks: 'Surprise audit highlighted severe deficiencies in waste segregation and restroom sanitation.',
        evidence: [],
      },
      {
        inspectionId: 'INSP-1003',
        facility: createdFacilities[4]._id,
        inspector: inspectorUser._id,
        inspectionType: 'Special',
        inspectionDate: new Date('2026-09-02'),
        checklist: createdStandards.map((std, idx) => ({
          standard: std._id,
          category: std.category,
          criterion: std.criterion,
          score: idx % 2 === 0 ? 0 : 1,
          status: idx % 2 === 0 ? 'Non-Compliant' : 'Partially Compliant',
          remarks: 'Critical hygiene concern in public patient waiting areas.',
          evidencePhotos: [],
        })),
        totalScore: 20,
        maxPossibleScore: 42,
        compliancePercentage: 48,
        remarks: 'High risk status. Urgent notice issued for biomedical waste segregation and drainage cleanout.',
        evidence: [],
      },
    ];

    const createdInspections = await Inspection.insertMany(inspectionsData);

    const violationsData = [
      {
        violationId: 'VIO-101',
        facility: createdFacilities[4]._id,
        inspection: createdInspections[2]._id,
        category: 'Waste Management',
        description: 'Biomedical waste yellow bags found mixed with general municipal waste near OPD entrance.',
        severity: 'Critical',
        reportedDate: new Date('2026-09-02'),
        dueDate: new Date('2026-09-07'),
        assignedTo: managerUser._id,
        status: 'Open',
      },
      {
        violationId: 'VIO-102',
        facility: createdFacilities[1]._id,
        inspection: createdInspections[1]._id,
        category: 'Sanitation',
        description: 'Ground floor public toilets suffering from clogged drainage and broken soap dispensers.',
        severity: 'High',
        reportedDate: new Date('2026-09-10'),
        dueDate: new Date('2026-09-17'),
        assignedTo: managerUser._id,
        status: 'Under Review',
      },
      {
        violationId: 'VIO-103',
        facility: createdFacilities[1]._id,
        inspection: createdInspections[1]._id,
        category: 'Energy Management',
        description: 'Inefficient conventional halogen lights remaining switched on during daylight hours.',
        severity: 'Medium',
        reportedDate: new Date('2026-09-10'),
        dueDate: new Date('2026-09-25'),
        assignedTo: managerUser._id,
        status: 'Corrective Action Submitted',
      },
      {
        violationId: 'VIO-104',
        facility: createdFacilities[0]._id,
        inspection: createdInspections[0]._id,
        category: 'Water Management',
        description: 'Minor drip leakages detected in Block C second floor washbasin line.',
        severity: 'Low',
        reportedDate: new Date('2026-09-15'),
        dueDate: new Date('2026-09-28'),
        assignedTo: managerUser._id,
        status: 'Resolved',
      },
    ];

    const createdViolations = await Violation.insertMany(violationsData);

    const actionsData = [
      {
        actionId: 'ACT-101',
        violation: createdViolations[0]._id,
        facility: createdFacilities[4]._id,
        actionRequired: 'Install locked bio-hazard waste storage containers and conduct staff training.',
        assignedTo: managerUser._id,
        targetDate: new Date('2026-09-07'),
        status: 'Overdue',
        remarks: 'Target date passed. Escalated to Health Department Director.',
      },
      {
        actionId: 'ACT-102',
        violation: createdViolations[1]._id,
        facility: createdFacilities[1]._id,
        actionRequired: 'Plumbing overhaul for ground floor toilets and installation of sensor soap pumps.',
        assignedTo: managerUser._id,
        targetDate: new Date('2026-09-17'),
        status: 'In Progress',
        remarks: 'Contractor appointed. Repair work initiated on 14th Sept.',
      },
      {
        actionId: 'ACT-103',
        violation: createdViolations[2]._id,
        facility: createdFacilities[1]._id,
        actionRequired: 'Replace 50 halogen bulbs with automatic motion-sensor 15W LED panel lights.',
        assignedTo: managerUser._id,
        targetDate: new Date('2026-09-25'),
        status: 'Submitted',
        remarks: 'LED procurement and fitting completed. Proof photos uploaded for review.',
      },
      {
        actionId: 'ACT-104',
        violation: createdViolations[3]._id,
        facility: createdFacilities[0]._id,
        actionRequired: 'Replace damaged washers and seal joints in Block C washbasins.',
        assignedTo: managerUser._id,
        targetDate: new Date('2026-09-28'),
        completionDate: new Date('2026-09-16'),
        status: 'Completed',
        remarks: 'Plumbing audit completed. Zero leakage confirmed by maintenance team.',
      },
    ];

    await CorrectiveAction.insertMany(actionsData);

    await Notification.insertMany([
      {
        user: adminUser._id,
        title: 'Critical Violation Alert',
        message: 'Biomedical waste handling violation reported at Community Health Centre.',
        type: 'danger',
        link: '/violations',
        read: false,
      },
      {
        user: managerUser._id,
        title: 'Corrective Action Overdue',
        message: 'Action ACT-101 for Community Health Centre is overdue.',
        type: 'warning',
        link: '/corrective-actions',
        read: false,
      },
      {
        user: adminUser._id,
        title: 'Inspection Completed',
        message: 'Routine inspection completed for Green Valley College (Score: 88%).',
        type: 'success',
        link: '/inspections',
        read: true,
      },
    ]);

    console.log('[Seed] Auto-seed complete!');
  } catch (err) {
    console.error(`[Seed Error]: ${err.message}`);
  }
};

module.exports = seedData;
