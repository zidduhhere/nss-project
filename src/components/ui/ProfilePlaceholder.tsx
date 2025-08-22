import { LucideUser } from 'lucide-react'


interface ProfilePlaceholderProps {
    size?: 'sm' | 'lg';

}

const ProfilePlaceholder = ({ size }: ProfilePlaceholderProps) => {
    return (
        <div className={`flex flex-center justify-center items-center ${size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'} bg-nss-50 text-nss-700 hover:bg-nss-200 border border-nss-200 rounded-full`}>
            <LucideUser className={`w-${size === 'lg' ? '6' : '5'} h-${size === 'lg' ? '6' : '5'} text-black`} />
        </div>
    )
}

export default ProfilePlaceholder
