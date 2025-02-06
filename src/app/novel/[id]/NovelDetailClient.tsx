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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { formatDate, formatContent } from '@/lib/utils'
import { useUser,SignIn } from "@clerk/nextjs";

interface NovelDetailClientProps {
  initialNovel: any;
  relatedNovels: any[];
}

// 小说详情页面
export default function NovelDetailClient({ initialNovel, relatedNovels }: NovelDetailClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()

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
  const handleSubmitClick = () => {
    console.log('submit')
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
              
              <div className="mt-4">
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
              {formatContent(initialNovel.content).map((paragraph, index) => (
                <p key={index} className="mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </section>

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
            </section>
          </div> 
        </main>
      </div>
      
      {/* 推广按钮 */}
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
              <Input type="text" value={initialNovel.id} />
              <Input type="text" value={user?.emailAddresses[0].emailAddress}/>
              <Input type="text" placeholder='promotion code' />
              <Button onClick={handleSubmitClick}>promote</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </article>
  );
} 