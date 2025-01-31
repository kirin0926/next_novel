import supabase from '@/lib/supabase'
import { formatDate, formatContent } from '@/lib/utils'
import { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'
import { GetStaticProps, GetStaticPaths } from 'next'

// import { params}
import NovelDetailClient from './NovelDetailClient'

// 修改 Props 类型定义
// type Props = {
//   params: Promise<{ id: string }>
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>
// }

// 生成动态 metadata
export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id
  
  // 获取小说数据
  const { data: novel } = await supabase
    .from('novels')
    .select('*')
    .eq('id', id)
    .single()

  if (!novel) {
    return {
      title: 'Novel Not Found - nicenovel.org - Read novels online free, free books online, read books online free, read novels online free, read novel series online free. On nicenovel.org you can find thousands of English novels, novel series, best author! Also check out NovelShort, NovelMaster, RealNovel, NovaBeats.',
      description: 'The requested novel could not be found. Adventure Billionaire Christian Classic Fantasy Historical Horror Humorous Mystery New Adult Romance Science Fiction Thriller Western Young Adult. Read novels online free, free books online. Read books online free, read novels online free, read novel series online free. On nicenovel.org you can find thousands of English novels, novel series, best author!',
    }
  }

  // 生成关键词
  const keywords = [
    novel.title,
    novel.author,
    'novel',
    'online reading',
    'read novel',
    'read novel online',
    'read novel online free',
    'novelshort', // 新增竞争对手名字
    'novelmaster', // 新增竞争对手名字
    'realnovel', // 新增竞争对手名字
    'novabeats', // 新增竞争对手名字
    novel.tags, // 如果有标签字段
  ].filter(Boolean)

  return {
    title: `${novel.title} - nicenovel.org - Read novels online free, free books online, read books online free, read novels online free, read novel series online free. On nicenovel.org you can find thousands of English novels, novel series, best author! Also check out NovelShort, NovelMaster, RealNovel, NovaBeats.`,
    description: novel.description || `Read ${novel.title}, author: ${novel.author}. Find more great novels on nicenovel.org. Adventure Billionaire Christian Classic Fantasy Historical Horror Humorous Mystery New Adult Romance Science Fiction Thriller Western Young Adult. Read novels online free, free books online. Read books online free, read novels online free, read novel series online free. On nicenovel.org you can find thousands of English novels, novel series, best author! Also check out NovelShort, NovelMaster, RealNovel, NovaBeats.`,
    keywords: keywords,
    openGraph: {
      title: novel.title,
      description: novel.description,
      type: 'article',
      authors: [novel.author],
      images: [
        {
          url: novel.cover || '/placeholder-cover.jpg',
          width: 1200,
          height: 630,
          alt: novel.title,
        },
      ],
    },
    alternates: {
      canonical: `https://nicenovel.org/novel/${id}`,
    },
  }
}

// 使用 supabase 获取数据并设置 revalidate
export default async function NovelDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // 获取小说数据
  const { data: novel } = await supabase
    .from('novels')
    .select('*')
    .eq('id', id)
    .single()

  if (!novel) {
    return <div>Novel Not Found</div>
  }

  // 添加结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: novel.title,
    author: {
      '@type': 'Person',
      name: novel.author,
    },
    datePublished: novel.created_at,
    image: novel.cover || '/placeholder-cover.jpg',
    description: novel.description,
    publisher: {
      '@type': 'Organization',
      name: 'nicenovel.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nicenovel.org/logo.png',
      },
    },
  }

  return (
    <>
      {/* 注入结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 客户端组件 */}
      <NovelDetailClient initialNovel={novel} />
    </>
  )
} 