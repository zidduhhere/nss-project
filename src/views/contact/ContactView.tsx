import { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';
import { contactService } from '@/services/contactService';
import { Send, CheckCircle, AlertCircle, Mail, MessageSquare } from 'lucide-react';

export default function ContactView() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Basic validation
        if (!name.trim() || !email.trim() || !message.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            await contactService.submitContactForm({ name: name.trim(), email: email.trim(), message: message.trim() });
            setSuccess(true);
            setName('');
            setEmail('');
            setMessage('');
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-isans">
            <Navbar />
            <main className="pt-32 max-w-5xl mx-auto px-6 pb-24 space-y-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-nss-50 border border-nss-200/50 text-nss-700 rounded-full text-sm font-semibold mb-4">
                        <MessageSquare className="w-4 h-4" />
                        <span>Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">Contact Us</h1>
                    <p className="text-secondary-600 leading-relaxed max-w-3xl text-lg">
                        Reach out for collaborations, support, or feedback. We value community participation.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-10">
                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 md:col-span-3">
                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-800">Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-nss-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nss-500 bg-nss-50 transition-shadow"
                                placeholder="Your name"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-800">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-nss-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nss-500 bg-nss-50 transition-shadow"
                                placeholder="you@example.com"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-800">Message</label>
                            <textarea
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full rounded-lg border border-nss-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nss-500 bg-nss-50 transition-shadow resize-none"
                                placeholder="How can we help?"
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-nss-600 hover:bg-nss-700 disabled:bg-nss-300 text-white text-sm font-medium transition-colors shadow-md hover:shadow-lg disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>

                    {/* Contact Info Sidebar */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-2xl bg-gradient-to-br from-nss-50 to-nss-100/50 border border-nss-200/50 p-6 space-y-4">
                            <h3 className="font-semibold text-secondary-900">NSS Kerala</h3>
                            <div className="space-y-3 text-sm text-secondary-600">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-nss-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-secondary-700">Email</p>
                                        <p>nss@kerala.gov.in</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-secondary-50 border border-secondary-100 p-6">
                            <h3 className="font-semibold text-secondary-900 mb-2">Response Time</h3>
                            <p className="text-sm text-secondary-500 leading-relaxed">
                                We typically respond within 2-3 business days. For urgent matters, please mention it in your message.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
