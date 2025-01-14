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

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Nice Novel</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <Link href="/" passHref>
            <Button variant="ghost">Home</Button>
          </Link>
          {/* <Link href="/categories" passHref>
            <Button variant="ghost">Categories</Button>
          </Link>
          <Link href="/about" passHref>
            <Button variant="ghost">About</Button>
          </Link> */}
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
              {/* <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <Link href="/categories" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Categories
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-base" asChild>
                <Link href="/about" className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About
                </Link>
              </Button> */}
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
    </nav>
  );
} 