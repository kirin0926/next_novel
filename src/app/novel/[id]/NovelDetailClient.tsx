'use client';

import Image from 'next/image'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { formatDate, formatContent } from '@/lib/utils'

interface NovelDetailClientProps {
  initialNovel: any; // 根据你的小说类型定义具体接口
}

export default function NovelDetailClient({ initialNovel }: NovelDetailClientProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm md:p-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>novel: {formatContent(initialNovel.title)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative h-[400px] sm:h-[440px] md:h-[480px]">
            <Image 
              src={initialNovel.cover || '/placeholder-cover.jpg'} 
              alt={initialNovel.title} 
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold my-2">{formatContent(initialNovel.title)}</h1>
            <div className="flex gap-4 text-gray-600 text-sm">
              <span>By: {initialNovel.author}</span>
              <span>Published: {formatDate(initialNovel.created_at)}</span>
            </div>
          </div>
          
          <div className="prose prose-gray max-w-none">
            {formatContent(initialNovel.content).map((paragraph, index) => (
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