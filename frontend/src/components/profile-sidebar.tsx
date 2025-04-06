'use client';

import { CardContent } from '@/components/ui/card';

import { Card } from '@/components/ui/card';

import Link from 'next/link';
import { Briefcase, LogOut, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ProfileSidebar() {
  return (
    <div className="hidden flex-col gap-4 md:flex">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-muted-foreground">Senior Frontend Developer</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/applications">
              <Briefcase className="mr-2 h-4 w-4" />
              Applications
            </Link>
          </Button>
          <Separator />
          <Button
            asChild
            variant="ghost"
            className="justify-start text-muted-foreground"
          >
            <Link href="/logout">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
