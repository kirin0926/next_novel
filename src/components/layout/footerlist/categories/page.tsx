import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Categories() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold mb-6">小说分类</h1>
        {/* Add categories content here */}
      </div>

      <Footer />
    </main>
  );
} 