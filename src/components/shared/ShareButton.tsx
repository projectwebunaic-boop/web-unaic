"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: title,
            text: text || title,
            url: url || window.location.href,
        };

        // Try Web Share API (Mobile & supported browsers)
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // User cancelled or error, fall back to copy
                console.log("Share cancelled or failed, falling back to clipboard");
            }
        }

        // Fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(shareData.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            alert("Gagal menyalin link.");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors group relative"
            title="Bagikan halaman ini"
        >
            {copied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
            <span className="hidden sm:inline">{copied ? "Tersalin!" : "Bagikan"}</span>

            {/* Tooltip for feedback (optional simple implementation) */}
            {copied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                    Link disalin!
                </span>
            )}
        </button>
    );
}
