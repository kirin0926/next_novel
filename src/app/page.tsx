
import { createClient } from '@/lib/supabase/server'
import NovelList from '@/components/NovelList';
import { cookies } from 'next/headers'

// 定义小说类型
interface Novel {
  id: number;
  title: string;
  description: string;
  cover: string;
  like: number;
}

// 改为异步组件
export default async function Home() {
  const supabase = createClient()
  // const router = useRouter()
  // 服务端获取初始数据
  const { data: initialNovels } = await supabase
    .from('novels')
    .select('*')
    .range(0, 19)
    .order('id', { ascending: true });

  return (
    <div className="flex flex-col">
      {/* Banner/Carousel Section */}
      {/* <div className="mt-8 relative h-[300px] bg-gray-200">
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
      </div> */}

      {/* Novel Grid - 使用客户端组件处理交互 */}
      <NovelList initialNovels={initialNovels || []} />
    </div>
  );
}
