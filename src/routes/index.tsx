import { createFileRoute } from "@tanstack/react-router";
import { CountryDashboard } from "@/components/CountryDashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <CountryDashboard />
    </div>
  );
}
