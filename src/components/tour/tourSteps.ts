import { TourConfig } from "./types";

export const studentTourConfig: TourConfig = {
  tourId: "student_dashboard",
  steps: [
    {
      target: '[data-tour="nav-volunteer-registration"]',
      title: "Register as a Volunteer",
      description:
        "Start your NSS journey by registering as a volunteer through this page.",
      placement: "bottom",
    },
    {
      target: '[data-tour="nav-submit-certificate"]',
      title: "Submit Activities",
      description:
        "Upload your blood donation or tree tagging certificates here for review.",
      placement: "bottom",
    },
    {
      target: '[data-tour="stat-cards"]',
      title: "Your Activity Stats",
      description:
        "Track your total activities, blood donations, tree tagging, and pending reviews at a glance.",
      placement: "bottom",
    },
    {
      target: '[data-tour="quick-actions"]',
      title: "Quick Actions",
      description:
        "Quickly submit a new activity or view your profile from here.",
      placement: "left",
    },
    {
      target: '[data-tour="recent-activities"]',
      title: "Recent Activities",
      description:
        "See your most recent submissions and their current approval status.",
      placement: "top",
    },
  ],
};

export const unitTourConfig: TourConfig = {
  tourId: "unit_dashboard",
  steps: [
    {
      target: '[data-tour="nav-volunteers"]',
      title: "Manage Volunteers",
      description:
        "View, approve, or reject volunteer registrations for your unit.",
      placement: "bottom",
    },
    {
      target: '[data-tour="nav-submissions"]',
      title: "Review Submissions",
      description:
        "Review blood donation and tree tagging submissions from your volunteers.",
      placement: "bottom",
    },
    {
      target: '[data-tour="stat-cards"]',
      title: "Unit Statistics",
      description:
        "Overview of your total, approved, certified, pending, and rejected volunteers.",
      placement: "bottom",
    },
    {
      target: '[data-tour="college-courses"]',
      title: "Manage Courses",
      description:
        "Add or remove courses offered at your college for volunteer registration.",
      placement: "top",
    },
    {
      target: '[data-tour="quick-stats"]',
      title: "Quick Stats",
      description:
        "See your unit's approval rate, pending reviews, and active member count.",
      placement: "right",
    },
  ],
};

export const adminTourConfig: TourConfig = {
  tourId: "admin_dashboard",
  steps: [
    {
      target: '[data-tour="stat-cards"]',
      title: "System Overview",
      description:
        "Monitor total volunteers, pending approvals, approved count, and active units.",
      placement: "bottom",
    },
    {
      target: '[data-tour="recent-registrations"]',
      title: "Recent Registrations",
      description:
        "See the latest volunteer registrations across all units in the system.",
      placement: "top",
    },
    {
      target: '[data-tour="quick-actions"]',
      title: "Quick Actions",
      description:
        "Jump to volunteer management, user management, or your admin profile.",
      placement: "top",
    },
    {
      target: '[data-tour="refresh-button"]',
      title: "Refresh Data",
      description:
        "Click here to refresh all dashboard statistics with the latest data.",
      placement: "bottom",
    },
  ],
};
