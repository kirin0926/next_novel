'use client';

import { useState } from 'react'
import Image from 'next/image'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Drawer } from '@/components/ui/drawer'
import { useRouter } from 'next/navigation'
import { formatDate, formatContent } from '@/lib/utils'
// import { useUser } from '@/lib/useAuth'

interface NovelDetailClientProps {
  initialNovel: any;
}
// 小说详情页面
export default function NovelDetailClient({ initialNovel }: NovelDetailClientProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  // const { userId, isLoaded } = useUser()

  const handlePromoteClick = () => {
   
    setIsDrawerOpen(true)
  }

  return (
    <div className="relative min-h-screen">
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
                src={initialNovel.cover || '/placeholder-cover.png'} 
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

      {/* 悬浮推广按钮 */}
      <Button
        className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg"
        onClick={handlePromoteClick}
      >
        推广
      </Button>

      {/* 推广抽屉 */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">推广详情</h3>
          <p>这里是推广内容...</p>
        </div>
      </Drawer>
    </div>
  );
} 