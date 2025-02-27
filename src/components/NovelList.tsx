'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
interface Novel {
  id: number;
  title: string;
  description: string;
  cover: string;
  like: number;
}

interface NovelListProps {
  initialNovels: Novel[];
}

export default function NovelList({ initialNovels }: NovelListProps) {
  const supabase = createClient();
  const [novels, setNovels] = useState<Novel[]>(initialNovels);
  const [page, setPage] = useState(1); // 从第1页开始，因为第0页的数据已经在服务端获取
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 20;
  const router = useRouter();

  // ... fetchNovels 函数保持不变 ...
  // 获取小说数据
  const fetchNovels = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)// 分页
        .order('id', { ascending: true });// 按id排序
      if (error) throw error;
      // console.log(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
      if (data) {
        const uniqueNovels = data.filter((novel) => 
          !novels.some(existingNovel => existingNovel.id === novel.id)
        );// 去重
        
        if (uniqueNovels.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setNovels(prev => [...prev, ...uniqueNovels]);// 添加新的小说
        setPage(prev => prev + 1);// 更新页码
      }
    } catch (error) {
      console.error('Error fetching novels:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, novels]);

  // 初始加载
  useEffect(() => {
    fetchNovels();
  }, []);

  // 设置 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(// 观察loadingRef.current是否在视图中
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
          <p className="text-lg md:text-xl text-gray-600 mb-8">Enjoy Quality Reading Anytime, Anywhere</p>
          
          <div className="max-w-2xl mx-auto">
            <div 
              onClick={() => router.push('/search')}
              className="flex items-center gap-2 p-2 rounded-lg border bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              <svg 
                className="w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span className="text-gray-400">search novels....</span>
            </div>
          </div>
        </div>
      </div>

      {/* Novel Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Hot Novels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {novels?.map((novel, index) => (
            <Link href={`/novel/${novel.id}`} key={`${novel.id}-${index}`}>
              <Card className="flex flex-col">
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
                {/* <CardContent className="p-3 sm:px-6">
                  <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{novel.description}</p>
                </CardContent> */}
                <CardFooter className="md:p-6 md:py-3 sm:p-6 flex justify-between mt-auto">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" /><span className="text-sm sm:text-base">{novel.like}</span>
                  </div>
                  <div className="text-sm sm:text-base">read</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Loading Indicator */}
        <div ref={loadingRef} className="py-4 text-center">
          {loading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>}
          {!hasMore && novels.length > 0 && (
            <p className="text-gray-600">no more novels</p>
          )}
        </div>
      </div>
    </div>
  );
} 