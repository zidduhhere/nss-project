

const DashboardNavigation = () => {
    return (
        <nav className="bg-transparent py-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6">
                <div className="flex items-center space-x-4 bg-black rounded-md">
                    <button className="text-white">Dashboard</button>
                    <button className="text-white">Profile</button>
                    <button className="text-white">Settings</button>
                </div>
            </div>
        </nav>
    )
}

export default DashboardNavigation
