import { TextField } from "@/components/ui"


const AdminLogin = () => {
    return (
        <div className="flex flex-col max-w-md mx-auto p-8 bg-white">
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <form className="space-y-4 mt-4 ">
                <TextField label="Email" name="email" required />
                <TextField label="Password" name="password" type="password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default AdminLogin
