'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import supabase from '@/lib/supabase';
import Image from "next/image";

interface Novel {
  id: number;
  title: string;
  author: string;
  cover: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;// 如果查询为空，则返回
    
    setLoading(true);// 设置loading为true
    try {
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('搜索错误:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="search novels,authors..."
              className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="px-8"
            >
              search
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((novel: any) => (
              <Link href={`/novel/${novel.id}`} key={novel.id}>
                <Card className="flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={novel.cover || '/placeholder-cover.png'}
                      alt={novel.title}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-1">{novel.title}</h3>
                    <p className="text-sm text-gray-600">Author: {novel.author}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center text-gray-600">
            No results found
          </div>
        )}
      </div>
    </div>
  );
} 