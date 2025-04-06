import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Globe,
  MapPin,
  Share2,
  Star,
  Users,
  Check,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/header';

export default function CompanyDetailsPage({}: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="mb-4">
            <Link
              href="/companies"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to companies
            </Link>
          </div>
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
                      <Building2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold">TechCorp Inc.</h1>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <a
                            href="https://techcorp.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            techcorp.com
                          </a>
                        </div>
                        <span className="hidden sm:inline-block text-muted-foreground">
                          •
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>San Francisco, CA (HQ)</span>
                        </div>
                        <span className="hidden sm:inline-block text-muted-foreground">
                          •
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>500-1000 employees</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4
                                  ? 'fill-primary text-primary'
                                  : 'fill-muted text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">4.2</span>
                        <span className="text-sm text-muted-foreground">
                          (128 reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 sm:flex-col">
                    <Button>Follow</Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About TechCorp Inc.</CardTitle>
                    <CardDescription>
                      Founded in 2010 • Technology • Software Development
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose max-w-none dark:prose-invert">
                      <p>
                        TechCorp is a leading technology company specializing in
                        building innovative solutions for enterprise clients. We
                        are a team of passionate individuals who are committed
                        to creating exceptional products that solve real-world
                        problems.
                      </p>
                      <p>
                        Our mission is to transform how businesses operate
                        through cutting-edge technology and exceptional user
                        experiences. We believe in fostering a culture of
                        innovation, collaboration, and continuous learning.
                      </p>
                      <h3>Our Culture</h3>
                      <p>
                        At TechCorp, we value diversity, inclusion, and
                        belonging. We are committed to creating an environment
                        where everyone can thrive. Our team members enjoy:
                      </p>
                      <ul>
                        <li>A collaborative and supportive work environment</li>
                        <li>
                          Opportunities for professional growth and development
                        </li>
                        <li>
                          Work-life balance with flexible scheduling options
                        </li>
                        <li>Regular team building activities and events</li>
                        <li>
                          A commitment to making a positive impact in our
                          communities
                        </li>
                      </ul>
                      <h3>Our Technology Stack</h3>
                      <p>
                        We use a modern technology stack including React,
                        Next.js, Node.js, Python, and AWS. We are always
                        exploring new technologies and approaches to deliver the
                        best solutions for our clients.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                            <Users className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium">Diverse Team</h3>
                          <p className="text-sm text-muted-foreground">
                            Employees from 20+ countries
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                            <MapPin className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium">Global Presence</h3>
                          <p className="text-sm text-muted-foreground">
                            Offices in 5 countries
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                            <Briefcase className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium">Growing Fast</h3>
                          <p className="text-sm text-muted-foreground">
                            30% YoY growth
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                            <Star className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium">Award Winning</h3>
                          <p className="text-sm text-muted-foreground">
                            Top employer 2023
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="jobs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Open Positions</CardTitle>
                    <CardDescription>
                      15 jobs available at TechCorp Inc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Link key={i} href={`/jobs/${i + 1}`} className="block">
                          <Card className="overflow-hidden transition-colors hover:bg-muted/50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="grid gap-1">
                                  <h3 className="font-semibold">
                                    {
                                      [
                                        'Senior Frontend Developer',
                                        'Backend Engineer',
                                        'Product Manager',
                                        'UX Designer',
                                        'DevOps Engineer',
                                      ][i]
                                    }
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>TechCorp Inc.</span>
                                    <Separator
                                      orientation="vertical"
                                      className="h-4"
                                    />
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      <span>
                                        {
                                          [
                                            'San Francisco, CA (Remote)',
                                            'New York, NY',
                                            'Remote',
                                            'Austin, TX',
                                            'Seattle, WA',
                                          ][i]
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                                    <Briefcase className="h-5 w-5" />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                <div className="rounded-md bg-background px-2 py-1">
                                  Full-time
                                </div>
                                <div className="rounded-md bg-background px-2 py-1">
                                  ${(i + 1) * 30}k - ${(i + 1) * 40}k
                                </div>
                                {[
                                  'React',
                                  'Next.js',
                                  'Node.js',
                                  'Python',
                                  'AWS',
                                  'TypeScript',
                                  'Figma',
                                  'UI/UX',
                                  'Docker',
                                  'Kubernetes',
                                ]
                                  .slice(i * 2, i * 2 + 3)
                                  .map((tag, j) => (
                                    <div
                                      key={j}
                                      className="rounded-md bg-background px-2 py-1"
                                    >
                                      {tag}
                                    </div>
                                  ))}
                              </div>
                              <div className="mt-3 text-right text-xs text-muted-foreground">
                                Posted {i + 1} days ago
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline">View All 15 Jobs</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Reviews</CardTitle>
                    <CardDescription>
                      128 reviews from current and former employees
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col items-center gap-2 sm:flex-row">
                        <div className="flex items-center justify-center rounded-full bg-primary/10 p-4">
                          <span className="text-3xl font-bold text-primary">
                            4.2
                          </span>
                        </div>
                        <div className="text-center sm:text-left">
                          <div className="flex justify-center sm:justify-start">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < 4
                                    ? 'fill-primary text-primary'
                                    : 'fill-muted text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Based on 128 reviews
                          </p>
                        </div>
                      </div>
                      <Button>Write a Review</Button>
                    </div>
                    <Separator />
                    <div className="space-y-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              {
                                [
                                  'Great place to work and grow',
                                  'Challenging but rewarding',
                                  'Good benefits, high expectations',
                                ][i]
                              }
                            </h3>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 ${
                                    j < 4 + (i % 2)
                                      ? 'fill-primary text-primary'
                                      : 'fill-muted text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              {
                                [
                                  'Software Engineer',
                                  'Product Manager',
                                  'UX Designer',
                                ][i]
                              }
                            </span>
                            <span>•</span>
                            <span>Current Employee</span>
                            <span>•</span>
                            <span>{['2 years', '1 year', '3 years'][i]}</span>
                          </div>
                          <p className="text-sm">
                            {
                              [
                                "I've been at TechCorp for two years and have had a great experience. The company culture is supportive, and there are many opportunities for growth and learning. Work-life balance is respected, and the benefits are competitive.",
                                'TechCorp sets high standards and expects a lot from its employees, but the work is meaningful and impactful. The team is collaborative, and leadership is transparent about company goals and challenges.',
                                'The benefits package is excellent, including healthcare, 401(k) matching, and professional development opportunities. The work can be demanding at times, but the company is flexible with remote work and time off.',
                              ][i]
                            }
                          </p>
                          <div className="pt-2">
                            <div className="flex flex-wrap gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium">
                                  Pros:
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {
                                    [
                                      'Great culture, good benefits',
                                      'Learning opportunities, impactful work',
                                      'Flexible work arrangements, competitive pay',
                                    ][i]
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-sm font-medium">Cons:</span>
                              <span className="text-sm text-muted-foreground">
                                {
                                  [
                                    'Sometimes long hours during releases',
                                    'High pressure environment at times',
                                    'Fast-paced, can be stressful',
                                  ][i]
                                }
                              </span>
                            </div>
                          </div>
                          {i < 2 && <Separator className="mt-4" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Button variant="outline">Load More Reviews</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="benefits" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                    <CardDescription>
                      What TechCorp offers to its employees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Health & Wellness</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Health Insurance
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Comprehensive medical, dental, and vision
                                coverage
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Mental Health Support
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Free counseling and therapy sessions
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Wellness Stipend
                              </span>
                              <p className="text-sm text-muted-foreground">
                                ₹100/month for gym, fitness classes, or wellness
                                apps
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold">Financial Benefits</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                401(k) Matching
                              </span>
                              <p className="text-sm text-muted-foreground">
                                4% company match on retirement contributions
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">Equity</span>
                              <p className="text-sm text-muted-foreground">
                                Stock options for all full-time employees
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Commuter Benefits
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Pre-tax commuter benefits for public
                                transportation
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold">Time Off</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">Unlimited PTO</span>
                              <p className="text-sm text-muted-foreground">
                                Flexible vacation policy with minimum 15 days
                                encouraged
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Paid Parental Leave
                              </span>
                              <p className="text-sm text-muted-foreground">
                                16 weeks of paid leave for all new parents
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Volunteer Time Off
                              </span>
                              <p className="text-sm text-muted-foreground">
                                16 hours of paid time off for volunteer work
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold">
                          Professional Development
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Learning Budget
                              </span>
                              <p className="text-sm text-muted-foreground">
                                ₹2,000 annual budget for courses and conferences
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Mentorship Program
                              </span>
                              <p className="text-sm text-muted-foreground">
                                Structured mentorship with senior team members
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">Career Growth</span>
                              <p className="text-sm text-muted-foreground">
                                Clear career paths and regular promotion cycles
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 JobHunt. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
