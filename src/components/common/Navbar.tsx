import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
    user?: {
        name: string;
        role: string;
    };
    onLogout?: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', href: '#', active: true },
        { name: 'Blood Donation', href: '#' },
        { name: 'Tree Tagging', href: '#' },
        { name: 'Activities', href: '#' },
        {
            name: 'More',
            href: '#',
            hasDropdown: true,
            dropdownItems: [
                { name: 'Profile', href: '#' },
                { name: 'History', href: '#' },
                { name: 'Settings', href: '#' }
            ]
        }
    ];

    return (
        <nav className="bg-black/95 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">NSS</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <div key={link.name} className="relative">
                                    {link.hasDropdown ? (
                                        <div>
                                            <button
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${link.active
                                                        ? 'text-white'
                                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {link.name}
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 py-2">
                                                    {link.dropdownItems?.map((item) => (
                                                        <a
                                                            key={item.name}
                                                            href={item.href}
                                                            className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                                        >
                                                            {item.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${link.active
                                                    ? 'text-white'
                                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {link.name}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="hidden md:block">
                        <button
                            onClick={onLogout}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white/70 hover:text-white p-2"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <div key={link.name}>
                                <a
                                    href={link.href}
                                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${link.active
                                            ? 'text-white bg-white/10'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {link.name}
                                </a>
                                {link.hasDropdown && link.dropdownItems?.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="block px-6 py-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        ))}
                        <button
                            onClick={onLogout}
                            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
