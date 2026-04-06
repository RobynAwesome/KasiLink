import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/gigs/new(.*)",
  "/chat(.*)",
  "/incidents/new(.*)",
  "/tutoring/new(.*)",
  "/community-calendar/new(.*)",
  "/spotlight/new(.*)",
  "/my-water-reports(.*)",
]);

// Next.js 16: export named "proxy" (middleware.ts is deprecated)
export const proxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
