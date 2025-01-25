'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart} from "lucide-react";
import Link from "next/link";
import supabase from '@/lib/supabase'
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from 'react';

// 定义小说类型
interface Novel {
  id: number;
  title: string;
  description: string;
  cover: string;
  like: number;
}

export default function Home() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 20;

  // 获取小说数据
  const fetchNovels = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (error) throw error;

      if (data) {
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setNovels(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching novels:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // 初始加载
  useEffect(() => {
    fetchNovels();
  }, []);

  // 设置 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNovels();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNovels]);
          
  return (
    <div className="flex flex-col">
      {/* Banner/Carousel Section */}
      <div className="mt-8 relative h-[300px] bg-gray-200">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover the World of Nice Novel Stories</h1>
          <p className="text-lg md:text-xl text-gray-600">Enjoy Quality Reading Anytime, Anywhere</p>
          {/* Add carousel component here */}

        </div>
      </div>

      {/* Novel Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Hot Novels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {novels?.map((novel) => (
            <Link href={`/novel/${novel.id}`} key={novel.id}>
              <Card className="flex flex-col hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="p-3 sm:p-6">
                  <div className="relative h-[120px] sm:h-[160px] md:h-[200px]">
                    <Image
                      src={novel.cover || '/placeholder-cover.png'}
                      alt={novel.title}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 200px"
                      priority
                    />
                  </div>
                  <CardTitle className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl line-clamp-2">{novel.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:px-6">
                  <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{novel.description}</p>
                </CardContent>
                <CardFooter className="md:p-6 md:py-3 sm:p-6 flex justify-between mt-auto">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" /><span className="text-sm sm:text-base">{novel.like}</span>
                  </div>
                  <div className="text-sm sm:text-base">read more</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Loading Indicator */}
        <div ref={loadingRef} className="py-4 text-center">
          {loading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>}
          {!hasMore && novels.length > 0 && (
            <p className="text-gray-600">没有更多小说了</p>
          )}
        </div>
      </div>
    </div>
  );
}
