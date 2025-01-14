"use client";
import supabase from '@/lib/supabase'
import { formatDate, formatContent } from '@/lib/utils'
import Image from 'next/image'
import { useParams } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import GoogleAdsense from '@/components/GoogleAdsense'
import { useEffect, useState } from 'react';

export default function NovelDetail() {
  const params = useParams();
  const id = params.id;

  const [novel, setNovel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNovel = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('novels')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching novel:', error);
        } else {
          setNovel(data);
        }
        setLoading(false);
      }
    };

    fetchNovel();
  }, [id]);

  if (loading) {
    return <div className="text-center text-2xl font-bold my-80">Loading...</div>;
  }

  if (error || !novel) {
    return <div className="text-center text-2xl font-bold my-80">Novel not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 在页面中使用 */}
      {/* <GoogleAdsense /> */}

      {/* Novel Content */}
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm md:p-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>novel: {formatContent(novel.title)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative h-[400px] sm:h-[440px] md:h-[480px]">
            <Image 
              src={novel.cover || '/placeholder-cover.jpg'} 
              alt={novel.title} 
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold my-2">{formatContent(novel.title)}</h1>
            <div className="flex gap-4 text-gray-600 text-sm">
              <span>By: {novel.author}</span>
              <span>Published: {formatDate(novel.created_at)}</span>
            </div>
          </div>
          
          <div className="prose prose-gray max-w-none">
            {formatContent(novel.content).map((paragraph, index) => (
              <p key={index} className="mb-4 whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 