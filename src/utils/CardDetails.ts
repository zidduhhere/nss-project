import {
  Heart,
  Users,
  BookOpen,
  Award,
  TreePine,
  Globe,
  Lightbulb,
  Target,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NSSCard {
  icon: LucideIcon;
  title: string;
  message: string;
}

export const nssCards: NSSCard[] = [
  {
    icon: Heart,
    title: "Community Service",
    message: "Serve with passion and make a difference",
  },
  {
    icon: Users,
    title: "Unity in Diversity",
    message: "Building bridges across communities",
  },
  {
    icon: BookOpen,
    title: "Education for All",
    message: "Empowering through knowledge and learning",
  },
  {
    icon: Award,
    title: "Excellence",
    message: "Striving for excellence in service",
  },
  {
    icon: TreePine,
    title: "Environment",
    message: "Protecting our planet for future generations",
  },
  {
    icon: Globe,
    title: "Social Impact",
    message: "Creating positive change in society",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    message: "Creative solutions for social challenges",
  },
  {
    icon: Target,
    title: "Purpose Driven",
    message: "Working towards meaningful goals",
  },
];
