import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function About() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold mb-6">关于我们</h1>
        <div className="prose max-w-none">
          <p>
            Novel Reader 是一个致力于为读者提供优质阅读体验的在线小说平台。
            我们提供丰富的小说内容，包括奇幻、言情、悬疑、科幻等多个类别。
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
} 