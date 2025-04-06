import { useState } from 'react';
import useSWR from 'swr';
import { jobsApi, companiesApi } from './api';
import { JobSearchParams, JobFiltersState, CompanySearchParams } from './types';

/**
 * Custom hook for searching jobs with SWR 
 */
export function useJobSearch(initialParams: JobSearchParams = {}) {
  const [searchParams, setSearchParams] = useState<JobSearchParams>(initialParams);
  const [isSearching, setIsSearching] = useState(false);
  
  // Using SWR for data fetching - modified to always fetch initial data
  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR(
    // Always fetch jobs, even if no search params are provided
    [`/api/jobs`, searchParams],
    () => jobsApi.getJobs(searchParams),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  
  // Search with new parameters
  const search = (params: JobSearchParams) => {
    setSearchParams(prev => ({
      ...prev,
      ...params,
      page: 1, // Reset to first page on new search
    }));
    setIsSearching(true);
    return mutate();
  };
  
  // Apply filters
  const applyFilters = (filters: JobFiltersState) => {
    return search({
      ...searchParams,
      jobType: filters.jobType,
      experienceLevel: filters.experienceLevel,
      remoteOnly: filters.remoteOnly,
      salary: filters.salary,
      skills: filters.skills,
    });
  };
  
  // Update existing search parameters
  const updateParams = (params: Partial<JobSearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...params,
    }));
    return mutate();
  };
  
  // Load next page (pagination)
  const loadMore = () => {
    if (data && data.meta.pagination.page < data.meta.pagination.pageCount) {
      updateParams({ page: (searchParams.page || 1) + 1 });
    }
  };
  
  // Reset search
  const resetSearch = () => {
    setSearchParams({
      page: 1,
      pageSize: searchParams.pageSize || 10,
    });
    setIsSearching(false);
    return mutate();
  };
  
  return {
    jobs: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    search,
    applyFilters,
    updateParams,
    loadMore,
    resetSearch,
    searchParams,
    isSearching,
  };
}

/**
 * Custom hook for company search with SWR
 */
export function useCompanySearch(initialParams: CompanySearchParams = {}) {
  const [searchParams, setSearchParams] = useState<CompanySearchParams>(initialParams);
  const [isSearching, setIsSearching] = useState(false);
  
  // Using SWR for data fetching
  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR(
    isSearching || Object.keys(searchParams).some(key => key !== 'page' && key !== 'pageSize' && !!searchParams[key as keyof CompanySearchParams])
      ? [`/api/companies`, searchParams]
      : null,
    () => companiesApi.getCompanies(searchParams),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  
  // Search with new parameters
  const search = (params: CompanySearchParams) => {
    setSearchParams(prev => ({
      ...prev,
      ...params,
      page: 1, // Reset to first page on new search
    }));
    setIsSearching(true);
    return mutate();
  };
  
  // Update existing search parameters
  const updateParams = (params: Partial<CompanySearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...params,
    }));
    return mutate();
  };
  
  // Load next page (pagination)
  const loadMore = () => {
    if (data && data.meta.pagination.page < data.meta.pagination.pageCount) {
      updateParams({ page: (searchParams.page || 1) + 1 });
    }
  };
  
  // Reset search
  const resetSearch = () => {
    setSearchParams({
      page: 1,
      pageSize: searchParams.pageSize || 10,
    });
    setIsSearching(false);
    return mutate();
  };
  
  return {
    companies: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    search,
    updateParams,
    loadMore,
    resetSearch,
    searchParams,
    isSearching,
  };
}

/**
 * Hook for fetching job details
 */
export function useJobDetails(jobIdOrSlug: string | number | null) {
  const {
    data,
    error,
    isLoading,
  } = useSWR(
    jobIdOrSlug ? `/api/jobs/${jobIdOrSlug}` : null,
    () => jobIdOrSlug ? jobsApi.getJob(jobIdOrSlug) : null,
    {
      revalidateOnFocus: false,
    }
  );
  
  return {
    job: data?.data,
    error,
    isLoading,
  };
}

/**
 * Hook for fetching company details
 */
export function useCompanyDetails(companyId: number | null) {
  const {
    data,
    error,
    isLoading,
  } = useSWR(
    companyId ? `/api/companies/${companyId}` : null,
    () => companyId ? companiesApi.getCompany(companyId) : null,
    {
      revalidateOnFocus: false,
    }
  );
  
  return {
    company: data?.data,
    error,
    isLoading,
  };
}

/**
 * Hook for fetching company jobs
 */
export function useCompanyJobs(companyId: number | null, page = 1, pageSize = 5) {
  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR(
    companyId ? `/api/companies/${companyId}/jobs?page=${page}&pageSize=${pageSize}` : null,
    () => companyId ? companiesApi.getCompanyJobs(companyId, page, pageSize) : null,
    {
      revalidateOnFocus: false,
    }
  );
  
  const loadMore = () => {
    if (data && data.meta.pagination.page < data.meta.pagination.pageCount) {
      mutate(companiesApi.getCompanyJobs(companyId!, page + 1, pageSize));
    }
  };
  
  return {
    jobs: data?.data || [],
    meta: data?.meta,
    error,
    isLoading,
    loadMore,
  };
}

/**
 * Hook for fetching similar jobs
 */
export function useSimilarJobs(jobId: number | null, limit = 5) {
  const {
    data,
    error,
    isLoading,
  } = useSWR(
    jobId ? `/api/jobs/${jobId}/similar` : null,
    () => jobId ? jobsApi.getSimilarJobs(jobId, limit) : null,
    {
      revalidateOnFocus: false,
    }
  );
  
  return {
    jobs: data?.data || [],
    error,
    isLoading,
  };
}