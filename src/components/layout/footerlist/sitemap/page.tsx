import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function Sitemap() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold mb-6">网站地图</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">主要页面</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">首页</Link>
              </li>
              <li>
                <Link href="/categories" className="text-blue-600 hover:underline">小说分类</Link>
              </li>
              <li>
                <Link href="/about" className="text-blue-600 hover:underline">关于我们</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">法律相关</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-blue-600 hover:underline">隐私政策</Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-600 hover:underline">服务条款</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
} 