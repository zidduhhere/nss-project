import BloodDonationForm from '@/components/student/BloodDonationForm';

export default function BloodDonationPage() {
    return (
        <main className="min-h-screen bg-white pt-24 max-w-4xl mx-auto px-6 pb-20">
            <h1 className="text-3xl font-bold mb-8 text-nss-text">Blood Donation</h1>
            <BloodDonationForm />
        </main>
    );
}
