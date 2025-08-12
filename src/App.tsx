// Root application module: wires global context (AppProvider) and declarative routing.
// Routing is driven by a central routeConfig (appRoutes) so navigation + guards stay DRY.
// Protected routes (protected: true) are wrapped with <ProtectedRoute/> to enforce auth + role checks.
import { AppProvider } from './context/AppContext';
import { Routes, Route } from 'react-router-dom';
import { appRoutes, notFoundRoute } from '@/routes/routeConfig';
import ProtectedRoute from '@/routes/ProtectedRoute';

function AppContent() {
  return (
    <Routes>
      {/** Iterate all configured routes.
       *  If a route is marked protected we wrap its component in <ProtectedRoute/> which:
       *    - Redirects to /login when not authenticated.
       *    - Optionally enforces role-based access (roles array).
       *  Otherwise we render the component directly.
       */}
      {appRoutes.map(route => (
        route.protected ? (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute roles={route.roles} component={route.component} />}
          />
        ) : (
          <Route key={route.path} path={route.path} element={<route.component />} />
        )
      ))}
      {/** Wildcard / 404 route must come last to catch unmatched paths */}
      <Route path={notFoundRoute.path} element={<notFoundRoute.component />} />
    </Routes>
  );
}

function App() {
  return (
    // AppProvider supplies auth + submission state globally.
    <AppProvider>
      {/* font-sans + antialiased sets typography baseline; all view components render inside */}
      <div className="font-sans antialiased">
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;