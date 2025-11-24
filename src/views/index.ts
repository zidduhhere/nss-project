// Central export for all views
export * from "./auth";
// Faculty views removed -> replaced by UNIT role (no direct views export needed)
export { default as AboutView } from "@/views/miscellaneous/about/AboutView";
export { default as BloodDonationView } from "@/views/miscellaneous/blood-donation/BloodDonationView";
export { default as TreeTagView } from "@/views/miscellaneous/tree-tag/TreeTagView";
export { default as ActivitiesView } from "@/views/miscellaneous/activities/ActivitiesView";
export { default as BlogView } from "@/views/miscellaneous/blog/BlogView";
export { default as WebsiteTeamView } from "@/views/miscellaneous/website-team/WebsiteTeamView";
export { default as ContactView } from "@/views/contact/ContactView";
