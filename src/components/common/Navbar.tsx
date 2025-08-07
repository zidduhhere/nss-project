import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { OutlinedButton, FilledButton } from '../ui';

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
        <nav className="bg-transparent py-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-nss-700 backdrop-blur-lg border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between h-16 px-6">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center">
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
                                                    <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 py-2 z-50">
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

                        {/* Action Buttons */}
                        <div className="hidden md:flex items-center space-x-3">
                            <OutlinedButton
                                onClick={onLogout}
                                size="md"
                            >
                                Sign In
                            </OutlinedButton>
                            <FilledButton
                                onClick={onLogout}
                                size="md"
                                variant="primary"
                            >
                                Sign Up
                            </FilledButton>
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
            </div>

            {/* Mobile Side Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>

                    {/* Side Menu */}
                    <div className="fixed top-0 right-0 w-80 h-full bg-black/95 backdrop-blur-lg border-l border-white/10 transform transition-transform duration-300 ease-in-out">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">NSS</span>
                                    </div>
                                    <span className="text-white font-semibold">Menu</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-white/70 hover:text-white p-2"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 px-6 py-4 space-y-2">
                                {navLinks.map((link) => (
                                    <div key={link.name}>
                                        <a
                                            href={link.href}
                                            className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${link.active
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
                                                className="block px-8 py-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 border-t border-white/10 space-y-3">
                                <OutlinedButton
                                    onClick={onLogout}
                                    size="lg"
                                    className="w-full"
                                >
                                    Sign In
                                </OutlinedButton>
                                <FilledButton
                                    onClick={onLogout}
                                    size="lg"
                                    variant="primary"
                                    className="w-full"
                                >
                                    Sign Up
                                </FilledButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
