import Link from "next/link"
import { Building2, MapPin, Search, SlidersHorizontal, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"

export default function CompaniesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Discover Great Places to Work
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Explore top companies hiring now and find your perfect workplace match.
                </p>
              </div>
              <div className="w-full max-w-3xl space-y-2">
                <div className="flex w-full max-w-3xl items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search companies by name or industry"
                      className="w-full bg-background pl-8"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Popular: Tech, Healthcare, Finance, Remote-friendly</p>
                  <Button variant="outline" size="sm" className="gap-1">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container grid items-start gap-6 px-4 py-6 md:px-6 md:py-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Companies</h2>
              <p className="text-muted-foreground">Discover top-rated employers with open positions</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Most Popular
              </Button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Link key={i} href={`/companies/${i + 1}`} className="block">
                <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                          <Building2 className="h-8 w-8" />
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-3.5 w-3.5" />
                            <span>
                              {(i + 1) * 500}-{(i + 1) * 1000}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>Multiple Locations</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {["TechCorp", "InnovateSoft", "DataSphere", "CloudNine", "PixelPerfect", "FutureTech"][i]}{" "}
                          Inc.
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {
                            [
                              "Technology",
                              "Software Development",
                              "Data Analytics",
                              "Cloud Services",
                              "Design",
                              "AI & Machine Learning",
                            ][i]
                          }
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {
                            [
                              "A leading technology company specializing in innovative solutions.",
                              "Creating cutting-edge software for enterprise clients worldwide.",
                              "Transforming data into actionable insights for businesses.",
                              "Providing scalable cloud infrastructure and services.",
                              "Crafting beautiful digital experiences with precision.",
                              "Building the future with advanced AI technologies.",
                            ][i]
                          }
                        </p>
                      </div>
                      <div className="mt-auto">
                        <p className="text-sm font-medium">{(i + 5) * 3} open positions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline">Load More Companies</Button>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">For Employers</div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Attract top talent to your company
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Create a compelling company profile, showcase your culture, and post jobs to reach qualified
                  candidates.
                </p>
                <Link
                  href="/employers"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Get Started
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Company Reviews</div>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Read authentic reviews from employees to get insights into company culture, work-life balance, and
                  career growth opportunities.
                </p>
                <Link
                  href="/reviews"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Browse Reviews
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 JobHunt. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

