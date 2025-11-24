
interface SuccessModalProps {
    title: string;
    message: string;
}

const SuccessModal = ({ title, message }: SuccessModalProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600">
                    {message}
                </p>
            </div>
        </div>
    )
}

export default SuccessModal;
