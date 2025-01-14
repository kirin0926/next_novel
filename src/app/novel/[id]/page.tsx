import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Mock novel data - in a real app, this would come from an API or database
const getNovelById = (id: string) => {
  return {
    id,
    title: "The Great Adventure",
    author: "John Doe",
    likes: 1234,
    content: `
Chapter 1: The Beginning

The morning sun cast long shadows across the ancient stones of the fortress. Sarah stood at the edge of the battlements, her eyes scanning the horizon for any sign of movement. The wind whipped at her cloak, carrying with it the scent of pine and snow from the mountains.

She knew that somewhere out there, beyond the mist-shrouded valleys and towering peaks, lay the answers she had spent her entire life searching for. The ancient map in her pocket felt heavy with promise, its weathered parchment containing secrets that had remained hidden for centuries.

"Are you sure about this?" a voice called from behind her. Tom, her longtime friend and fellow explorer, approached with careful steps. His usual confident demeanor was tinged with concern.

Sarah turned to face him, a determined smile playing at the corners of her mouth. "We've come too far to turn back now," she replied, her hand unconsciously moving to touch the mysterious amulet hanging at her neck. "Whatever lies ahead, we face it together."

The fortress had stood for a thousand years, its stones witness to countless stories of triumph and tragedy. Now it would bear witness to one more - their story. As Sarah and Tom descended the winding staircase into the heart of the ancient structure, neither could shake the feeling that their greatest adventure was just beginning.

[End of Chapter 1]
    `,
    publishedDate: "2024-03-20",
  };
};

export default function NovelDetail({ params }: { params: { id: string } }) {
  const novel = getNovelById(params.id);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Novel Title Bar */}
      <div className="fixed top-16 w-full bg-white border-b z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">{novel.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>{novel.likes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Novel Content */}
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
            <div className="flex gap-4 text-gray-600 text-sm">
              <span>By {novel.author}</span>
              <span>Published: {novel.publishedDate}</span>
            </div>
          </div>
          
          <div className="prose prose-gray max-w-none">
            {novel.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="container mx-auto max-w-2xl flex justify-between">
          <Link href={`/novel/${Number(params.id) - 1}`}>
            <Button variant="outline" disabled={Number(params.id) <= 1}>
              Previous Chapter
            </Button>
          </Link>
          <Link href={`/novel/${Number(params.id) + 1}`}>
            <Button variant="outline">Next Chapter</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
} 