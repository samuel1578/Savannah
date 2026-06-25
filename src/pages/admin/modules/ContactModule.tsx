import React, { useState, useEffect } from "react";
import { ContactHeroEditor } from "./contact/ContactHeroEditor";
import { SubmissionDetail } from "./contact/SubmissionDetail";
import { useContactCms } from "../../../hooks/useContactCms";
import { Loader2, AlertCircle, ImageIcon, ChevronRight, Settings2, Mail, ArrowLeft } from "lucide-react";
import styles from "../Dashboard.module.css";

export const ContactModule: React.FC = () => {
    const {
        settings,
        loading,
        error,
        saving,
        submissions,
        submissionsLoading,
        submissionsError,
        selectedSubmission,
        submissionLoading,
        updateSettings,
        fetchSettings,
        fetchSubmissions,
        fetchSubmission,
        updateStatus,
        updateNotes,
        sendFollowUp,
        setSelectedSubmission
    } = useContactCms();

    const [selectedSetting, setSelectedSetting] = useState<"hero" | "submissions" | null>("hero");

    useEffect(() => {
        fetchSettings();
        fetchSubmissions();
    }, [fetchSettings, fetchSubmissions]);

    const handleSelectSubmission = (id: number) => {
        fetchSubmission(id);
    };

    const handleBackToList = () => {
        setSelectedSubmission(null);
    };

    if (loading && !settings) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#070D0A]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
                    <p className="text-[#C5A880] font-serif tracking-widest uppercase text-xs">Loading Contact Module...</p>
                </div>
            </div>
        );
    }

    if (error && !settings) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#070D0A] p-6">
                <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 rounded-3xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-red-400 mb-2">Connection Error</h3>
                    <p className="text-sm text-red-400/60 mb-6">{error}</p>
                    <button
                        onClick={() => fetchSettings()}
                        className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-xs font-bold uppercase tracking-wider border border-red-500/20"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Panel 2: Page Settings List */}
            <div className={`bg-[#070D0A] border-r border-[#C5A880]/10 flex flex-col p-6 transition-all duration-500 overflow-y-auto customScrollbar ${styles.structurePanel}`}>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-2">
                        <Settings2 className="w-5 h-5 text-[#C5A880]" />
                        <h3 className="text-sm font-serif text-[#F3F4F6] tracking-widest uppercase">Page Settings</h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setSelectedSetting("hero")}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${selectedSetting === "hero"
                                ? "bg-[#C5A880]/10 border border-[#C5A880]/20"
                                : "hover:bg-[#C5A880]/5 border border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedSetting === "hero" ? "bg-[#C5A880] text-[#070D0A]" : "bg-[#0B1510] text-[#C5A880]/40 group-hover:text-[#C5A880]"
                                    }`}>
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${selectedSetting === "hero" ? "text-[#F3F4F6]" : "text-[#9CA3AF]"
                                        }`}>Hero Image</span>
                                    <span className="text-[9px] text-[#4B5563] uppercase tracking-wider">Main banner image</span>
                                </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${selectedSetting === "hero" ? "text-[#C5A880] translate-x-1" : "text-[#4B5563]"
                                }`} />
                        </button>

                        <button
                            onClick={() => setSelectedSetting("submissions")}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${selectedSetting === "submissions"
                                ? "bg-[#C5A880]/10 border border-[#C5A880]/20"
                                : "hover:bg-[#C5A880]/5 border border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedSetting === "submissions"
                                    ? "bg-[#C5A880] text-[#070D0A]"
                                    : "bg-[#0B1510] text-[#C5A880]/40 group-hover:text-[#C5A880]"
                                    }`}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${selectedSetting === "submissions" ? "text-[#F3F4F6]" : "text-[#9CA3AF]"
                                        }`}>
                                        Submissions
                                    </span>
                                    <span className="text-[9px] text-[#4B5563] uppercase tracking-wider">
                                        {submissionsLoading ? "..." : `${submissions.length} submissions`}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${selectedSetting === "submissions" ? "text-[#C5A880] translate-x-1" : "text-[#4B5563]"
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel 3: Settings Editor */}
            <main className={`flex-1 overflow-y-auto p-8 lg:p-12 flex flex-col gap-8 customScrollbar ${styles.editorArea}`}>
                {selectedSetting === "hero" && (
                    <ContactHeroEditor
                        settings={settings}
                        onSave={updateSettings}
                        saving={saving}
                    />
                )}

                {selectedSetting === "submissions" && (
                    <div className="flex-1 flex flex-col">
                        {selectedSubmission ? (
                            <SubmissionDetail
                                submission={selectedSubmission}
                                loading={submissionLoading}
                                onBack={handleBackToList}
                                onUpdateStatus={updateStatus}
                                onUpdateNotes={updateNotes}
                            />
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-[#C5A880]" />
                                        <h2 className="text-xl font-serif font-light text-[#F3F4F6]">Contact Submissions</h2>
                                    </div>
                                    <button
                                        onClick={() => fetchSubmissions()}
                                        disabled={submissionsLoading}
                                        className="p-2 rounded-lg hover:bg-[#C5A880]/10 text-[#C5A880] transition-all disabled:opacity-50"
                                        title="Refresh Submissions"
                                    >
                                        <Loader2 className={`w-4 h-4 ${submissionsLoading ? "animate-spin" : ""}`} />
                                    </button>
                                </div>

                                {submissionsLoading && submissions.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 opacity-40">
                                        <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
                                        <p className="text-sm text-[#9CA3AF]">Loading submissions...</p>
                                    </div>
                                ) : submissionsError ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-red-400 opacity-60">
                                        <AlertCircle className="w-8 h-8" />
                                        <p className="text-sm">{submissionsError}</p>
                                        <button
                                            onClick={() => fetchSubmissions()}
                                            className="text-xs underline uppercase tracking-widest"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : submissions.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 opacity-40">
                                        <div className="w-20 h-20 rounded-full bg-[#C5A880]/5 border border-[#C5A880]/10 flex items-center justify-center">
                                            <Mail className="w-10 h-10 text-[#C5A880]/20" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-xl font-serif text-[#F3F4F6]">No Submissions Yet</h3>
                                            <p className="text-sm text-[#9CA3AF] max-w-xs mx-auto">Form submissions will appear here once visitors contact you.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {submissions.map((sub) => (
                                            <div
                                                key={sub.id}
                                                onClick={() => handleSelectSubmission(sub.id)}
                                                className="bg-[#0B1510]/50 border border-[#C5A880]/10 rounded-2xl p-4 flex items-center justify-between hover:border-[#C5A880]/30 transition-all cursor-pointer group"
                                            >
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#F3F4F6] font-medium group-hover:text-[#C5A880] transition-colors">{sub.name}</span>
                                                        <span className="text-[10px] text-[#4B5563] uppercase tracking-wider">{new Date(sub.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <span className="text-sm text-[#9CA3AF]">{sub.email}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-[10px] text-[#C5A880]/60 uppercase tracking-widest font-bold">{sub.experience_type}</span>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sub.status === 'new' ? 'bg-amber-500/20 text-amber-400' :
                                                            sub.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                                                                sub.status === 'replied' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                    'bg-gray-500/20 text-gray-400'
                                                            }`}>
                                                            {sub.status}
                                                        </span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-[#4B5563] group-hover:text-[#C5A880] transition-all group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {!selectedSetting && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 opacity-40">
                        <div className="w-20 h-20 rounded-full bg-[#C5A880]/5 border border-[#C5A880]/10 flex items-center justify-center">
                            <Settings2 className="w-10 h-10 text-[#C5A880]/20" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-serif text-[#F3F4F6]">Select a Setting</h3>
                            <p className="text-sm text-[#9CA3AF] max-w-xs mx-auto">Choose a section from the left panel to begin editing the contact page.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
