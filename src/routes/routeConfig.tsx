import { lazy, ComponentType } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy-loaded route components
const HomePage = lazy(() => import('@/views/miscellaneous/home/HomeView'));
const AboutView = lazy(() => import('@/views/miscellaneous/about/AboutView'));
const BloodDonationView = lazy(() => import('@/views/miscellaneous/blood-donation/BloodDonationView'));
const TreeTagView = lazy(() => import('@/views/miscellaneous/tree-tag/TreeTagView'));
const BlogView = lazy(() => import('@/views/miscellaneous/blog/BlogView'));
const WebsiteTeamView = lazy(() => import('@/views/miscellaneous/website-team/WebsiteTeamView'));
const ContactView = lazy(() => import('@/views/contact/ContactView'));
const LoginView = lazy(() => import('@/views/auth/login/LoginView'));
const FacultyLoginView = lazy(() => import('@/views/auth/faculty-login/FacultyLoginView'));
const RegisterView = lazy(() => import('@/views/auth/register/RegisterView'));
const StudentDashboard = lazy(() => import('@/components/student/StudentDashboard'));
const FacultyDashboard = lazy(() => import('@/components/faculty/FacultyDashboard'));
const NotFoundView = lazy(() => import('../views/miscellaneous/not-found/NotFoundView'));

export interface AppRoute {
    path: string;
    label?: string;        // For navbar
    nav?: boolean;         // Should appear in navbar
    protected?: boolean;   // Requires auth
    roles?: Array<'student' | 'faculty'>; // Allowed roles
    component: ComponentType<any>;
}

// NOTE: Order matters: root redirect should precede wildcard in final rendering.
export const appRoutes: AppRoute[] = [
    // Redirect legacy '/' to new '/home' path
    { path: '/', component: () => <Navigate to="/home" replace /> },
    { path: '/home', label: 'Home', nav: true, component: HomePage },
    { path: '/about', label: 'About Us', nav: true, component: AboutView },
    { path: '/blood-donation', label: 'Blood Donation', nav: true, component: BloodDonationView },
    { path: '/tree-tag', label: 'Tree Tag', nav: true, component: TreeTagView },
    { path: '/blog', label: 'Blog', component: BlogView },
    { path: '/website-team', label: 'Website Team', component: WebsiteTeamView },
    { path: '/contact', label: 'Contact Us', component: ContactView },
    { path: '/login', component: LoginView },
    { path: '/login/faculty', component: FacultyLoginView },
    { path: '/register', component: RegisterView },
    // Dashboards now unprotected in front-end only mode
    { path: '/dashboard/student', component: StudentDashboard },
    { path: '/dashboard/faculty', component: FacultyDashboard },
];

export const notFoundRoute: AppRoute = { path: '*', component: NotFoundView };
