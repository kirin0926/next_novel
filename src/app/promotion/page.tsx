import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PromotionPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">推广中心</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl mb-4">我的推广数据</h2>
        {/* 这里添加推广相关的内容 */}
      </div>
    </div>
  );
}