import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">about nicenovel.org</h3>
            <p className="text-gray-600 mb-4">
              Nice Novel ———— Read novels online free, free books online. Read books online free, read novels online free, read novel series online free. On nicenovel.org you can find thoundsands of english novel, novel series, best author!
            </p>
            <div className="flex items-center gap-2">
              <Link href="mailto:contact@nicenovel.org" className="text-gray-600 hover:text-gray-900">
                contact@nicenovel.org
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden">
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-gray-600 hover:text-gray-900">
                  网站地图
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Nice Novel . All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 