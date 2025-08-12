import Navbar from '@/components/common/Navbar';
import { FooterSection } from '@/views/home/sections/FooterSection';
import { Mail, Phone, MapPin, Target, HeartHandshake, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FaqItem { question: string; answer: string; }

const faqData: FaqItem[] = [
    { question: 'What is NSSApp?', answer: 'A platform that helps students record, validate, and showcase community service like blood donation, tree tagging, and social initiatives—transparent, structured, and faculty verified.' },
    { question: 'How does it work?', answer: 'Students log activities. Faculty review and approve. Points and impact metrics accumulate toward recognition milestones.' },
    { question: 'Is it free to use?', answer: 'Yes. The platform is free for students and academic institutions adopting structured social engagement.' },
    { question: 'Who can join?', answer: 'Any enrolled student or authorized faculty member participating in the National Service Scheme or equivalent community programs.' },
];

const team = [
    { name: 'Alice Johnson', role: 'Program Manager' },
    { name: 'Mark Smith', role: 'Lead Developer' },
    { name: 'Sarah Lee', role: 'UI/UX Designer' },
    { name: 'David Kim', role: 'Data Analyst' },
    { name: 'Emily Chen', role: 'Content Writer' },
    { name: 'We\'re hiring!', role: 'Join Us' },
];

export default function AboutView() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-nss-50 font-isans text-secondary-800">
            <Navbar />
            <main className="pt-32">{/* Hero */}
                <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-secondary-900">Empowering Social Impact</h1>
                            <p className="text-lg leading-relaxed text-secondary-600 max-w-xl">We enable students to transform intent into measurable community contribution. Through structured tracking and faculty validation, NSSApp builds lifelong civic responsibility.</p>
                            <div className="grid grid-cols-3 gap-6 pt-4">
                                <div><div className="text-2xl font-semibold text-secondary-900">500+</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Donations</div></div>
                                <div><div className="text-2xl font-semibold text-secondary-900">1K+</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Trees Tagged</div></div>
                                <div><div className="text-2xl font-semibold text-secondary-900">200+</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Active Members</div></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-nss-100 to-nss-200 border border-nss-200 flex items-center justify-center text-secondary-400 text-sm">Image Placeholder</div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="bg-white border-y border-nss-100 py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-14 items-start">
                        <div className="space-y-6 lg:col-span-1">
                            <h2 className="text-3xl font-semibold text-secondary-900">Mission & Vision</h2>
                            <p className="text-secondary-600 leading-relaxed">Our framework elevates volunteerism beyond checkbox tasks. We equip institutions with transparency and students with motivation through recognition and verified milestones.</p>
                        </div>
                        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-2xl bg-nss-100 border border-nss-200 hover:shadow-sm transition">
                                <div className="flex items-center gap-3 mb-4 text-nss-700"><Target className="h-6 w-6" /><span className="font-medium">Our Mission</span></div>
                                <p className="text-sm leading-relaxed text-secondary-700">To streamline community engagement by providing a unified portal where student initiatives are documented, validated, and celebrated.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-nss-100 border border-nss-200 hover:shadow-sm transition">
                                <div className="flex items-center gap-3 mb-4 text-nss-700"><HeartHandshake className="h-6 w-6" /><span className="font-medium">Our Vision</span></div>
                                <p className="text-sm leading-relaxed text-secondary-700">To cultivate a culture where measurable social contribution becomes a fundamental pillar of holistic education and leadership.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-24 bg-nss-50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
                            <div className="space-y-4 max-w-xl">
                                <h2 className="text-3xl font-semibold text-secondary-900">Our Team</h2>
                                <p className="text-secondary-600">A cross‑functional group focused on product quality, transparency, and sustainable impact enablement.</p>
                            </div>
                            <button className="self-start md:self-auto px-5 py-3 rounded-full bg-nss-600 text-white text-sm font-medium hover:bg-nss-700 transition">Open Positions</button>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map((m, i) => (
                                <div key={i} className="group p-6 bg-white rounded-xl border border-nss-200 hover:border-nss-300 transition flex flex-col gap-4">
                                    <div className="w-12 h-12 rounded-full bg-nss-200 flex items-center justify-center text-nss-600 text-sm font-medium">{m.name.charAt(0)}</div>
                                    <div>
                                        <h3 className="font-medium text-secondary-900 mb-1">{m.name}</h3>
                                        <p className="text-xs uppercase tracking-wide text-secondary-500">{m.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-24 bg-white">
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

                {/* Call to Action */}
                <section className="py-24 bg-nss-light-gradient">
                    <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-semibold text-secondary-900">Join Us in Making a Difference</h2>
                        <p className="text-secondary-700 max-w-2xl mx-auto">Be part of an accountable movement. Track impact, inspire peers, and help scale sustainable initiatives across campuses.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="px-8 py-4 rounded-full bg-nss-600 text-white font-medium hover:bg-nss-700 transition">Get Started</button>
                            <button className="px-8 py-4 rounded-full border border-nss-300 text-secondary-700 hover:bg-nss-100 transition font-medium">Learn More</button>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-start">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-semibold text-secondary-900">Get in Touch</h2>
                                <p className="text-secondary-600 max-w-md">We\'d love to hear from you—whether you\'re a student, faculty member, or organization seeking collaboration.</p>
                            </div>
                            <ul className="space-y-6 text-sm">
                                <li className="flex gap-4 items-start"><Mail className="h-5 w-5 text-nss-600 mt-0.5" /><div><div className="font-medium text-secondary-800">Email</div><a href="mailto:team@nssapp.org" className="text-secondary-600 hover:text-nss-600">team@nssapp.org</a></div></li>
                                <li className="flex gap-4 items-start"><Phone className="h-5 w-5 text-nss-600 mt-0.5" /><div><div className="font-medium text-secondary-800">Phone</div><p className="text-secondary-600">+1 (555) 123-4567</p></div></li>
                                <li className="flex gap-4 items-start"><MapPin className="h-5 w-5 text-nss-600 mt-0.5" /><div><div className="font-medium text-secondary-800">Office</div><p className="text-secondary-600">123 Campus Rd, City, Country</p></div></li>
                            </ul>
                        </div>
                        <div className="aspect-[4/3] rounded-2xl bg-nss-100 border border-nss-200 flex items-center justify-center text-secondary-400 text-sm">Map / Illustration Placeholder</div>
                    </div>
                </section>
            </main>
            <FooterSection />
        </div>
    );
}
