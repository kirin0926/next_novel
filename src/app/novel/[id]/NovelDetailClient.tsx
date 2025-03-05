'use client';

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { formatDate, formatContent } from '@/lib/utils'
import { useUser,SignIn } from "@clerk/nextjs";
import supabase from '@/lib/supabase';
import { PlanList } from '@/components/subscription/PlanList'
import { useStore } from '@/store'

interface NovelDetailClientProps {
  initialNovel: any;// 小说详情
  relatedNovels: any[];// 相关小说
}

// 小说详情页面
export default function NovelDetailClient({ initialNovel, relatedNovels }: NovelDetailClientProps) {
  const router = useRouter()// 路由
  const [isDialogOpen, setIsDialogOpen] = useState(false)// 推广对话框
  const { user, isLoaded, isSignedIn } = useUser()// 用户
  const [promotionCode, setPromotionCode] = useState('')// 推广码
  const { isSubscribed, setSubscription } = useStore()// 是否订阅

  // 检查用户是否已订阅
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isSignedIn) return;
      
      // const { data, error } = await supabase
      //   .from('subscriptions')
      //   .select('*')
      //   .eq('user_email', user?.emailAddresses[0].emailAddress)
      //   .eq('novel_id', initialNovel.id)
      //   .single();
        
      // if (data) setIsSubscribed(true);
    };
    
    checkSubscription();
  }, [isSignedIn, user, initialNovel.id]);

  // 获取处理后的内容
  const getProcessedContent = () => {
    const fullContent = formatContent(initialNovel.content);
    const totalLength = fullContent.join('').length;
    
    if (isSubscribed) return fullContent;

    let currentLength = 0;
    const previewContent = [];

    for (const paragraph of fullContent) {
      if (currentLength + paragraph.length <= 3000) {
        previewContent.push(paragraph);
        currentLength += paragraph.length;
      } else {
        const remainingChars = 3000 - currentLength;
        if (remainingChars > 0) {
          previewContent.push(paragraph.slice(0, remainingChars) + '...');
        }
        break;
      }
    }
    
    return previewContent;
  };

  // 推广点击事件
  const handlePromoteClick = () => {
    if (!isSignedIn) {
      // 未登录时重定向到登录页面
      router.push('/auth/sign-in')
      return;
    }
    // 用户已登录，打开对话框
    setIsDialogOpen(true)
  }

  // 提交推广
  const handleSubmitClick = async () => {
    try {
      // 构建插入数据对象
      const insertData: any = {
        novel_id: initialNovel.id,
        promoter_phone: user?.emailAddresses[0].emailAddress,
      }
      
      // 只有当 promotionCode 不为空时才添加到提交数据中
      if (promotionCode.trim()) {
        insertData.promotion_code = promotionCode
      }

      const { data, error } = await supabase
        .from('promotions')
        .insert(insertData)

      if (error) throw error

      // console.log('Promotion inserted successfully:', data)
      setIsDialogOpen(false)
      
    } catch (error) {
      console.error('Error inserting promotion:', error)
    }
  }
  
  return (
    <article className="relative min-h-screen">
      {/* 小说详情 */}  
      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto px-4 pt-32 pb-24">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm md:p-8">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{formatContent(initialNovel.title)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <figure className="relative h-[400px] sm:h-[440px] md:h-[480px]">
              <Image 
                src={initialNovel.cover || '/placeholder-cover.png'} 
                alt={initialNovel.title} 
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </figure>

            <header className="mb-6">
              <h1 className="text-3xl font-bold my-2">{formatContent(initialNovel.title)}</h1>
              <div className="flex gap-4 text-gray-600 text-sm">
                <address className="not-italic">By: {initialNovel.author}</address>
                <time dateTime={initialNovel.created_at}>
                  Published: {formatDate(initialNovel.created_at)}
                </time>
              </div>
              
              <div className="mt-4 hidden">
                {/* 小说类型 */}
                <h2 className="text-lg font-semibold">Genres:</h2>
                <div className="flex gap-2 mt-2">
                  {initialNovel.genres?.map((genre: any) => (
                    <a 
                      key={genre.id}
                      href={`/genre/${genre.slug}`}
                      className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                    >
                      {genre.name}
                    </a>
                  ))}
                </div>
              </div>
            </header>
            
            <section className="prose prose-gray max-w-none">
              {getProcessedContent().map((paragraph, index) => (
                <p key={index} className="mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
              
              {!isSubscribed && (
                <div className="mt-8 py-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-4">Subscribe to continue reading</h3>
                  <p className="text-gray-600 mb-4">
                    You have read the first 3000 words, subscribe to continue reading
                  </p>
                  <PlanList/>
                </div>
              )}
            </section>

            {/* 
            // 相关小说
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Related Novels</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedNovels?.map((novel: any) => (
                  <a 
                    key={novel.id}
                    href={`/novel/${novel.id}`}
                    className="hover:opacity-80"
                  >
                    <Image
                      src={novel.cover || '/placeholder-cover.png'}
                      alt={novel.title}
                      width={200}
                      height={300}
                      className="object-cover rounded"
                    />
                    <h3 className="text-sm mt-2">{novel.title}</h3>
                  </a>
                ))}
              </div>
            </section> */}
          </div> 
        </main>
      </div>
      
      {/* 推广按钮  */}
      <div className="fixed bottom-8 right-8 z-50">
          <Button
            className="rounded-full shadow-lg"
            onClick={handlePromoteClick}
        >
          promotion
        </Button>
      </div> 

      {/* 推广对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 text-left">Novel ID</label>
                  <Input 
                    type="text" 
                    value={initialNovel.id} 
                    disabled 
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 text-left">Email</label>
                  <Input 
                    type="text" 
                    value={user?.emailAddresses[0].emailAddress}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 text-left">Promotion Code</label>
                  <Input 
                    type="text" 
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value)}
                    placeholder="Enter promotion code, empty for auto-generated" 
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button 
                  onClick={handleSubmitClick}
                  className="w-full bg-gray-700 hover:bg-gray-700 text-white font-medium py-2 rounded-md transition-colors"
                >
                  Generate Promotion Code
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </article>
  );
} 