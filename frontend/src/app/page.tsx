"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Header } from '@/components/header';
import { JobFilters } from '@/components/job-filters';
import { JobCard } from '@/components/job-card';
import { useJobSearch } from '@/lib/hooks';
import { JobFiltersState } from '@/lib/types';

export default function HomePage() {
  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize job search hook with default page size
  const {
    jobs,
    meta,
    error,
    isLoading,
    search,
    applyFilters,
    loadMore,
    resetSearch,
    isSearching
  } = useJobSearch({
    pageSize: 5,
    sortBy: 'recent'
  });

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search({
      title: searchQuery
    });
  };

  // Handle filter application
  const handleFilter = (filters: JobFiltersState) => {
    applyFilters(filters);
  };

  // Get popular search terms (could be fetched from API)
  const popularSearchTerms = ['Developer', 'Designer', 'Marketing', 'Remote'];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Search section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted rounded-2xl rounded-tr-none rounded-tl-none">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Find Your Dream Job
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Search thousands of jobs from top companies and find the
                  perfect match for your skills and experience.
                </p>
              </div>
              <form 
                onSubmit={handleSearch} 
                className="w-full max-w-3xl space-y-2"
              >
                <div className="flex flex-col md:flex-row w-full max-w-3xl items-center space-y-2 md:space-y-0 md:space-x-2">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Job title, keywords, or company"
                      className="w-full bg-background pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Popular:&nbsp;
                    {popularSearchTerms.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        className="hover:underline hover:text-primary"
                        onClick={() => {
                          setSearchQuery(term);
                        }}
                      >
                        {term}
                        {i < popularSearchTerms.length - 1 ? ', ' : ''}
                      </button>
                    ))}
                  </div>
                  
                  {/* Mobile filters trigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 lg:hidden"
                        type="button"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                      <JobFilters 
                        onFilter={handleFilter}
                        onReset={resetSearch}
                        isLoading={isLoading}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Jobs list section */}
        <section className="container px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {isSearching ? 'Search Results' : 'Latest Jobs'}
              </h2>
              <p className="text-muted-foreground">
                {error ? (
                  'Error loading jobs. Please try again.'
                ) : isLoading ? (
                  'Loading...'
                ) : meta ? (
                  `Found ${meta.pagination.total} jobs ${
                    isSearching ? 'matching your search' : ''
                  }`
                ) : (
                  'No jobs found'
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Most Recent
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            {/* Desktop filters */}
            <div className="hidden lg:block">
              <JobFilters 
                onFilter={handleFilter}
                onReset={resetSearch}
                isLoading={isLoading}
              />
            </div>
            
            {/* Job listings container with min-height */}
            <div className="grid gap-4 min-h-[600px]">
              {/* Error state */}
              {error && (
                <div className="text-center p-8">
                  <p className="text-red-500">Failed to load jobs</p>
                  <Button 
                    onClick={() => search({})} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              )}
              
              {/* Loading state */}
              {isLoading && !error && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i}
                      className="h-[200px] rounded-md bg-muted animate-pulse"
                    />
                  ))}
                </div>
              )}
              
              {/* Jobs list with consistent height */}
              <div className={`grid gap-4 ${jobs.length < 3 ? 'content-start' : ''}`}>
                {!isLoading && !error && jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              
              {/* No results */}
              {!isLoading && !error && jobs.length === 0 && (
                <div className="text-center p-8 flex flex-col items-center justify-center min-h-[300px]">
                  <p className="text-muted-foreground">No jobs found matching your criteria</p>
                  {isSearching && (
                    <Button 
                      onClick={() => {
                        setSearchQuery('');
                        resetSearch();
                      }}
                      variant="outline" 
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
              
              {/* Load more button */}
              {!isLoading && 
               !error && 
               jobs.length > 0 && 
               meta && meta.pagination.page < meta.pagination.pageCount && (
                <div className="flex justify-center mt-6">
                  <Button 
                    variant="outline"
                    onClick={loadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Load More Jobs"}
                  </Button>
                </div>
              )}
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
