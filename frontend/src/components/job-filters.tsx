"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { JobFiltersState } from "@/lib/types"

interface JobFiltersProps {
  onFilter?: (filters: JobFiltersState) => void;
  onReset?: () => void;
  isLoading?: boolean;
}

export function JobFilters({ onFilter, onReset, isLoading = false }: JobFiltersProps) {
  // Collapsible state
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(true)
  const [isExperienceOpen, setIsExperienceOpen] = useState(true)
  const [isSalaryOpen, setIsSalaryOpen] = useState(true)
  const [isLocationOpen, setIsLocationOpen] = useState(true)
  
  // Filter state
  const [jobType, setJobType] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState<string>("all")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [isHybrid, setIsHybrid] = useState(false)
  const [isOnsite, setIsOnsite] = useState(false)
  const [salaryRange, setSalaryRange] = useState([50])
  
  // Handle job type selection
  const toggleJobType = (value: string) => {
    setJobType(prev => 
      prev.includes(value) 
        ? prev.filter(type => type !== value) 
        : [...prev, value]
    )
  }
  
  // Handle apply filters
  const handleApplyFilters = () => {
    if (onFilter) {
      onFilter({
        jobType,
        experienceLevel: experienceLevel === 'all' ? [] : [experienceLevel],
        remoteOnly,
        salary: {
          min: 0,
          max: salaryRange[0] * 1000
        },
        skills: []
      })
    }
  }
  
  // Handle reset filters
  const handleResetFilters = () => {
    setJobType([])
    setExperienceLevel('all')
    setRemoteOnly(false)
    setIsHybrid(false)
    setIsOnsite(false)
    setSalaryRange([50])
    
    if (onReset) {
      onReset()
    }
  }
  
  return (
    <Card className="sticky top-20">
      <CardHeader className="px-4 py-4">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-6">
        <div className="space-y-4">
          <Collapsible open={isJobTypeOpen} onOpenChange={setIsJobTypeOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
                Job Type
                <ChevronDown className={`h-4 w-4 transition-transform ${isJobTypeOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="full-time" 
                    checked={jobType.includes("full_time")}
                    onCheckedChange={() => toggleJobType("full_time")}
                  />
                  <Label htmlFor="full-time">Full-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="part-time" 
                    checked={jobType.includes("part_time")}
                    onCheckedChange={() => toggleJobType("part_time")}
                  />
                  <Label htmlFor="part-time">Part-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="contract" 
                    checked={jobType.includes("contract")}
                    onCheckedChange={() => toggleJobType("contract")}
                  />
                  <Label htmlFor="contract">Contract</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="internship" 
                    checked={jobType.includes("internship")}
                    onCheckedChange={() => toggleJobType("internship")}
                  />
                  <Label htmlFor="internship">Internship</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="freelance" 
                    checked={jobType.includes("freelance")}
                    onCheckedChange={() => toggleJobType("freelance")}
                  />
                  <Label htmlFor="freelance">Freelance</Label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <Collapsible open={isExperienceOpen} onOpenChange={setIsExperienceOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
                Experience Level
                <ChevronDown className={`h-4 w-4 transition-transform ${isExperienceOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All levels</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entry" id="entry" />
                  <Label htmlFor="entry">Entry level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mid" id="mid" />
                  <Label htmlFor="mid">Mid level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="senior" id="senior" />
                  <Label htmlFor="senior">Senior level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="executive" id="executive" />
                  <Label htmlFor="executive">Executive level</Label>
                </div>
              </RadioGroup>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <Collapsible open={isSalaryOpen} onOpenChange={setIsSalaryOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
                Salary Range
                <ChevronDown className={`h-4 w-4 transition-transform ${isSalaryOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-4">
                <Slider defaultValue={[50]} max={200} step={10} value={salaryRange} onValueChange={setSalaryRange} />
                <div className="flex items-center justify-between">
                  <span className="text-sm">$0k</span>
                  <span className="font-medium">${salaryRange[0]}k+</span>
                  <span className="text-sm">$200k+</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <Collapsible open={isLocationOpen} onOpenChange={setIsLocationOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
                Location
                <ChevronDown className={`h-4 w-4 transition-transform ${isLocationOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remote" 
                    checked={remoteOnly}
                    onCheckedChange={(checked) => setRemoteOnly(checked === true)}
                  />
                  <Label htmlFor="remote">Remote</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hybrid" 
                    checked={isHybrid}
                    onCheckedChange={(checked) => setIsHybrid(checked === true)}
                  />
                  <Label htmlFor="hybrid">Hybrid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="onsite" 
                    checked={isOnsite}
                    onCheckedChange={(checked) => setIsOnsite(checked === true)}
                  />
                  <Label htmlFor="onsite">On-site</Label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <Button 
            className="w-full" 
            onClick={handleApplyFilters}
            disabled={isLoading}
          >
            {isLoading ? "Applying..." : "Apply Filters"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleResetFilters}
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

