import RegisterLeftSide from './RegisterLeftSide';
import RegisterRightSide from './RegisterRightSide';

export default function RegisterView() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-nss-50 via-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="grid lg:grid-cols-2 w-full ">
                {/* Left Side - Register Form */}
                <RegisterLeftSide />

                {/* Right Side - NSS Mission Cards */}
                <RegisterRightSide />
            </div>
        </div>
    );
}
