import { AppProvider } from './context/AppContext';
import HomePage from './views/home/HomePage';

function AppContent() {
  // const { user, isAuthenticated } = useApp();
  // const [showRegister, setShowRegister] = useState(false);

  return (
    <HomePage />
  )

  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen">
  //       {showRegister ? (
  //         <RegisterView onSwitchToLogin={() => setShowRegister(false)} />
  //       ) : (
  //         <LoginView onSwitchToRegister={() => setShowRegister(true)} />
  //       )}
  //     </div>
  //   );
  // }

  // return (
  //   <div className="min-h-screen bg-nss-50">
  //     {user?.role === 'student' ? <StudentDashboard /> : <FacultyDashboard />}
  //   </div>
  // );
}

function App() {
  return (
    <AppProvider>
      <div className="font-sans antialiased">
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;