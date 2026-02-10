"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
    id: string; // Changed to string to match JSON data
    question: string;
    answer: string;
    category: string;
}

const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function FAQAccordion({ data }: { data: FAQItem[] }) {
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

    const toggleFAQ = (id: string) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {data.map((faq) => (
                <motion.div
                    key={faq.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={slideUpVariants}
                    className="bg-white shadow rounded-lg overflow-hidden"
                >
                    {/* FAQ Header */}
                    <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-4 text-left bg-unaicNavy text-white hover:bg-unaicGold transition-colors duration-300 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase py-0.5 px-2 bg-white/20 rounded text-unaicGold border border-white/20 whitespace-nowrap hidden sm:inline-block">
                                {faq.category}
                            </span>
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                                <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            {expandedFAQ === faq.id ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </div>
                    </button>

                    {/* FAQ Content */}
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: expandedFAQ === faq.id ? "auto" : 0,
                            opacity: expandedFAQ === faq.id ? 1 : 0
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-unaicBlue rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
}
