import Link from "next/link"
import { Bell, Briefcase, Building2, FileText, Home, LifeBuoy, LogOut, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function MobileNav() {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">JobHunt</span>
        </Link>
        <div className="flex flex-col gap-2">
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              Find Jobs
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/companies">
              <Building2 className="h-5 w-5" />
              Companies
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/salary">
              <FileText className="h-5 w-5" />
              Salary Guide
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/resources">
              <LifeBuoy className="h-5 w-5" />
              Resources
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/profile">
              <User className="h-5 w-5" />
              Profile
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/applications">
              <Briefcase className="h-5 w-5" />
              Applications
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              Notifications
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Button asChild variant="ghost" className="justify-start gap-2 text-muted-foreground">
            <Link href="/logout">
              <LogOut className="h-5 w-5" />
              Log out
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Button className="w-full">Post a Job</Button>
        </div>
      </div>
    </ScrollArea>
  )
}

