import RecommendationDetailClient from "./RecommendationDetailClient";

export function generateStaticParams() {
  return [
    { id: "demo-rec-001" },
    { id: "rec-peshawar-001" },
    { id: "default" }
  ];
}

export default function Page() {
  return <RecommendationDetailClient />;
}
