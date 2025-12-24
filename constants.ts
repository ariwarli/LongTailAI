import { ProjectDetails } from "./types";

export const MOCK_DELAY_MS = 1500;

export const INITIAL_KEYWORDS = [
  "cara membuat kopi susu gula aren",
  "jasa seo jakarta murah",
  "laptop gaming terbaik 2025 harga 10 jutaan",
  "resep nasi goreng abang abang",
  "wisata hidden gem bandung selatan"
];

export const DEMO_PROJECT_ID = 'proj_demo_123';

export const MOCK_PROJECT_DETAILS: ProjectDetails = {
  id: DEMO_PROJECT_ID,
  name: "Demo Project: Coffee Trends 2025",
  description: "A strategic keyword research initiative to dominate the artisanal coffee market in Indonesia for Q3-Q4 2025. Focusing on long-tail home brewing queries and equipment reviews.",
  goal: "Identify 50+ high-opportunity long-tail keywords with KD < 30 to support the launch of the new 'Barista at Home' content hub.",
  status: "Active",
  deadline: "2025-10-30",
  owner: "Dimas Anggara",
  health: "On Track",
  locale: "ID"
};