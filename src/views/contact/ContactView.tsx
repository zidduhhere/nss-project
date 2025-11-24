import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function ContactView() {
    return (
        <div className="min-h-screen bg-white font-isans">
            <Navbar />
            <main className="pt-32 max-w-5xl mx-auto px-6 pb-24 space-y-10">
                <div>
                    <h1 className="text-4xl font-semibold text-secondary-900 mb-6">Contact Us</h1>
                    <p className="text-secondary-600 leading-relaxed max-w-3xl">Reach out for collaborations, support, or feedback. We value community participation.</p>
                </div>
                <form className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary-800">Name</label>
                        <input className="w-full rounded-lg border border-nss-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nss-500 bg-nss-50" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary-800">Email</label>
                        <input type="email" className="w-full rounded-lg border border-nss-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nss-500 bg-nss-50" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary-800">Message</label>
                        <textarea rows={5} className="w-full rounded-lg border border-nss-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nss-500 bg-nss-50" placeholder="How can we help?" />
                    </div>
                    <button type="button" className="px-6 py-3 rounded-full bg-nss-600 hover:bg-nss-700 text-white text-sm font-medium">Send Message</button>
                </form>
            </main>
            <Footer />
        </div>
    );
}
