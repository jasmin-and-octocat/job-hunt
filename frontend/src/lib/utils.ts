import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base API URL for Strapi
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"

// Fetcher function for SWR
export const fetcher = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init)
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    throw error
  }
  
  return res.json() as Promise<T>
}

// Format date to relative time (e.g., "2 days ago")
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  
  return `${Math.floor(diffInSeconds / 2592000)} months ago`
}
