import { Heart, TreePine } from 'lucide-react';
import { HeroButton } from '@/components/ui';
import React from 'react';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-white reveal-on-scroll">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-isans  text-black leading-tight">Empower Your Community with NSS</h1>
                            <p className="text-xl text-gray-600 leading-relaxed">Join the National Service Scheme and contribute to society through blood donation, environmental conservation, and community service. Track your impact and earn recognition for your valuable contributions.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <HeroButton icon onClick={() => { /* navigate to about maybe */ }}>
                                About Us
                            </HeroButton>
                            <HeroButton variant="outline" onClick={() => { /* navigate to sign in */ }}>
                                Sign In
                            </HeroButton>
                        </div>
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-gray-800">500+</div><div className="text-sm text-gray-500">Blood Donations</div></div>
                            <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-gray-800">1000+</div><div className="text-sm text-gray-500">Trees Planted</div></div>
                            <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-gray-800">200+</div><div className="text-sm text-gray-500">Active Members</div></div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative z-10">
                            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80&sat=20" alt="Community Service - Students Volunteering" className="rounded-2xl shadow-2xl w-full h-[500px] object-cover brightness-105" />
                        </div>
                        <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl p-4 shadow-lg">
                            <div className="flex items-center space-x-3">
                                <div className="bg-red-500 p-2 rounded-lg"><Heart className="h-6 w-6 text-white" /></div>
                                <div><div className="text-gray-800 font-semibold">Blood Donation</div><div className="text-gray-600 text-sm">Save Lives</div></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl p-4 shadow-lg">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-500 p-2 rounded-lg"><TreePine className="h-6 w-6 text-white" /></div>
                                <div><div className="text-gray-800 font-semibold">Tree Tagging</div><div className="text-gray-600 text-sm">Go Green</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
