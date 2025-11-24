import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FaqItem { question: string; answer: string; }

const faqData: FaqItem[] = [
    { question: 'What is NSSApp?', answer: 'A platform that helps students record, validate, and showcase community service like blood donation, tree tagging, and social initiatives—transparent, structured, and UNIT verified.' },
    { question: 'How does it work?', answer: 'Students log activities. UNIT roles review and approve. Points and impact metrics accumulate toward recognition milestones.' },
    { question: 'Is it free to use?', answer: 'Yes. The platform is free for students and participating institutions adopting structured social engagement.' },
    { question: 'Who can join?', answer: 'Any enrolled student or authorized UNIT member participating in the National Service Scheme or equivalent community programs.' },
];

export const FAQSection = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    return (
        <section className="py-24 bg-white fade-in">
            <div className="max-w-6xl mx-auto px-6 lg:px-10">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="space-y-6 lg:col-span-1">
                        <h2 className="text-3xl font-semibold text-secondary-900">FAQs</h2>
                        <p className="text-secondary-600 text-sm leading-relaxed">Answers to common questions. Need more help? Reach out through the contact section below.</p>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        {faqData.map((f, i) => {
                            const open = openFaq === i;
                            return (
                                <div key={i} className="border border-nss-200 rounded-xl bg-nss-50 overflow-hidden">
                                    <button onClick={() => setOpenFaq(open ? null : i)} className="w-full flex items-center justify-between text-left px-6 py-4">
                                        <span className="font-medium text-secondary-800">{f.question}</span>
                                        {open ? <ChevronUp className="h-5 w-5 text-secondary-500" /> : <ChevronDown className="h-5 w-5 text-secondary-500" />}
                                    </button>
                                    {open && (
                                        <div className="px-6 pb-5 text-sm text-secondary-600 leading-relaxed border-t border-nss-100 bg-white">{f.answer}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
