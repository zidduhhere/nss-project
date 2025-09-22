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
const UnitLoginView = lazy(() => import('@/views/auth/unit-login/UnitLoginView'));
const RegisterView = lazy(() => import('@/views/auth/register/RegisterView'));
const StudentDashboard = lazy(() => import('@/views/dashboard/student/StudentDashboard'));
const StudentProfile = lazy(() => import('@/views/dashboard/student/StudentProfile'));
const CertificateSubmission = lazy(() => import('@/views/dashboard/student/CertificateSubmission'));
const ActivitySubmissionPage = lazy(() => import('@/views/dashboard/student/ActivitySubmissionPage'));
const UnitDashboard = lazy(() => import('@/views/dashboard/unit/UnitDashboard'));
const UnitProfile = lazy(() => import('@/views/dashboard/unit/UnitProfile'));
const UnitVolunteers = lazy(() => import('@/views/dashboard/unit/UnitVolunteers'));
const UnitSubmissions = lazy(() => import('@/views/dashboard/unit/UnitSubmissions'));
const UnitActivity = lazy(() => import('@/views/dashboard/unit/UnitActivity'));
const NotFoundView = lazy(() => import('../views/miscellaneous/not-found/NotFoundView'));

export interface AppRoute {
    path: string;
    label?: string;        // For navbar
    nav?: boolean;

    protected?: boolean;   // Requires auth
    roles?: Array<'student' | 'unit'>; // Allowed roles
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
    { path: '/login/unit', component: UnitLoginView },
    // Legacy redirect
    { path: '/login/faculty', component: () => <Navigate to="/login/unit" replace /> },
    { path: '/register', component: RegisterView },
    // Dashboards now unprotected in front-end only mode
    { path: '/dashboard/student', component: StudentDashboard, protected: true, roles: ['student'] },
    { path: '/dashboard/student/profile', component: StudentProfile, protected: true, roles: ['student'] },
    { path: '/dashboard/student/certificates', component: CertificateSubmission, protected: true, roles: ['student'] },
    { path: '/dashboard/student/submit', component: ActivitySubmissionPage, protected: true, roles: ['student'] },
    { path: '/dashboard/unit', component: UnitDashboard, protected: true, roles: ['unit'] },
    { path: '/dashboard/unit/profile', component: UnitProfile, protected: true, roles: ['unit'] },
    { path: '/dashboard/unit/volunteer', component: UnitVolunteers },
    { path: '/dashboard/unit/submissions', component: UnitSubmissions, protected: true, roles: ['unit'] },
    { path: '/dashboard/unit/activity', component: UnitActivity, protected: true, roles: ['unit'] },
    // Legacy redirect
    { path: '/dashboard/faculty', component: () => <Navigate to="/dashboard/unit" replace /> },
];

export const notFoundRoute: AppRoute = { path: '*', component: NotFoundView };



