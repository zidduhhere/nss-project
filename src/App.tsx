// Root application module: wires global context (AppProvider) and declarative routing.
// Front-end only demo: all routes render directly without auth guards.
import { Routes, Route } from 'react-router-dom';
import { appRoutes, notFoundRoute } from '@/routes/routeConfig';
import { Suspense } from 'react';
import { GlobalLoader } from '@/components/common/GlobalLoader';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ProtectedRoute from './routes/ProtectedRoute';

function AppContent() {
  return (
    <Routes>
      {appRoutes.map(route => {
        // For protected routes, wrap the component with ProtectedRoute
        if (route.protected) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute component={route.component} roles={route.roles} />}
            />
          );
        }

        // For regular routes, wrap with Suspense for lazy loading
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<GlobalLoader />}>
                <route.component />
              </Suspense>
            }
          />
        );
      })}
      <Route
        path={notFoundRoute.path}
        element={
          <Suspense fallback={<GlobalLoader />}>
            <notFoundRoute.component />
          </Suspense>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <div className="font-sans antialiased">
        <AppContent />
      </div>
    </ErrorBoundary>
  );
}

export default App;
