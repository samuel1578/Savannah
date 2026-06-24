import React, { useState } from "react";
import { ContactSubmission } from "../../../services/contactCmsService";
import { ArrowLeft, Mail, Calendar, User, MessageSquare, Clock, Save, Loader2, Send, CheckCircle2 } from "lucide-react";
import { FollowUpModal } from "./FollowUpModal";

interface SubmissionDetailProps {
    submission: ContactSubmission;
    loading: boolean;
    onBack: () => void;
    onUpdateStatus: (id: number, status: string) => Promise<any>;
    onUpdateNotes: (id: number, notes: string) => Promise<any>;
    onSendFollowUp: (id: number, subject: string, message: string) => Promise<any>;
}

export const SubmissionDetail: React.FC<SubmissionDetailProps> = ({
    submission,
    loading,
    onBack,
    onUpdateStatus,
    onUpdateNotes,
    onSendFollowUp
}) => {
    const [notes, setNotes] = useState(submission.admin_notes || "");
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    const handleStatusChange = async (newStatus: string) => {
        try {
            await onUpdateStatus(submission.id, newStatus);
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleSaveNotes = async () => {
        setIsSavingNotes(true);
        setSaveStatus("idle");
        try {
            await onUpdateNotes(submission.id, notes);
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (err) {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setIsSavingNotes(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-40">
                <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
                <p className="text-sm text-[#9CA3AF]">Loading submission details...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl bg-[#0B1510] text-[#C5A880] hover:bg-[#C5A880]/10 transition-all border border-[#C5A880]/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-xl font-serif font-light text-[#F3F4F6]">Submission Details</h2>
                        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest mt-0.5">ID: {submission.id} • Received {new Date(submission.created_at).toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={submission.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={`bg-[#0B1510] border border-[#C5A880]/20 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:border-[#C5A880] transition-all ${submission.status === 'new' ? 'text-amber-400' :
                                submission.status === 'read' ? 'text-blue-400' :
                                    submission.status === 'replied' ? 'text-emerald-400' :
                                        'text-gray-400'
                            }`}
                    >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                    </select>

                    <button
                        onClick={() => setShowReplyModal(true)}
                        className="flex items-center gap-2 bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] px-4 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#C5A880]/10"
                    >
                        <Send className="w-3.5 h-3.5" />
                        Reply
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Cards */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* User Info */}
                    <div className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
                        <div className="flex items-center gap-3 border-b border-[#C5A880]/10 pb-4">
                            <User className="w-4 h-4 text-[#C5A880]" />
                            <h3 className="text-xs font-bold text-[#F3F4F6] uppercase tracking-widest">Sender Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-[#4B5563] uppercase tracking-widest font-bold">Full Name</span>
                                <span className="text-sm text-[#F3F4F6] font-medium">{submission.name}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-[#4B5563] uppercase tracking-widest font-bold">Email Address</span>
                                <a href={`mailto:${submission.email}`} className="text-sm text-[#C5A880] hover:underline">{submission.email}</a>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-[#4B5563] uppercase tracking-widest font-bold">Experience Type</span>
                                <span className="text-sm text-[#F3F4F6] font-medium">{submission.experience_type || "General Inquiry"}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-[#4B5563] uppercase tracking-widest font-bold">Preferred Date</span>
                                <span className="text-sm text-[#F3F4F6] font-medium">{submission.preferred_date ? new Date(submission.preferred_date).toLocaleDateString() : "Not Specified"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-6 flex flex-col gap-6 shadow-xl flex-1">
                        <div className="flex items-center gap-3 border-b border-[#C5A880]/10 pb-4">
                            <MessageSquare className="w-4 h-4 text-[#C5A880]" />
                            <h3 className="text-xs font-bold text-[#F3F4F6] uppercase tracking-widest">Inquiry Message</h3>
                        </div>

                        <div className="bg-[#070D0A]/50 rounded-2xl p-6 border border-[#C5A880]/5 min-h-[150px]">
                            <p className="text-sm text-[#9CA3AF] leading-relaxed whitespace-pre-wrap">
                                {submission.message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Admin Actions */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-3xl p-6 flex flex-col gap-6 shadow-xl h-full">
                        <div className="flex items-center gap-3 border-b border-[#C5A880]/10 pb-4">
                            <Clock className="w-4 h-4 text-[#C5A880]" />
                            <h3 className="text-xs font-bold text-[#F3F4F6] uppercase tracking-widest">Admin Notes</h3>
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add private notes about this submission..."
                                className="flex-1 bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-2xl p-4 text-sm text-[#F3F4F6] outline-none focus:border-[#C5A880]/40 transition-all resize-none customScrollbar"
                            />

                            <button
                                onClick={handleSaveNotes}
                                disabled={isSavingNotes || notes === submission.admin_notes}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${saveStatus === "success"
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : saveStatus === "error"
                                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                            : "bg-[#C5A880]/10 hover:bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/20"
                                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                                {isSavingNotes ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : saveStatus === "success" ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                    <Save className="w-3.5 h-3.5" />
                                )}
                                <span>{isSavingNotes ? "Saving..." : saveStatus === "success" ? "Saved" : "Save Notes"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <FollowUpModal
                isOpen={showReplyModal}
                onClose={() => setShowReplyModal(false)}
                submission={submission}
                onSend={onSendFollowUp}
            />
        </div>
    );
};
