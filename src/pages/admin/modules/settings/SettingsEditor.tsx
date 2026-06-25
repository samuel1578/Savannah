import React, { useState, useEffect } from "react";
import { SettingsGroupKey } from "./SettingsGroupList";
import { GlobalSetting } from "../../../../services/globalSettingsService";
import { Save, AlertCircle, Building2, Mail, MapPin, Scale, Search, Loader2, CheckCircle2 } from "lucide-react";

interface SettingsEditorProps {
    selectedGroup: SettingsGroupKey;
    settings: GlobalSetting[];
    onSave: (updates: { setting_key: string; setting_value: string }[]) => Promise<any>;
    saving: boolean;
}

const GROUP_METADATA: Record<SettingsGroupKey, { title: string; desc: string; icon: any; groupName: string }> = {
    branding: {
        title: "Branding",
        desc: "Manage your company name and core brand identity settings.",
        icon: Building2,
        groupName: "branding"
    },
    contact: {
        title: "Contact Information",
        desc: "Update official contact channels and tasting room availability.",
        icon: Mail,
        groupName: "contact"
    },
    addresses: {
        title: "Addresses",
        desc: "Configure physical studio locations for the UK and Ghana offices.",
        icon: MapPin,
        groupName: "addresses"
    },
    legal: {
        title: "Legal & Copyright",
        desc: "Manage site-wide legal text, disclosures, and copyright notices.",
        icon: Scale,
        groupName: "legal"
    },
    seo: {
        title: "SEO Defaults",
        desc: "Set global search engine optimization defaults for the entire site.",
        icon: Search,
        groupName: "seo"
    }
};

export const SettingsEditor: React.FC<SettingsEditorProps> = ({
    selectedGroup,
    settings,
    onSave,
    saving
}) => {
    const meta = GROUP_METADATA[selectedGroup];
    const Icon = meta.icon;

    // Local state for edits
    const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // Initialize local settings when group or settings change
    useEffect(() => {
        const initialValues: Record<string, string> = {};
        settings.forEach(s => {
            initialValues[s.setting_key] = s.setting_value;
        });
        setLocalSettings(initialValues);
        setSaveStatus("idle");
    }, [settings, selectedGroup]);

    const handleInputChange = (key: string, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            [key]: value
        }));
        if (saveStatus !== "idle") setSaveStatus("idle");
    };

    const handleSave = async () => {
        const groupSettings = settings.filter(s => s.group_name === meta.groupName);
        const updates = groupSettings.map(s => ({
            setting_key: s.setting_key,
            setting_value: localSettings[s.setting_key] ?? s.setting_value
        }));

        setSaveStatus("idle");
        try {
            await onSave(updates);
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (err: any) {
            setSaveStatus("error");
            setErrorMessage(err.message || "Failed to save settings.");
        }
    };

    const renderField = (key: string, label: string, type: "text" | "email" | "textarea") => {
        const value = localSettings[key] ?? "";

        return (
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#C5A880] uppercase tracking-[0.2em] ml-1">
                    {label}
                </label>
                {type === "textarea" ? (
                    <textarea
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full bg-[#0B1510] border border-[#C5A880]/10 rounded-2xl p-4 text-sm text-[#F3F4F6] outline-none focus:border-[#C5A880]/40 transition-all min-h-[120px] resize-none"
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full bg-[#0B1510] border border-[#C5A880]/10 rounded-xl px-4 py-3 text-sm text-[#F3F4F6] outline-none focus:border-[#C5A880]/40 transition-all"
                    />
                )}
            </div>
        );
    };

    const hasChanges = () => {
        const groupSettings = settings.filter(s => s.group_name === meta.groupName);
        return groupSettings.some(s => localSettings[s.setting_key] !== s.setting_value);
    };

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-[#C5A880]/10">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] shadow-xl">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-light text-[#F3F4F6] tracking-wide">{meta.title}</h2>
                        <p className="text-[#9CA3AF] text-sm font-light mt-1 max-w-md">{meta.desc}</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving || !hasChanges() || saveStatus === "success"}
                        className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${saveStatus === "success"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-[#C5A880] hover:bg-[#D5B890] text-[#070D0A] shadow-lg shadow-[#C5A880]/10"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : saveStatus === "success" ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{saving ? "Saving..." : saveStatus === "success" ? "Saved" : "Save Changes"}</span>
                    </button>
                    {saveStatus === "error" && (
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{errorMessage}</span>
                    )}
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 gap-8 max-w-3xl">
                {selectedGroup === "branding" && (
                    renderField("company_name", "Company Name", "text")
                )}

                {selectedGroup === "contact" && (
                    <>
                        {renderField("company_email", "Official Email Address", "email")}
                        {renderField("tasting_hours", "Tasting Room Hours", "text")}
                    </>
                )}

                {selectedGroup === "addresses" && (
                    <>
                        {renderField("address_uk", "United Kingdom Studio", "textarea")}
                        {renderField("address_ghana", "Ghana Studio", "textarea")}
                    </>
                )}

                {selectedGroup === "legal" && (
                    renderField("copyright_text", "Footer Copyright Text", "textarea")
                )}

                {selectedGroup === "seo" && (
                    <>
                        {renderField("default_seo_title", "Default SEO Title", "text")}
                        {renderField("default_seo_description", "Default SEO Description", "textarea")}
                    </>
                )}

                {hasChanges() && saveStatus === "idle" && (
                    <div className="mt-4 p-5 bg-[#C5A880]/5 border border-[#C5A880]/20 rounded-2xl flex items-start gap-4 animate-in fade-in duration-300">
                        <AlertCircle className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-xs font-bold text-[#C5A880] uppercase tracking-wider mb-1">Unsaved Changes</h4>
                            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                                You have modified settings in this group. Click "Save Changes" to apply them to the database.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
