import React, { useState } from "react";
import { SettingsGroupList, SettingsGroupKey } from "./settings/SettingsGroupList";
import { SettingsEditor } from "./settings/SettingsEditor";
import { useGlobalSettings } from "../../../hooks/useGlobalSettings";
import { Loader2, AlertCircle } from "lucide-react";
import styles from "../Dashboard.module.css";

export const GlobalSettingsModule: React.FC = () => {
    const [selectedGroup, setSelectedGroup] = useState<SettingsGroupKey>("branding");
    const { settings, loading, error, saving, fetchSettings, updateSettings } = useGlobalSettings();

    if (loading && !settings) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#070D0A]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
                    <p className="text-[#C5A880] font-serif tracking-widest uppercase text-xs">Loading Global Settings...</p>
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
            {/* Panel 2: Settings Groups List */}
            <div className={`bg-[#070D0A] border-r border-[#C5A880]/10 flex flex-col p-6 transition-all duration-500 overflow-y-auto customScrollbar ${styles.structurePanel}`}>
                <SettingsGroupList
                    selectedGroup={selectedGroup}
                    onSelectGroup={setSelectedGroup}
                />
            </div>

            {/* Panel 3: Settings Editor */}
            <main className={`flex-1 overflow-y-auto p-8 lg:p-12 flex flex-col gap-8 customScrollbar ${styles.editorArea}`}>
                <SettingsEditor
                    selectedGroup={selectedGroup}
                    settings={settings || []}
                    onSave={updateSettings}
                    saving={saving}
                />
            </main>
        </div>
    );
};
