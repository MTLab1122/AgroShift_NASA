import FarmDetailClient from "./FarmDetailClient";

export function generateStaticParams() {
  return [
    { farmId: "demo-peshawar-001" },
    { farmId: "farm-peshawar-001" },
    { farmId: "default" }
  ];
}

export default function Page() {
  return <FarmDetailClient />;
}
