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

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">membership privileges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">unlimited reading</h3>
              <p className="text-gray-600">enjoy a large amount of novel content, unlimited reading of all kinds of interesting works</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">remove ads</h3>
              <p className="text-gray-600">pure reading experience, focus on immersing yourself in the story</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">membership privileges</h3>
              <p className="text-gray-600">premium membership identifier, offline download and other exclusive privileges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 