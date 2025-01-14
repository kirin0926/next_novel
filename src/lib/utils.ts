import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 合并类名
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 新增文本处理函数
export const formatContent = (content: string) => {
  return content
    .split(/\n\n|\n|\r\n|\r|\t/)
    .map(para => para
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/\\/g, '')
      .trim()
    )
    .filter(para => para !== '')
}