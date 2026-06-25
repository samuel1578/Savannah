import React from "react";
import { Building2, Mail, MapPin, Scale, Search, Settings2, ChevronRight } from "lucide-react";
import styles from "../Dashboard.module.css";

export type SettingsGroupKey = "branding" | "contact" | "addresses" | "legal" | "seo";

interface SettingsGroup {
    key: SettingsGroupKey;
    label: string;
    icon: React.ElementType;
    desc: string;
}

const SETTINGS_GROUPS: SettingsGroup[] = [
    {
        key: "branding",
        label: "Branding",
        icon: Building2,
        desc: "Company name and brand identity"
    },
    {
        key: "contact",
        label: "Contact Information",
        icon: Mail,
        desc: "Official email and tasting hours"
    },
    {
        key: "addresses",
        label: "Addresses",
        icon: MapPin,
        desc: "UK and Ghana studio locations"
    },
    {
        key: "legal",
        label: "Legal & Copyright",
        icon: Scale,
        desc: "Footer legal text and copyright"
    },
    {
        key: "seo",
        label: "SEO Defaults",
        icon: Search,
        desc: "Global metadata and search settings"
    }
];

interface SettingsGroupListProps {
    selectedGroup: SettingsGroupKey;
    onSelectGroup: (group: SettingsGroupKey) => void;
}

export const SettingsGroupList: React.FC<SettingsGroupListProps> = ({
    selectedGroup,
    onSelectGroup
}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
                <Settings2 className="w-5 h-5 text-[#C5A880]" />
                <h3 className="text-sm font-serif text-[#F3F4F6] tracking-widest uppercase">Global Settings</h3>
            </div>

            <div className="flex flex-col gap-2">
                {SETTINGS_GROUPS.map((group) => {
                    const Icon = group.icon;
                    const isSelected = selectedGroup === group.key;

                    return (
                        <button
                            key={group.key}
                            onClick={() => onSelectGroup(group.key)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${isSelected
                                ? "bg-[#C5A880]/10 border border-[#C5A880]/20"
                                : "hover:bg-[#C5A880]/5 border border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected
                                    ? "bg-[#C5A880] text-[#070D0A]"
                                    : "bg-[#0B1510] text-[#C5A880]/40 group-hover:text-[#C5A880]"
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${isSelected ? "text-[#F3F4F6]" : "text-[#9CA3AF]"
                                        }`}>
                                        {group.label}
                                    </span>
                                    <span className="text-[9px] text-[#4B5563] uppercase tracking-wider">
                                        {group.desc}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSelected ? "text-[#C5A880] translate-x-1" : "text-[#4B5563]"
                                }`} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
