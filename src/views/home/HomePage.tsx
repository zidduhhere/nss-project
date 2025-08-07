import { ArrowRight, Heart, TreePine, Users, Award, Calendar } from 'lucide-react';
import { Navbar } from '../../components/common';

interface HomePageProps {
    onGetStarted?: () => void;
    onLearnMore?: () => void;
}

export default function HomePage({ }: HomePageProps) {
    const features = [
        {
            icon: Heart,
            title: 'Blood Donation',
            description: 'Save lives by donating blood and track your donations for NSS points.',
            color: 'bg-red-500'
        },
        {
            icon: TreePine,
            title: 'Tree Tagging',
            description: 'Contribute to environmental conservation through tree planting and tagging.',
            color: 'bg-green-500'
        },
        {
            icon: Users,
            title: 'Community Service',
            description: 'Engage in various community service activities and make a difference.',
            color: 'bg-blue-500'
        },
        {
            icon: Award,
            title: 'Earn Points',
            description: 'Get recognition for your contributions with our point-based system.',
            color: 'bg-yellow-500'
        }
    ];


    return (
        <div className="min-h-screen bg-white">
            <Navbar onLogout={() => console.log('Logout clicked')} />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Text Content */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-isans  text-black leading-tight">
                                    Empower Your Community with NSS
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Join the National Service Scheme and contribute to society through blood donation,
                                    environmental conservation, and community service. Track your impact and earn recognition
                                    for your valuable contributions.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="group inline-flex items-center justify-center px-8 text-lg font-semibold text-white bg-nss-600 hover:bg-nss-700 rounded-full transition-all duration-200 transform hover:shadow-xl">
                                    About Us
                                    <ArrowRight className="mlj-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </button>
                                <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-800 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-full transition-all duration-200">
                                    Sign In
                                </button>
                            </div>

                            {/* Stats Preview */}
                            <div className="grid grid-cols-3 gap-6 pt-8">
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-gray-800">500+</div>
                                    <div className="text-sm text-gray-500">Blood Donations</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-gray-800">1000+</div>
                                    <div className="text-sm text-gray-500">Trees Planted</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-gray-800">200+</div>
                                    <div className="text-sm text-gray-500">Active Members</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                    alt="Community Service"
                                    className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                                />
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl p-4 shadow-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-red-500 p-2 rounded-lg">
                                        <Heart className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-gray-800 font-semibold">Blood Donation</div>
                                        <div className="text-gray-600 text-sm">Save Lives</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl p-4 shadow-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-500 p-2 rounded-lg">
                                        <TreePine className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-gray-800 font-semibold">Tree Tagging</div>
                                        <div className="text-gray-600 text-sm">Go Green</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
