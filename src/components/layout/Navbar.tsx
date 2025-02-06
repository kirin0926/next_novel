import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, HomeIcon, BookOpen, Info } from "lucide-react";
import Link from "next/link";
import {
    ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
  
} from '@clerk/nextjs'
import { auth } from "@clerk/nextjs/server";

export async function Header() {
  const { userId } = await auth();
  return (
    <header className="fixed top-0 w-full border-b z-50 bg-background">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/" className="text-2xl font-bold">Nice Novel</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <Link href="/" passHref>
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/subscription" passHref>
            <Button variant="ghost">Subscription</Button>
          </Link>
          {/* 推广中心 */}
          {userId && (
            <Link href="/promotion" passHref>
              <Button variant="ghost">Promotion</Button>
            </Link>
          )}
          {/* 其他导航按钮 */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
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
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-8">
              <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <HomeIcon className="h-5 w-5" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <Link href="/subscription" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subscription
                </Link>
              </Button>
              {/* 推广中心 */}
              {userId && (
                <Button variant="ghost" className="w-full justify-start text-base" asChild>
                  <Link href="/promotion" className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Promotion
                  </Link>
                </Button>
              )}
              {/* 登录注册 */}
              <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <SignedIn>
                  <UserButton afterSignOutUrl="/"/>
                </SignedIn>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
} 