"use client";

import TestimoniSection from "@/components/testimoni/TestimoniSection";
import BackToTop from "@/components/global/BackToTop";
import Chatbot from "@/components/chatbot/Chatbot";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";

export default function PublicComponents() {

    return (
        <>
            <TestimoniSection />
            <BackToTop />
            <AccessibilityPanel />
            <Chatbot />
        </>
    );
}
