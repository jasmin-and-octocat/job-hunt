"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isOpen: true,
  setIsOpen: () => {},
})

export function SidebarProvider({
  children,
  defaultIsOpen = true,
}: {
  children: React.ReactNode
  defaultIsOpen?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen)

  return <SidebarContext.Provider value={{ isOpen, setIsOpen }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          "group fixed inset-y-0 left-0 z-30 flex w-[--sidebar-width] flex-col border-r bg-background transition-all duration-300",
          isOpen ? "w-[--sidebar-width]" : "w-[--sidebar-width-collapsed]",
          className,
        )}
        style={
          {
            "--sidebar-width": "280px",
            "--sidebar-width-collapsed": "4rem",
          } as React.CSSProperties
        }
        {...props}
      />
    )
  },
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col gap-2 px-3 py-2", className)} {...props} />
  },
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex-1 overflow-auto px-3 py-2", className)} {...props} />
  },
)
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col gap-2 px-3 py-2", className)} {...props} />
  },
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col gap-1 py-2", className)} {...props} />
  },
)
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          "px-3 text-xs font-medium text-muted-foreground",
          isOpen ? "opacity-100" : "opacity-0",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
  },
)
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "group/menu-button relative flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
  {
    variants: {
      size: {
        default: "h-9",
        sm: "h-8",
        lg: "h-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  isActive?: boolean
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, size, asChild = false, isActive = false, ...props }, ref) => {
    const { isOpen } = useSidebar()
    const Comp = asChild ? React.Fragment : "button"
    const childProps = asChild
      ? { className: cn(sidebarMenuButtonVariants({ size, className })), "data-active": isActive }
      : {}

    return (
      <Comp
        ref={ref}
        className={asChild ? undefined : cn(sidebarMenuButtonVariants({ size, className }))}
        data-active={isActive}
        {...props}
      >
        {asChild ? (
          <span {...childProps}>{props.children}</span>
        ) : (
          <>
            {props.children}
            {!isOpen && (
              <span className="absolute inset-y-0 -right-0.5 w-1 rounded-l-sm bg-foreground opacity-0 transition-opacity group-hover/menu-button:opacity-20 group-data-[active=true]/menu-button:opacity-100" />
            )}
          </>
        )}
      </Comp>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar()

    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          isOpen ? "opacity-100" : "opacity-0",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarInput.displayName = "SidebarInput"

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSidebar()

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-y-0 right-0 w-1 bg-muted opacity-0 transition-opacity group-hover:opacity-100",
          isOpen ? "opacity-0" : "opacity-100",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarRail.displayName = "SidebarRail"

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          isOpen ? "ml-[--sidebar-width]" : "ml-[--sidebar-width-collapsed]",
          className,
        )}
        style={
          {
            "--sidebar-width": "280px",
            "--sidebar-width-collapsed": "4rem",
          } as React.CSSProperties
        }
        {...props}
      />
    )
  },
)
SidebarInset.displayName = "SidebarInset"

