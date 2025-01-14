import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, HomeIcon, BookOpen, Info } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Novel Reader</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <Link href="/" passHref>
            <Button variant="ghost">首页</Button>
          </Link>
          <Link href="/categories" passHref>
            <Button variant="ghost">分类</Button>
          </Link>
          <Link href="/about" passHref>
            <Button variant="ghost">关于</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>菜单</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-8">
              <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <HomeIcon className="h-5 w-5" />
                  首页
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <Link href="/categories" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  分类
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <Link href="/about" className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  关于
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
} 