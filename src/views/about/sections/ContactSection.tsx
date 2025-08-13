import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactSection = () => (
    <section className="py-24 bg-white reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
                <div className="space-y-4">
                    <h2 className="text-3xl font-semibold text-secondary-900">Get in Touch</h2>
                    <p className="text-secondary-600 max-w-md">We'd love to hear from you—whether you're a student, faculty member, or organization seeking collaboration.</p>
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
);
