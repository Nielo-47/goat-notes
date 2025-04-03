import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error) {
    return handleAuthErrors(error, request);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// New function to handle auth errors gracefully
function handleAuthErrors(error: any, request: NextRequest) {
  if (
    error?.message?.includes('Auth session missing') ||
    error?.__isAuthError
  ) {
    // If user is trying to access a protected route and not already on an auth route
    const isAuthRoute =
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/sign-up';

    if (!isAuthRoute) {
      // Redirect to login
      console.log('User not authenticated, redirecting to login');
      return NextResponse.redirect(
        new URL('/login', process.env.NEXT_PUBLIC_BASE_URL),
      );
    }
  }

  // For other errors or if on auth route already, just continue
  console.error('Middleware error handled:', error?.message || 'Unknown error');
  return NextResponse.next({
    request,
  });
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const isAuthRoute =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/sign-up';

  if (isAuthRoute) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return NextResponse.redirect(
          new URL('/', process.env.NEXT_PUBLIC_BASE_URL),
        );
      }
    } catch (error) {
      // Ignore auth errors on auth routes - user is already in the right place
      console.log('Auth error on auth route, continuing normally');
    }
  }

  const { searchParams, pathname } = new URL(request.url);
  if (!searchParams.get('noteId') && pathname === '/') {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`,
          );

          if (!response.ok) {
            console.error(`API Error: ${response.status}`);

            // If no note found, create a new one
            if (response.status === 404) {
              const createResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              );

              if (!createResponse.ok) {
                console.error(
                  `Failed to create note: ${createResponse.status}`,
                );
                return supabaseResponse;
              }

              const createData = await createResponse.json();
              const url = request.nextUrl.clone();
              url.searchParams.set('noteId', createData.noteId);
              return NextResponse.redirect(url);
            }

            return supabaseResponse;
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.error('API response is not JSON');
            return supabaseResponse;
          }

          const data = await response.json();

          if (data.newestNoteId) {
            const url = request.nextUrl.clone();
            url.searchParams.set('noteId', data.newestNoteId);
            return NextResponse.redirect(url);
          } else {
            // Create a new note if no notes exist
            const createResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            if (!createResponse.ok) {
              console.error(`Failed to create note: ${createResponse.status}`);
              return supabaseResponse;
            }

            const createData = await createResponse.json();
            const url = request.nextUrl.clone();
            url.searchParams.set('noteId', createData.noteId);
            return NextResponse.redirect(url);
          }
        } catch (error) {
          console.error('Error fetching or creating note:', error);
          return supabaseResponse;
        }
      } else {
        // No user authenticated, redirect to login
        if (String(pathname) !== '/login' && String(pathname) !== '/sign-up') {
          return NextResponse.redirect(
            new URL('/login', process.env.NEXT_PUBLIC_BASE_URL),
          );
        }
      }
    } catch (error) {
      // Let the outer try/catch in middleware function handle this
      throw error;
    }
  }

  return supabaseResponse;
}
