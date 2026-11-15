import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Initial seed data generator
function getInitialData() {
  const now = new Date().toISOString();

  // 1. Users (Employees & Teams)
  const users = [
    {
      id: 'USR-SA-01',
      name: 'Rajesh Sharma (Admin)',
      email: 'admin@kycops.enterprise',
      password: 'admin', // for demo verification
      role: 'Super Admin',
      team: 'Executive',
      phone: '9876543210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isAvailable: true,
      activeLoad: 0,
      createdAt: now
    },
    {
      id: 'USR-TL-KYC',
      name: 'Ananya Deshmukh (TL KYC)',
      email: 'tl.kyc@kycops.enterprise',
      password: 'password',
      role: 'KYC TL',
      team: 'KYC Team',
      phone: '9823456789',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      isAvailable: true,
      activeLoad: 1,
      createdAt: now
    },
    {
      id: 'USR-AG-KYC1',
      name: 'Vikram Verma',
      email: 'vikram.kyc@kycops.enterprise',
      password: 'password',
      role: 'KYC Agent',
      team: 'KYC Team',
      phone: '9811223344',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isAvailable: true,
      activeLoad: 3,
      createdAt: now
    },
    {
      id: 'USR-AG-KYC2',
      name: 'Priya Sundaram',
      email: 'priya.kyc@kycops.enterprise',
      password: 'password',
      role: 'KYC Agent',
      team: 'KYC Team',
      phone: '9845112233',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      isAvailable: true,
      activeLoad: 2,
      createdAt: now
    },
    {
      id: 'USR-TL-PAY',
      name: 'Suresh Menon (TL Payments)',
      email: 'tl.pay@kycops.enterprise',
      password: 'password',
      role: 'Payments TL',
      team: 'Payments Team',
      phone: '9900112233',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isAvailable: true,
      activeLoad: 1,
      createdAt: now
    },
    {
      id: 'USR-AG-PAY1',
      name: 'Neha Kapoor',
      email: 'neha.pay@kycops.enterprise',
      password: 'password',
      role: 'Payments Agent',
      team: 'Payments Team',
      phone: '9988776655',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isAvailable: true,
      activeLoad: 4,
      createdAt: now
    },
    {
      id: 'USR-TL-QRY',
      name: 'Kavita Patel (TL Queries)',
      email: 'tl.query@kycops.enterprise',
      password: 'password',
      role: 'Queries TL',
      team: 'Queries Team',
      phone: '9765432109',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      isAvailable: true,
      activeLoad: 1,
      createdAt: now
    },
    {
      id: 'USR-AG-QRY1',
      name: 'Rohan Joshi',
      email: 'rohan.query@kycops.enterprise',
      password: 'password',
      role: 'Queries Agent',
      team: 'Queries Team',
      phone: '9123456780',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      isAvailable: true,
      activeLoad: 2,
      createdAt: now
    }
  ];

  // 2. KYC Applications (across user categories: Vendor, Customer, Agent, Manager, Delivery Partner, Technician)
  const kycRecords = [
    {
      id: 'KYC-2026-1001',
      applicationNo: 'APP-VND-8891',
      category: 'Vendor',
      fullName: 'Aarav Agro Fresh Ltd (Aditya Mehta)',
      businessName: 'Aarav Agro Fresh',
      email: 'contact@aaravagro.com',
      mobile: '9822334455',
      bankAccountNo: '918273645012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      status: 'Pending', // Pending, Approved, Rejected
      assignedTo: 'USR-AG-KYC1',
      assignedName: 'Vikram Verma',
      rejectionReason: null,
      reviewedAt: null,
      reviewedBy: null,
      submittedAt: '2026-11-09T09:30:00Z',
      activityHistory: [
        {
          action: 'SUBMITTED',
          actorName: 'Aditya Mehta',
          actorRole: 'Applicant',
          timestamp: '2026-11-09T09:30:00Z',
          details: 'Application and documents submitted for verification.'
        },
        {
          action: 'ASSIGNED',
          actorName: 'System Auto-Dispatcher',
          actorRole: 'System',
          timestamp: '2026-11-09T09:30:05Z',
          details: 'Auto-assigned to Vikram Verma (KYC Team).'
        }
      ],
      documents: [
        { type: 'PAN Card', docNo: 'ABCDE1234F', fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', verified: true },
        { type: 'GST Certificate', docNo: '27AABCU9603R1ZM', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', verified: false },
        { type: 'Bank Passbook / Cancelled Cheque', docNo: 'CHQ-990812', fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800', verified: true }
      ],
      address: 'Shop 14, APMC Market, Vashi, Navi Mumbai, MH 400703',
      paymentProfile: {
        vendorCycle: 'Cycle 1 (1st-15th)',
        fee: 1000
      }
    },
    {
      id: 'KYC-2026-1002',
      applicationNo: 'APP-CST-4412',
      category: 'Customer',
      fullName: 'Sunita Mehra',
      businessName: 'N/A (Individual)',
      email: 'sunita.mehra@gmail.com',
      mobile: '9871122334',
      bankAccountNo: '10982345671',
      ifscCode: 'SBIN0000691',
      bankName: 'State Bank of India',
      status: 'Approved',
      assignedTo: 'USR-AG-KYC2',
      assignedName: 'Priya Sundaram',
      rejectionReason: null,
      reviewedAt: '2026-11-10T14:15:00Z',
      reviewedBy: 'USR-AG-KYC2',
      submittedAt: '2026-11-08T11:20:00Z',
      activityHistory: [
        {
          action: 'SUBMITTED',
          actorName: 'Sunita Mehra',
          actorRole: 'Applicant',
          timestamp: '2026-11-08T11:20:00Z',
          details: 'Application and ID documents submitted.'
        },
        {
          action: 'APPROVED',
          actorName: 'Priya Sundaram',
          actorRole: 'KYC Agent',
          timestamp: '2026-11-10T14:15:00Z',
          details: 'All identity and banking credentials verified successfully.'
        }
      ],
      documents: [
        { type: 'Aadhaar Card', docNo: '5421-9876-1234', fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', verified: true },
        { type: 'PAN Card', docNo: 'BQWPM9912K', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', verified: true }
      ],
      address: 'Flat 402, Green Palms, Powai, Mumbai, MH 400076',
      paymentProfile: {
        plan: 'Premium Gold Membership',
        fee: 499
      }
    },
    {
      id: 'KYC-2026-1003',
      applicationNo: 'APP-AGT-2041',
      category: 'Agent',
      fullName: 'Mohd Tariq Khan',
      businessName: 'Tariq Financial Services',
      email: 'tariq.agent@connect.in',
      mobile: '8877665544',
      bankAccountNo: '50100234567890',
      ifscCode: 'ICIC0000045',
      bankName: 'ICICI Bank',
      status: 'Pending',
      assignedTo: 'USR-AG-KYC1',
      assignedName: 'Vikram Verma',
      rejectionReason: null,
      reviewedAt: null,
      reviewedBy: null,
      submittedAt: '2026-11-10T16:00:00Z',
      activityHistory: [
        {
          action: 'SUBMITTED',
          actorName: 'Mohd Tariq Khan',
          actorRole: 'Applicant',
          timestamp: '2026-11-10T16:00:00Z',
          details: 'Agent registration documents submitted.'
        }
      ],
      documents: [
        { type: 'Aadhaar Card', docNo: '7823-1122-3344', fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', verified: false },
        { type: 'PAN Card', docNo: 'ALIPK8721M', fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800', verified: false }
      ],
      address: '22/B MG Road, Civil Lines, Kanpur, UP 208001',
      paymentProfile: {
        plan: 'Monthly Agent Retainer',
        fee: 3500
      }
    },
    {
      id: 'KYC-2026-1004',
      applicationNo: 'APP-MGR-3190',
      category: 'Manager',
      fullName: 'Deepak Singhal',
      businessName: 'Regional Ops Hub',
      email: 'deepak.manager@kycops.internal',
      mobile: '7766554433',
      bankAccountNo: '62451009876',
      ifscCode: 'PUNB0123400',
      bankName: 'Punjab National Bank',
      status: 'Approved',
      assignedTo: 'USR-TL-KYC',
      assignedName: 'Ananya Deshmukh (TL KYC)',
      rejectionReason: null,
      reviewedAt: '2026-11-09T18:00:00Z',
      reviewedBy: 'USR-TL-KYC',
      submittedAt: '2026-11-07T10:00:00Z',
      activityHistory: [
        {
          action: 'SUBMITTED',
          actorName: 'Deepak Singhal',
          actorRole: 'Applicant',
          timestamp: '2026-11-07T10:00:00Z',
          details: 'Manager credentials and address proof uploaded.'
        },
        {
          action: 'APPROVED',
          actorName: 'Ananya Deshmukh (TL KYC)',
          actorRole: 'KYC TL',
          timestamp: '2026-11-09T18:00:00Z',
          details: 'Managerial clearance verified.'
        }
      ],
      documents: [
        { type: 'PAN Card', docNo: 'BZXPS4410K', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', verified: true },
        { type: 'Proof of Address', docNo: 'ELEC-887123', fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800', verified: true }
      ],
      address: 'Plot 88, Sector 18, Gurugram, HR 122015',
      paymentProfile: {
        plan: 'Manager Payroll & Compliance',
        fee: 45000
      }
    },
    {
      id: 'KYC-2026-1005',
      applicationNo: 'APP-DEL-9082',
      category: 'Delivery Partner',
      fullName: 'Ganesh Shinde',
      businessName: 'Express Logistics fleet',
      email: 'ganesh.delivery@gmail.com',
      mobile: '9123456789',
      bankAccountNo: '331002938475',
      ifscCode: 'BARB0POWAIX',
      bankName: 'Bank of Baroda',
      status: 'Rejected',
      assignedTo: 'USR-AG-KYC2',
      assignedName: 'Priya Sundaram',
      rejectionReason: 'Driving License copy is blurry and expiry date is not clearly legible. Please upload a high-resolution scan.',
      reviewedAt: '2026-11-10T12:00:00Z',
      reviewedBy: 'USR-AG-KYC2',
      submittedAt: '2026-11-09T08:15:00Z',
      activityHistory: [
        {
          action: 'SUBMITTED',
          actorName: 'Ganesh Shinde',
          actorRole: 'Applicant',
          timestamp: '2026-11-09T08:15:00Z',
          details: 'Application submitted with Driving License and Aadhaar.'
        },
        {
          action: 'REJECTED',
          actorName: 'Priya Sundaram',
          actorRole: 'KYC Agent',
          timestamp: '2026-11-10T12:00:00Z',
          details: 'Rejected: Driving License copy is blurry and expiry date is not clearly legible. Please upload a high-resolution scan.'
        }
      ],
      documents: [
        { type: 'Driving License', docNo: 'MH-03-20180029', fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', verified: false },
        { type: 'Aadhaar Card', docNo: '9988-7766-5544', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', verified: true }
      ],
      address: 'Chawl No. 4, Kurla West, Mumbai, MH 400070',
      paymentProfile: {
        plan: 'Weekly Payout & Mileage Tracking',
        fee: 6500
      }
    },
    {
      id: 'KYC-2026-1006',
      applicationNo: 'APP-TCH-5510',
      category: 'Technician',
      fullName: 'Arun Balakrishnan',
      businessName: 'Precision Tech Services',
      email: 'arun.tech@balakrishnan.me',
      mobile: '6382109876',
      bankAccountNo: '88123450912',
      ifscCode: 'UTIB0000125',
      bankName: 'Axis Bank',
      status: 'Pending',
      assignedTo: 'USR-AG-KYC1',
      assignedName: 'Vikram Verma',
      rejectionReason: null,
      reviewedAt: null,
      reviewedBy: null,
      submittedAt: '2026-11-11T09:00:00Z',
      activityHistory: [
        {
          action: 'SUBMITTED',
          actorName: 'Arun Balakrishnan',
          actorRole: 'Applicant',
          timestamp: '2026-11-11T09:00:00Z',
          details: 'Technician certification submitted for verification.'
        }
      ],
      documents: [
        { type: 'Technician Trade License / Cert', docNo: 'ITI-ELE-2021-99', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', verified: true },
        { type: 'Aadhaar Card', docNo: '3322-1144-5566', fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', verified: false }
      ],
      address: '15 Anna Nagar, Main Road, Chennai, TN 600040',
      paymentProfile: {
        plan: 'Monthly Service & Support Retainer',
        fee: 12000
      }
    }
  ];

  // 3. Payments & Subscription Cycles
  // Vendors: ₹1,000 monthly subscription with 2 payment cycles per month (Cycle 1: 1st-15th ₹500, Cycle 2: 16th-End ₹500, or ₹1,000 billed bi-monthly)
  const payments = [
    {
      id: 'PAY-TXN-9001',
      category: 'Vendor',
      kycRefId: 'KYC-2026-1001',
      recipientName: 'Aarav Agro Fresh Ltd',
      beneficiaryPhone: '9822334455',
      bankAccountNo: '918273645012',
      ifscCode: 'HDFC0001234',
      amount: 500,
      monthlyFee: 1000,
      cycle: 'Cycle 1 (Nov 1 - Nov 15, 2026)',
      status: 'Paid', // Paid, Pending, Failed
      paymentDate: '2026-11-05T10:30:00Z',
      paymentMethod: 'UPI / NetBanking',
      referenceNo: 'UPI-REF-98129034',
      assignedTo: 'USR-AG-PAY1',
      assignedName: 'Neha Kapoor',
      notes: 'Automated recurring cycle deduction verified.'
    },
    {
      id: 'PAY-TXN-9002',
      category: 'Vendor',
      kycRefId: 'KYC-2026-1001',
      recipientName: 'Aarav Agro Fresh Ltd',
      beneficiaryPhone: '9822334455',
      bankAccountNo: '918273645012',
      ifscCode: 'HDFC0001234',
      amount: 500,
      monthlyFee: 1000,
      cycle: 'Cycle 2 (Nov 16 - Nov 30, 2026)',
      status: 'Pending',
      paymentDate: null,
      dueDate: '2026-11-20',
      paymentMethod: 'Auto-Debit Nach',
      referenceNo: 'PEND-CYC2-8821',
      assignedTo: 'USR-AG-PAY1',
      assignedName: 'Neha Kapoor',
      notes: 'Upcoming scheduled debit.'
    },
    {
      id: 'PAY-TXN-9003',
      category: 'Customer',
      kycRefId: 'KYC-2026-1002',
      recipientName: 'Sunita Mehra',
      beneficiaryPhone: '9871122334',
      bankAccountNo: '10982345671',
      ifscCode: 'SBIN0000691',
      amount: 499,
      monthlyFee: 499,
      cycle: 'Monthly Membership (Nov 2026)',
      status: 'Paid',
      paymentDate: '2026-11-10T14:20:00Z',
      paymentMethod: 'Credit Card (Visa)',
      referenceNo: 'PG-STRIPE-881920',
      assignedTo: 'USR-AG-PAY1',
      assignedName: 'Neha Kapoor',
      notes: 'Auto-transitioned from approved KYC application.'
    },
    {
      id: 'PAY-TXN-9004',
      category: 'Agent',
      kycRefId: 'KYC-2026-1003',
      recipientName: 'Mohd Tariq Khan',
      beneficiaryPhone: '8877665544',
      bankAccountNo: '50100234567890',
      ifscCode: 'ICIC0000045',
      amount: 3500,
      monthlyFee: 3500,
      cycle: 'Monthly Retainer (Nov 2026)',
      status: 'Pending',
      dueDate: '2026-11-15',
      paymentDate: null,
      paymentMethod: 'Direct NEFT',
      referenceNo: 'NEFT-INIT-3321',
      assignedTo: 'USR-TL-PAY',
      assignedName: 'Suresh Menon (TL Payments)',
      notes: 'Awaiting KYC clearance before release.'
    },
    {
      id: 'PAY-TXN-9005',
      category: 'Manager',
      kycRefId: 'KYC-2026-1004',
      recipientName: 'Deepak Singhal',
      beneficiaryPhone: '7766554433',
      bankAccountNo: '62451009876',
      ifscCode: 'PUNB0123400',
      amount: 45000,
      monthlyFee: 45000,
      cycle: 'Managerial Compensation (Oct 2026)',
      status: 'Paid',
      paymentDate: '2026-11-01T09:00:00Z',
      paymentMethod: 'Corporate RTGS',
      referenceNo: 'RTGS-CORP-992182',
      assignedTo: 'USR-TL-PAY',
      assignedName: 'Suresh Menon (TL Payments)',
      notes: 'Approved and disbursed.'
    },
    {
      id: 'PAY-TXN-9006',
      category: 'Delivery Partner',
      kycRefId: 'KYC-2026-1005',
      recipientName: 'Ganesh Shinde',
      beneficiaryPhone: '9123456789',
      bankAccountNo: '331002938475',
      ifscCode: 'BARB0POWAIX',
      amount: 6500,
      monthlyFee: 6500,
      cycle: 'Weekly Mileage & Deliveries (W1 Nov)',
      status: 'Failed',
      paymentDate: '2026-11-08T11:10:00Z',
      paymentMethod: 'IMPS',
      referenceNo: 'IMPS-FL-40019',
      assignedTo: 'USR-AG-PAY1',
      assignedName: 'Neha Kapoor',
      notes: 'Transaction bounced: KYC rejection triggered temporary hold.'
    },
    {
      id: 'PAY-TXN-9007',
      category: 'Technician',
      kycRefId: 'KYC-2026-1006',
      recipientName: 'Arun Balakrishnan',
      beneficiaryPhone: '6382109876',
      bankAccountNo: '88123450912',
      ifscCode: 'UTIB0000125',
      amount: 12000,
      monthlyFee: 12000,
      cycle: 'Monthly Retainer (Nov 2026)',
      status: 'Pending',
      dueDate: '2026-11-18',
      paymentDate: null,
      paymentMethod: 'Bank Transfer',
      referenceNo: 'PEND-TCH-1200',
      assignedTo: 'USR-TL-PAY',
      assignedName: 'Suresh Menon (TL Payments)',
      notes: 'Scheduled for bi-monthly run.'
    }
  ];

  // 4. Queries Ticketing Management
  const queries = [
    {
      id: 'QRY-2026-501',
      ticketNo: 'TCK-8812',
      category: 'Vendor',
      subject: 'Inquiry on Cycle 2 invoice generation for ₹1,000 monthly tier',
      userFullName: 'Aditya Mehta (Aarav Agro)',
      userEmail: 'contact@aaravagro.com',
      mobile: '9822334455',
      priority: 'High', // High, Medium, Low
      status: 'In Progress', // Open, In Progress, Resolved
      assignedTo: 'USR-AG-QRY1',
      assignedName: 'Rohan Joshi',
      createdAt: '2026-11-10T10:00:00Z',
      resolvedAt: null,
      resolutionTimeMin: null,
      messages: [
        {
          sender: 'Aditya Mehta',
          senderType: 'Customer',
          message: 'Hello, our GST invoice for Cycle 1 is downloaded, but how do we preview upcoming Cycle 2 deductions on the portal?',
          time: '2026-11-10T10:00:00Z'
        },
        {
          sender: 'Rohan Joshi',
          senderType: 'Agent',
          message: 'Hello Aditya! The Cycle 2 invoice generates automatically on the 16th of each calendar month. We have verified your mandate is active.',
          time: '2026-11-10T10:45:00Z'
        }
      ]
    },
    {
      id: 'QRY-2026-502',
      ticketNo: 'TCK-8813',
      category: 'Customer',
      subject: 'Aadhaar document verification timeline query',
      userFullName: 'Sunita Mehra',
      userEmail: 'sunita.mehra@gmail.com',
      mobile: '9871122334',
      priority: 'Medium',
      status: 'Resolved',
      assignedTo: 'USR-TL-QRY',
      assignedName: 'Kavita Patel (TL Queries)',
      createdAt: '2026-11-09T14:00:00Z',
      resolvedAt: '2026-11-09T15:20:00Z',
      resolutionTimeMin: 80,
      messages: [
        {
          sender: 'Sunita Mehra',
          senderType: 'Customer',
          message: 'Can you please let me know how long the verification takes once documents are uploaded?',
          time: '2026-11-09T14:00:00Z'
        },
        {
          sender: 'Kavita Patel',
          senderType: 'Agent',
          message: 'Standard KYC turnaround time is within 2 to 4 business hours. Your account has now been approved!',
          time: '2026-11-09T15:20:00Z'
        }
      ]
    },
    {
      id: 'QRY-2026-503',
      ticketNo: 'TCK-8814',
      category: 'Delivery Partner',
      subject: 'Clarification on rejection reason for Driving License',
      userFullName: 'Ganesh Shinde',
      userEmail: 'ganesh.delivery@gmail.com',
      mobile: '9123456789',
      priority: 'Urgent',
      status: 'Open',
      assignedTo: 'USR-AG-QRY1',
      assignedName: 'Rohan Joshi',
      createdAt: '2026-11-11T08:30:00Z',
      resolvedAt: null,
      resolutionTimeMin: null,
      messages: [
        {
          sender: 'Ganesh Shinde',
          senderType: 'Customer',
          message: 'My KYC was marked rejected due to blurry DL. Can I upload an mParivahan digital copy?',
          time: '2026-11-11T08:30:00Z'
        }
      ]
    }
  ];

  // 5. Activity Audit Logs
  const auditLogs = [
    {
      id: 'AUD-001',
      action: 'KYC_APPROVED',
      entity: 'KYC-2026-1002',
      performedBy: 'Priya Sundaram (USR-AG-KYC2)',
      details: 'Approved Customer KYC for Sunita Mehra and dispatched to Payments queue.',
      timestamp: '2026-11-10T14:15:00Z'
    },
    {
      id: 'AUD-002',
      action: 'KYC_REJECTED',
      entity: 'KYC-2026-1005',
      performedBy: 'Priya Sundaram (USR-AG-KYC2)',
      details: 'Rejected Delivery Partner KYC for Ganesh Shinde: Blurry Driving License scan.',
      timestamp: '2026-11-10T12:00:00Z'
    },
    {
      id: 'AUD-003',
      action: 'PAYMENT_RECORDED',
      entity: 'PAY-TXN-9003',
      performedBy: 'System Automation',
      details: 'Customer membership ₹499 auto-recorded post KYC approval.',
      timestamp: '2026-11-10T14:20:00Z'
    }
  ];

  // 6. Notifications
  const notifications = [
    {
      id: 'NOTIF-1',
      title: 'New KYC Ingestion',
      message: 'Technician Arun Balakrishnan submitted registration details.',
      type: 'info',
      read: false,
      timestamp: '2026-11-11T09:00:00Z'
    },
    {
      id: 'NOTIF-2',
      title: 'Payment Approval Required',
      message: 'Vendor Cycle 2 debits scheduled for 2 accounts.',
      type: 'warning',
      read: false,
      timestamp: '2026-11-11T08:45:00Z'
    },
    {
      id: 'NOTIF-3',
      title: 'SLA Escalation Alert',
      message: 'Ticket TCK-8814 is pending initial review from Queries team.',
      type: 'urgent',
      read: false,
      timestamp: '2026-11-11T09:15:00Z'
    }
  ];

  return {
    users,
    kycRecords,
    payments,
    queries,
    auditLogs,
    notifications
  };
}

// Thread-safe JSON DB Helper
export class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    }
  }

  read() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('DB Read error, recreating with seed:', err);
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
  }

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Auto-assign algorithm: finds available user with lowest activeLoad in team
  getNextAvailableWorker(teamName) {
    const data = this.read();
    const eligible = data.users.filter(u => u.team === teamName && u.isAvailable);
    if (!eligible.length) {
      // Fallback to any user in team or TL
      return data.users.find(u => u.team === teamName) || data.users[0];
    }
    // Sort ascending by activeLoad
    eligible.sort((a, b) => (a.activeLoad || 0) - (b.activeLoad || 0));
    return eligible[0];
  }

  incrementUserLoad(userId) {
    const data = this.read();
    const user = data.users.find(u => u.id === userId);
    if (user) {
      user.activeLoad = (user.activeLoad || 0) + 1;
      this.write(data);
    }
  }

  decrementUserLoad(userId) {
    const data = this.read();
    const user = data.users.find(u => u.id === userId);
    if (user && user.activeLoad > 0) {
      user.activeLoad -= 1;
      this.write(data);
    }
  }

  addAudit(action, entity, performedBy, details) {
    const data = this.read();
    const log = {
      id: `AUD-${Date.now()}`,
      action,
      entity,
      performedBy,
      details,
      timestamp: new Date().toISOString()
    };
    data.auditLogs.unshift(log);
    // Keep max 200 logs
    if (data.auditLogs.length > 200) data.auditLogs.pop();
    this.write(data);
    return log;
  }

  addNotification(title, message, type = 'info') {
    const data = this.read();
    const notif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    data.notifications.unshift(notif);
    if (data.notifications.length > 50) data.notifications.pop();
    this.write(data);
    return notif;
  }
}

export const db = new Database();

