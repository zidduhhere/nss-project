import { AlertCircle } from 'lucide-react';

interface NoDataFoundProps {
    title: string;
    description: string;
    cta?: React.ReactNode;
}

/**
 * NoDataFound Component
 * 
 * A reusable component that displays a centered message when data is not available
 * or when a user needs to complete an action before accessing certain content.
 * 
 * @param {string} title - The main heading text
 * @param {string} description - The descriptive text explaining the situation
 * @param {React.ReactNode} cta - Optional call-to-action element (button, link, etc.)
 * 
 * @example
 * ```tsx
 * <NoDataFound
 *   title="No Data Available"
 *   description="There is no data to display at this time."
 *   cta={
 *     <Button onClick={handleAction}>
 *       Take Action
 *     </Button>
 *   }
 * />
 * ```
 */
const NoDataFound: React.FC<NoDataFoundProps> = ({ title, description, cta }) => {
    return (
        <div className="bg-gradient-to-br from-nss-50 to-blue-50 border-2 border-nss-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-nss-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-nss-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {title}
            </h3>
            <p className="text-gray-700 mb-6">
                {description}
            </p>
            {cta && <div>{cta}</div>}
        </div>
    );
};

export default NoDataFound;
