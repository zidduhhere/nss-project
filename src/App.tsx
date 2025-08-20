// Root application module: wires global context (AppProvider) and declarative routing.
// Front-end only demo: all routes render directly without auth guards.
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import { appRoutes, notFoundRoute } from '@/routes/routeConfig';
import { Suspense } from 'react';
import { GlobalLoader } from '@/components/common/GlobalLoader';



function AppContent() {
  return (
    <Routes>
      {/** Iterate all configured routes (no protected logic in front-end only mode). */}
      {appRoutes.map(route => (
        <Route key={route.path} path={route.path} element={<route.component />} />
      ))}
      {/** Wildcard / 404 route must come last to catch unmatched paths */}
      <Route path={notFoundRoute.path} element={<notFoundRoute.component />} />
    </Routes>
  );
}

function App() {
  return (
    // AppProvider supplies auth + submission state globally.
    <AuthProvider>
      <AppProvider>
        {/* font-sans + antialiased sets typography baseline; all view components render inside */}
        <div className="font-sans antialiased">
          <Suspense fallback={<GlobalLoader />}>
            <AppContent />
          </Suspense>
        </div>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;