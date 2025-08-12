import HomePage from '@/views/home/HomeView';
import { AboutView, BloodDonationView, TreeTagView, LoginView, RegisterView, BlogView, WebsiteTeamView, ContactView } from '@/views';
import StudentDashboard from '@/components/student/StudentDashboard';
import FacultyDashboard from '@/components/faculty/FacultyDashboard';
import NotFoundView from '../views/not-found/NotFoundView';
import { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';

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
    // Redirect legacy '/' to new '/hom' path
    { path: '/', component: () => <Navigate to="/hom" replace /> },
    { path: '/hom', label: 'Home', nav: true, component: HomePage },
    { path: '/about', label: 'About Us', nav: true, component: AboutView },
    { path: '/blood-donation', label: 'Blood Donation', nav: true, component: BloodDonationView },
    { path: '/tree-tag', label: 'Tree Tag', nav: true, component: TreeTagView },
    { path: '/blog', label: 'Blog', component: BlogView },
    { path: '/website-team', label: 'Website Team', component: WebsiteTeamView },
    { path: '/contact', label: 'Contact Us', component: ContactView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/dashboard/student', protected: true, roles: ['student'], component: StudentDashboard },
    { path: '/dashboard/faculty', protected: true, roles: ['faculty'], component: FacultyDashboard },
];

export const notFoundRoute: AppRoute = { path: '*', component: NotFoundView };
