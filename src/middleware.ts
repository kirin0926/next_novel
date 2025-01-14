import { clerkMiddleware } from "@clerk/nextjs/server";
// export default clerkMiddleware();

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
export default clerkMiddleware({
  // publicRoutes: [
  //   "/",
  //   "/about",
  //   "/privacy",
  //   "/terms",
  //   "/sitemap",
  //   "/api/public(.*)", // all public APIs
  // ],
  
  // ignoredRoutes: [
  //   "/((?!api|trpc))(_next.*|.+.[w]+$)", // ignore all static files
  //   "/favicon.ico",
  // ]
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};