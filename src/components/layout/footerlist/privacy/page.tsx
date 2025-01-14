import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold mb-6">隐私政策</h1>
        <div className="prose max-w-none">
          <p>
            我们重视您的隐私，并致力于保护您的个人信息。
            本隐私政策说明了我们如何收集、使用和保护您的信息。
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
} 