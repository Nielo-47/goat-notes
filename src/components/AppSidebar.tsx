import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { getUser } from '@/auth/server';
import { Note } from '@prisma/client';
import { prisma } from '@/db/prisma';
import Link from 'next/link';
import SidebarGroupContent from './SidebarGroupContent';

export default async function AppSidebar() {
  const user = await getUser();
  let notes: Note[] = [];

  if (user) {
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="mt-2 mb-2 text-lg">
            {user ? (
              'Your notes'
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>
                to see your notes
              </p>
            )}
          </SidebarGroupLabel>

          {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
