import React from 'react';
import HyphenLogo from '../../../utils/HyphenLogo';

export const FooterSection: React.FC = () => {
    return (
        <footer className="bg-nss-600 text-white py-10 mt-0 border-t border-nss-600/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left">
                    <h4 className="font-isans font-semibold text-lg">National Service Scheme Platform</h4>
                    <p className="text-white/70 text-sm max-w-md">Empowering students to contribute meaningfully to society through structured service, recognition and measurable impact.</p>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full">v1.0.0</span>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full">© {new Date().getFullYear()}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-4">
                    <div className="flex gap-6 text-sm text-white/80">
                        <a href="#" className="hover:text-white transition">Privacy</a>
                        <a href="#" className="hover:text-white transition">Terms</a>
                        <a href="#" className="hover:text-white transition">Support</a>
                    </div>
                    <HyphenLogo />
                </div>
            </div>
        </footer>
    );
};
