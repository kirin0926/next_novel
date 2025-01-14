import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart} from "lucide-react";
import Link from "next/link";
import supabase from '@/lib/supabase'
import Image from "next/image";

export default async function Home() {
  
    
  let { data: novels, error } = await supabase
  .from('novels')
  .select('*')
          

  // console.log(novels)
  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner/Carousel Section */}
      <div className="mt-16 relative h-[300px] bg-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold">精选小说</h2>
          {/* Add carousel component here */}
        </div>
      </div>

      {/* Novel Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">热门小说</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {novels?.map((novel) => (
            <Card key={novel.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-3 sm:p-6">
                <div className="relative h-[120px] sm:h-[160px] md:h-[200px]">
                  <Image
                    src={novel.cover || '/placeholder-cover.jpg'}
                    alt={novel.title}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 200px"
                    priority
                  />
                </div>
                <CardTitle className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl line-clamp-1">{novel.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{novel.description}</p>
              </CardContent>
              <CardFooter className="p-3 sm:p-6 flex justify-between mt-auto">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{novel.like}</span>
                </div>
                <Link href={`/novel/${novel.id}`}>
                  <Button size="sm" className="text-sm sm:text-base">read more</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
