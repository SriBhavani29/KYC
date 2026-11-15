import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Download, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle,
  Building,
  User,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Send,
  Award,
  Archive,
  Loader2,
  BellRing,
  RotateCcw,
  History,
  ArrowRightLeft,
  Check,
  Clock
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { formatDate } from '../utils/validation';
import { generateKYCCertificate } from '../utils/pdfGenerator';

const PREDEFINED_REJECTION_REASONS = [
  'Document is blurred or illegible (Unreadable text)',
  'PAN Card does not match the applicant legal name',
  'GSTIN certificate is invalid or expired',
  'Bank account details or IFSC code mismatch',
  'Passbook / Cancelled Cheque image is cut off or missing IFSC',
  'Address proof does not match registered business address',
  'Incomplete document submission (Aadhaar / ID back page missing)',
  'Other / Custom Reason'
];

export default function KYCDetailModal({ 
  record, 
  onClose, 
  onReview, 
  onReassign, 
  onResubmit,
  teamMembers = [] 
}) {
  // Start with no document selected by default (hidden until a tab is clicked)
  const [activeDocIndex, setActiveDocIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [showResubmitBox, setShowResubmitBox] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [selectedPresetReason, setSelectedPresetReason] = useState(PREDEFINED_REJECTION_REASONS[0]);
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [newAssignee, setNewAssignee] = useState(record?.assignedTo || '');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!record) return null;

  const documents = record.documents || [];
  const currentDoc = activeDocIndex !== null ? documents[activeDocIndex] : null;
  const activityHistory = record.activityHistory || [];

  const handleApprove = () => {
    onReview(record.id, 'approve');
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    let finalReason = selectedPresetReason;
    if (selectedPresetReason === 'Other / Custom Reason') {
      if (!customRejectionReason || customRejectionReason.trim().length < 5) {
        setRejectionError('Please enter a specific rejection reason (minimum 5 characters).');
        return;
      }
      finalReason = customRejectionReason.trim();
    }

    setRejectionError('');
    onReview(record.id, 'reject', finalReason);
  };

  const handleReassignSubmit = async () => {
    if (newAssignee && newAssignee !== record.assignedTo) {
      await onReassign(record.id, newAssignee);
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 3000);
    }
  };

  const handleResubmitSubmit = (e) => {
    e.preventDefault();
    if (onResubmit) {
      onResubmit(record.id, correctionNotes);
      setShowResubmitBox(false);
      setCorrectionNotes('');
    }
  };

  // Download all submitted documents in a single ZIP archive
  const handleDownloadAllZip = async () => {
    if (!documents.length) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `${record.applicationNo}_${record.fullName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Documents`;
      const docFolder = zip.folder(folderName);

      // Fetch each document and append into zip
      const fetchPromises = documents.map(async (doc, idx) => {
        try {
          const response = await fetch(doc.fileUrl);
          const blob = await response.blob();
          const cleanDocType = doc.type.replace(/[^a-zA-Z0-9_-]/g, '_');
          const ext = doc.fileUrl.split('.').pop()?.split('?')[0] || 'jpg';
          const filename = `${idx + 1}_${cleanDocType}_${doc.docNo || 'DOC'}.${ext}`;
          docFolder.file(filename, blob);
        } catch (err) {
          // Fallback if CORS or fetch issue: create a text descriptor
          docFolder.file(
            `${idx + 1}_${doc.type.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`,
            `Document: ${doc.type}\nDocument Number: ${doc.docNo}\nStatus: ${doc.verified ? 'Verified' : 'Pending'}\nRemote URL: ${doc.fileUrl}`
          );
        }
      });

      // Add metadata summary manifest
      const manifest = {
        applicationNo: record.applicationNo,
        applicantName: record.fullName,
        category: record.category,
        businessName: record.businessName,
        submittedAt: record.submittedAt,
        status: record.status,
        documents: documents.map(d => ({ type: d.type, docNo: d.docNo, verified: d.verified }))
      };
      docFolder.file('KYC_Verification_Manifest.json', JSON.stringify(manifest, null, 2));

      await Promise.all(fetchPromises);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${folderName}.zip`);
    } catch (error) {
      console.error('Error generating document ZIP archive:', error);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        
        {/* Modal Header */}
        <div className="p-4 px-5 sm:px-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-purple-50/60 via-amber-50/30 to-white">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 shrink-0">
              {record.applicationNo}
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">FORGE INDIA CONNECT</div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 truncate">
                <span className="truncate">{record.fullName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {record.category}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                Submitted on {formatDate(record.submittedAt)} • Handled by: <strong className="text-slate-800">{record.assignedName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 ml-auto">
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border inline-flex items-center gap-1.5 ${
              record.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs' :
              record.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                record.status === 'Approved' ? 'bg-emerald-500' :
                record.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
              {record.status}
            </span>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view (Left: Applicant info (wider: 7 cols), Right: Document Viewer (slightly smaller: 5 cols)) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
          
          {/* Left Column: Data & Validation Info (Wider: lg:col-span-7) */}
          <div className="lg:col-span-7 p-5 sm:p-6 border-r border-slate-200 overflow-y-auto space-y-5 bg-slate-50/60">
            {/* Reassignment / Transfer Block (TL / Admin / Operator) */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Assignee Lead Management & Transfer
                </label>
                {transferSuccess && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" /> Transferred Successfully
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="flex-1 min-w-0 bg-slate-50 border border-slate-300 text-xs rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.team}) - Load: {m.activeLoad}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleReassignSubmit}
                  disabled={newAssignee === record.assignedTo}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Transfer</span>
                </button>
              </div>
            </div>

            {/* Profile Info Card with Generous Spacing */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" /> Registration & Profile Details
                </h3>
                <span className="text-[10px] font-semibold text-slate-400">KYC Profile</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium mb-0.5">Full Legal Name</span>
                  <span className="font-bold text-slate-900 leading-snug block">{record.fullName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium mb-0.5">Business / Trade Name</span>
                  <span className="font-bold text-slate-900 leading-snug block">{record.businessName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium mb-0.5">Mobile Phone</span>
                  <span className="font-mono text-purple-700 font-bold tracking-wide block">{record.mobile}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium mb-0.5">Email Address</span>
                  <span className="text-slate-700 font-medium truncate block">{record.email}</span>
                </div>
                <div className="sm:col-span-2 pt-1 border-t border-slate-50">
                  <span className="text-[11px] text-slate-400 block font-medium mb-0.5">Registered Address</span>
                  <span className="text-slate-800 font-medium leading-relaxed block">{record.address}</span>
                </div>
              </div>
            </div>

            {/* Bank Details Card with Clean Padding */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600" /> Banking & Payout Credentials
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Bank
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium mb-0.5">Bank Account No.</span>
                  <span className="font-mono font-bold text-slate-900 block">{record.bankAccountNo}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">✓ Numeric verified</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium mb-0.5">IFSC Code</span>
                  <span className="font-mono font-bold text-slate-900 block">{record.ifscCode}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">✓ RBI Format valid</span>
                </div>
                <div className="sm:col-span-2 pt-1 border-t border-slate-50">
                  <span className="text-[11px] text-slate-400 block font-medium mb-0.5">Scheduled Bank Name</span>
                  <span className="text-slate-800 font-bold block">{record.bankName}</span>
                </div>
              </div>
            </div>

            {/* Payments Auto-Move Notice */}
            <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs space-y-1.5 shadow-2xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" /> Automatic Payments Handoff
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                Approving this KYC will automatically register and route this account into the 
                <strong className="text-slate-800"> Payments Team</strong> pipeline for monthly cycle debits / disbursements.
              </p>
            </div>

            {/* Rejection Notice if rejected */}
            {record.rejectionReason && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" /> Mandatory Rejection Reason Logged
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-rose-700 font-semibold pl-5 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-rose-200/60">
                  "{record.rejectionReason}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pl-5 pt-1">
                  <span>Applicant notified via SMS and automated query ticket.</span>
                  <button
                    type="button"
                    onClick={() => setShowResubmitBox(true)}
                    className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Resubmit Application
                  </button>
                </div>
              </div>
            )}

            {/* Complete Activity History & Audit Log (Who, When, What) */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-600" /> Complete Activity & Audit History
                </h3>
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {activityHistory.length} event{activityHistory.length !== 1 ? 's' : ''}
                </span>
              </div>

              {activityHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No activity events recorded yet.</p>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {activityHistory.map((item, index) => {
                    const isApprove = item.action === 'APPROVED';
                    const isReject = item.action === 'REJECTED';
                    const isTransfer = item.action === 'TRANSFERRED';
                    const isResubmit = item.action === 'RESUBMITTED';

                    const badgeStyle = isApprove ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      isReject ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      isTransfer ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      isResubmit ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-50 text-slate-700 border-slate-200';

                    return (
                      <div key={index} className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs space-y-1.5 transition-colors hover:bg-slate-50">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${badgeStyle}`}>
                            {item.action}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.timestamp ? new Date(item.timestamp).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </span>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {item.details}
                        </p>
                        <div className="text-[10px] text-slate-500 font-semibold pt-0.5 border-t border-slate-100 flex items-center justify-between">
                          <span>Action by: <strong className="text-slate-800">{item.actorName || 'System'}</strong> ({item.actorRole || 'Staff'})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Document Viewer & Separate Clickable Tabs (Slightly Smaller: lg:col-span-5) */}
          <div className="lg:col-span-5 bg-slate-100 flex flex-col overflow-hidden min-h-0">
            
            {/* Separate Clickable Document Tabs Bar */}
            <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              
              {/* Distinct Document Tabs (PAN, GST, Bank Passbook, etc.) */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
                {documents.map((doc, idx) => {
                  const isSelected = activeDocIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveDocIndex(idx);
                        setZoomLevel(1);
                        setRotation(0);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shrink-0 border ${
                        isSelected
                          ? 'bg-purple-50 text-purple-900 border-purple-400 shadow-sm ring-1 ring-purple-300'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>{doc.type}</span>
                      {doc.verified ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-2xs" title="Verified" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-2xs" title="Awaiting check" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Viewer Controls & Download All Action */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer border border-slate-200 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer border border-slate-200 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer border border-slate-200 transition-colors"
                  title="Rotate 90deg"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                
                {/* Download Active Single Document */}
                {currentDoc?.fileUrl && (
                  <a
                    href={currentDoc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer border border-slate-200 transition-colors"
                    title={`Download ${currentDoc.type}`}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}

                {/* Download All Documents Together as ZIP */}
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isZipping || !documents.length}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs font-bold cursor-pointer transition-all shadow-xs disabled:opacity-50"
                  title="Download all submitted documents as a ZIP archive"
                >
                  {isZipping ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Archive className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{isZipping ? 'Archiving...' : 'Download All (ZIP)'}</span>
                </button>
              </div>
            </div>

            {/* Document Canvas Display - Shows document ONLY when a tab is selected */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-50 relative min-h-[360px]">
              {currentDoc ? (
                <div className="relative overflow-hidden transition-transform duration-200 flex flex-col items-center justify-center max-w-full">
                  <img
                    src={currentDoc.fileUrl}
                    alt={currentDoc.type}
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      maxHeight: '400px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                    className="rounded-xl shadow-lg border border-slate-300 bg-white transition-all"
                  />
                  <div className="mt-3 inline-flex items-center gap-2 bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-800 border border-slate-200 shadow-xs">
                    <span className="text-purple-700 font-bold">{currentDoc.type}</span>
                    <span className="text-slate-300">•</span>
                    <span>Doc ID: {currentDoc.docNo || 'N/A'}</span>
                    <span className="text-slate-300">•</span>
                    <span className={currentDoc.verified ? 'text-emerald-600' : 'text-amber-600'}>
                      {currentDoc.verified ? '✓ Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs mb-3">
                    <FileText className="w-8 h-8 opacity-70" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    No Document Selected
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Click on any document tab above (<span className="text-purple-700 font-semibold">PAN Card</span>, <span className="text-purple-700 font-semibold">GST Certificate</span>, etc.) to preview it here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer: Action Controls with Responsive Wrapping */}
        <div className="p-4 px-5 sm:px-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            {record.status === 'Pending' ? (
              <span>Verification Pending • Review documents thoroughly before decision</span>
            ) : (
              <span>Application marked as <strong className="text-slate-900 font-bold">{record.status}</strong></span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
            {record.status === 'Pending' && !showRejectBox && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRejectBox(true)}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Application</span>
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Move to Payments</span>
                </button>
              </>
            )}

            {showRejectBox && (
              <form onSubmit={handleRejectSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2.5 w-full max-w-2xl bg-white p-3 rounded-2xl border border-rose-200 shadow-sm">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Mandatory Rejection Reason
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Applicant will receive SMS & Query Notice</span>
                  </div>

                  {/* Predefined Reasons Dropdown */}
                  <select
                    value={selectedPresetReason}
                    onChange={(e) => {
                      setSelectedPresetReason(e.target.value);
                      setRejectionError('');
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {PREDEFINED_REJECTION_REASONS.map((reason, idx) => (
                      <option key={idx} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>

                  {/* Custom Reason Input Field (Visible if 'Other / Custom Reason' is chosen) */}
                  {selectedPresetReason === 'Other / Custom Reason' && (
                    <input
                      type="text"
                      autoFocus
                      required
                      value={customRejectionReason}
                      onChange={(e) => {
                        setCustomRejectionReason(e.target.value);
                        setRejectionError('');
                      }}
                      placeholder="Specify the exact issue (e.g. Signature missing on page 2)"
                      className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                    />
                  )}

                  {rejectionError && (
                    <span className="text-[10px] text-rose-600 font-bold block">{rejectionError}</span>
                  )}
                </div>

                <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-0.5">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm & Notify</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectBox(false);
                      setCustomRejectionReason('');
                      setSelectedPresetReason(PREDEFINED_REJECTION_REASONS[0]);
                      setRejectionError('');
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors text-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Re-verification / Resubmit Form for Rejected Applications */}
            {showResubmitBox && (
              <form onSubmit={handleResubmitSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2.5 w-full max-w-2xl bg-white p-3.5 rounded-2xl border border-amber-300 shadow-md">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Resubmit for Re-verification
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Status will revert to Pending</span>
                  </div>
                  <input
                    type="text"
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    placeholder="Enter correction notes (e.g. Fresh high-resolution Driving License provided)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                  <p className="text-[10px] text-slate-500">
                    Resubmitting clears the rejection state and routes the application back into the review queue.
                  </p>
                </div>
                <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-0.5">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Confirm Resubmit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResubmitBox(false);
                      setCorrectionNotes('');
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors text-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Standard Action Buttons (Available for all applications: Approve, Reject, Resubmit, Download, Close) */}
            {!showRejectBox && !showResubmitBox && (
              <div className="flex flex-wrap items-center gap-2">
                {/* Approve Button */}
                {record.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    title="Approve this application and dispatch to Payments"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                )}

                {/* Reject Button */}
                {record.status !== 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(true)}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    title="Reject with mandatory reason"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                )}

                {/* Resubmit Button (Prominently visible when Rejected) */}
                {record.status === 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => setShowResubmitBox(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    title="Resubmit for corrections and re-verification"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Resubmit for Re-verification</span>
                  </button>
                )}

                {/* Certificate for Approved records */}
                {record.status === 'Approved' && (
                  <button
                    type="button"
                    onClick={() => generateKYCCertificate(record)}
                    className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs shrink-0"
                  >
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Compliance Certificate</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-colors shrink-0"
                >
                  Close View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
