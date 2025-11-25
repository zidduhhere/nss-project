import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Code2, Palette, Github, Linkedin, Mail, Sparkles, BadgeCheck, Triangle } from 'lucide-react';

export default function WebsiteTeamView() {

    const teamMembers = [
        {
            name: 'Abi Alif',
            role: 'Full-Stack Developer',
            photo: 'https://odyekfdkauucgacbsbub.supabase.co/storage/v1/object/public/website-images/abialif.webp',
            icon: Code2,
            primaryColor: 'nss',
            accentColor: 'blue',
            description: 'Architecting some hooks and components and some kunj kunj karyams'
        },
        {
            name: 'Aleena Jaison',
            role: 'UI/UX Designer',
            photo: 'https://odyekfdkauucgacbsbub.supabase.co/storage/v1/object/public/website-images/aleena.webp',
            icon: Palette,
            primaryColor: 'tree',
            accentColor: 'nss',
            description: 'Crafting intuitive and delightful user experiences'
        },
        {
            name: 'Fazil S',
            role: 'UI & Brand Designer',
            photo: 'https://odyekfdkauucgacbsbub.supabase.co/storage/v1/object/public/website-images/faizi.webp',
            icon: Triangle,
            primaryColor: 'blue',
            accentColor: 'tree',
            description: 'Designing cohesive brand identities and engaging user interfaces'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-nss-50/40 font-isans relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-nss-100/40 to-blue-100/40 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-tree-100/40 to-nss-100/40 rounded-full blur-3xl -z-10" />
            
            <Navbar />
            
            {/* Hero Section */}
            <main className="pt-24 pb-20 relative">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-nss-50 to-blue-50 border border-nss-200/50 text-nss-700 rounded-full text-sm font-semibold mb-6 shadow-sm hover:shadow-md transition-shadow">
                            <Sparkles className="w-4 h-4 text-nss-600" />
                            <span>Development Team</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-nss-600 via-blue-600 to-tree-600 animate-gradient">
                                The Team Hyphen
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                            Meet the passionate developers and designers bringing the NSS portal to life with 
                            <span className="font-semibold text-nss-600"> cutting-edge technology</span> and 
                            <span className="font-semibold text-tree-600"> thoughtful design</span>.
                        </p>
                    </div>

                    {/* Team Cards */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-9xl mx-auto mb-16">
                        {teamMembers.map((member, index) => (
                            <div 
                                key={index} 
                                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100/50 hover:border-gray-200 hover:-translate-y-2"
                            >
                                {/* Animated Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-${member.primaryColor}-50/50 via-white to-${member.accentColor}-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                                
                                {/* Decorative Corner Element */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${member.primaryColor}-100/30 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                                
                                {/* Content */}
                                <div className="relative p-10">
                                    {/* Icon Badge */}
                                    <div className={`absolute top-8 right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-${member.primaryColor}-500 to-${member.accentColor}-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 group-hover:shadow-${member.primaryColor}-300/50`}>
                                        <member.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Photo with Shake Animation */}
                                    <div className="relative mb-8 w-40 h-40 mx-auto">
                                        {/* Glowing Ring */}
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-${member.primaryColor}-400 to-${member.accentColor}-500 opacity-20 blur-2xl group-hover:opacity-40 group-hover:scale-110 transition-all duration-700`} />
                                        
                                        {/* Photo Frame */}
                                        <div className="absolute inset-0 rounded-full">
                                            <img 
                                                src={member.photo} 
                                                alt={member.name}
                                                className="w-full h-full rounded-full object-cover shadow-2xl transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500"
                                            />
                                        </div>
                                        
                                        {/* Verified Badge */}
                                        
                                    </div>

                                    {/* Info */}
                                    <div className="text-center space-y-4">
                                        <div className='flex flex-row justify-center items-center gap-2'>
                                        <h2 className={`text-3xl font-bold text-gray-900 group-hover:text-${member.primaryColor}-700 transition-colors duration-300`}>
                                            {member.name}
                                        </h2>
                                        <div className=" w-4 h-4 rounded-full bg-blue-800 flex items-center justify-center shadow-lg border-3 border-white group-hover:scale-110 transition-transform duration-300">
                                            <BadgeCheck className="w-7 h-7 text-white fill-blue-600" />
                                        </div>
                                        </div>
                                        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-${member.primaryColor}-100 to-${member.accentColor}-100 border border-${member.primaryColor}-200/50 shadow-sm`}>
                                            <div className={`w-2 h-2 rounded-full bg-${member.primaryColor}-500 animate-pulse`} />
                                            <span className={`text-sm font-bold text-${member.primaryColor}-700`}>
                                                {member.role}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-base leading-relaxed pt-2 px-4">
                                            {member.description}
                                        </p>
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-200/50">
                                        <button className="group/btn p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-nss-50 hover:to-nss-100 text-gray-600 hover:text-nss-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110">
                                            <Github className="w-5 h-5" />
                                        </button>
                                        <button className="group/btn p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 text-gray-600 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110">
                                            <Linkedin className="w-5 h-5" />
                                        </button>
                                        <button className="group/btn p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-tree-50 hover:to-tree-100 text-gray-600 hover:text-tree-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110">
                                            <Mail className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="text-center">
                        <div className="inline-block px-10 py-5 bg-nss-50 rounded-xl border border-nss-200">
                            <p className="text-gray-800 font-semibold text-lg">
                                Want to contribute and join our amazing team? 
                                <a href="/contact" className="ml-2 text-nss-600 hover:text-nss-700 font-bold hover:underline transition-colors inline-flex items-center gap-1">
                                    Get in touch
                                    <span className="transition-transform">→</span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
