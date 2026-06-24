import React, { useState } from "react";
import { ContactSubmission } from "../../../services/contactCmsService";
import { X, Send, Loader2, CheckCircle2, AlertCircle, Mail, MessageSquare } from "lucide-react";

interface FollowUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: ContactSubmission;
    onSend: (id: number, subject: string, message: string) => Promise<any>;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
    isOpen,
    onClose,
    submission,
    onSend
}) => {
    const [subject, setSubject] = useState(`Re: Savannah Water Inquiry - ${submission.experience_type || "General"}`);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSend = async () => {
        if (!message.trim()) return;

        setIsSending(true);
        setStatus("idle");
        try {
            // 1. Construct the email body for mailto
            const emailBody = `Dear ${submission.name},\n\n${message}\n\n---\nOriginal Message:\n${submission.message}\n\nWarm regards,\nSavannah Water Team\nhttps://savannahdrinks.co.uk`;

            // 2. Construct and open the mailto link
            const mailtoLink = `mailto:${submission.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            window.open(mailtoLink, '_blank');

            // 3. Call backend to log the follow-up and update status to 'replied'
            await onSend(submission.id, subject, message);

            setStatus("success");
            setTimeout(() => {
                onClose();
                setStatus("idle");
                setMessage("");
            }, 2000);
        } catch (err: any) {
            console.error("Error in follow-up flow:", err);
            // Even if the backend log fails, the mailto was opened, but we show the error for logging
            setStatus("error");
            setErrorMessage(err.message || "Failed to log follow-up on server");
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#070D0A]/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-3xl bg-[#0B1510] border border-[#C5A880]/20 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#C5A880]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C5A880]/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-[#C5A880]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-serif text-[#F3F4F6]">Send Follow-up</h3>
                            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Replying to {submission.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-[#C5A880]/10 text-[#9CA3AF] hover:text-[#F3F4F6] transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto customScrollbar">
                    {/* Original Message (Reference) */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-3 h-3 text-[#C5A880]/40" />
                            <span className="text-[10px] text-[#4B5563] uppercase tracking-widest font-bold">Original Inquiry</span>
                        </div>
                        <div className="bg-[#070D0A]/50 border border-[#C5A880]/5 rounded-2xl p-4 text-xs text-[#9CA3AF] italic leading-relaxed">
                            "{submission.message}"
                        </div>
                    </div>

                    {/* Email Form */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[#C5A880] uppercase tracking-widest font-bold ml-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-xl px-4 py-3 text-sm text-[#F3F4F6] outline-none focus:border-[#C5A880]/40 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[#C5A880] uppercase tracking-widest font-bold ml-1">Your Response</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your professional response here..."
                                className="w-full bg-[#070D0A]/50 border border-[#C5A880]/10 rounded-2xl px-4 py-4 text-sm text-[#F3F4F6] outline-none focus:border-[#C5A880]/40 transition-all min-h-[200px] resize-none customScrollbar"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#C5A880]/10 bg-[#070D0A]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {status === "success" && (
                            <div className="flex items-center gap-2 text-emerald-400 animate-in slide-in-from-left-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Email Sent Successfully</span>
                            </div>
                        )}
                        {status === "error" && (
                            <div className="flex items-center gap-2 text-red-400 animate-in slide-in-from-left-2">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">{errorMessage}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="text-xs font-bold text-[#9CA3AF] hover:text-[#F3F4F6] uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={isSending || !message.trim() || status === "success"}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 ${status === "success"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] shadow-lg shadow-[#C5A880]/10"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : status === "success" ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            <span>{isSending ? "Sending..." : status === "success" ? "Sent" : "Send Email"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
