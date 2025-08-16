import LoginForm from '@/components/forms/LoginForm';
// authenticateStudent removed (Supabase layer deprecated). Logic will be migrated
// to AuthViewModel + AuthBackend transport abstraction.

export default function LoginLeftSide() {
    return (
        <div className='flex items-center justify-center'>
            <LoginForm
                roleMode='student'
                onLogin={async ({ identifier, password }) => {
                    // TODO: Delegate to useAuthViewModel().login once integrated with new AuthBackend
                    console.log('Login attempt (student)', { identifier, password });
                    return false; // placeholder until hooked up
                }}
                isLoading={false}
                error={null}
            />
        </div>
    );
}
