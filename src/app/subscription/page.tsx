import { PlanList } from "@/components/subscription/PlanList";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">choose your membership plan</h1>
          <p className="text-lg text-gray-600">unlock more interesting content and exclusive privileges</p>
        </div> 

        <PlanList />
      </div>
    </div>
  );
} 