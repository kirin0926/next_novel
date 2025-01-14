import supabase from '@/lib/supabase'

export default async function NovelDetail({ params }: { params: { id: string } }) {
  const { id } = await params
  const { data: novel, error } = await supabase
    .from('novels')
    .select('*')
    .eq('id', id)
    .single()

  // console.log(novel)
  if (error) {
    console.error('Error fetching novel:', error)
    return <div className="text-center text-2xl font-bold my-80 ">Novel not found</div>
  }

  if (!novel) {
    return <div className="text-center text-2xl font-bold my-80 ">Novel not found</div>
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Novel Content */}
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
            <div className="flex gap-4 text-gray-600 text-sm">
              <span>By {novel.author}</span>
              <span>Published: {novel.created_at}</span>
            </div>
          </div>
          
          <div className="prose prose-gray max-w-none">
            {novel.content
              .split(/\n\n|\n/)
              .filter((para: string) => para.trim() !== '')
              .map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 whitespace-pre-line">
                  {paragraph.trim()}
                </p>
              ))}
          </div>
        </div>
      </div>

    </main>
  );
} 