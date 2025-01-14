import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold mb-6">服务条款</h1>
        <div className="prose max-w-none">
          <p>
            欢迎使用 Novel Reader。使用我们的服务即表示您同意以下条款。
            请仔细阅读这些条款。
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
} 