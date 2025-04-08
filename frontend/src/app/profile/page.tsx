"use client";

import { useAuth } from "@/components/context/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobSeekerProfileByUserId, createJobSeekerProfile } from "@/lib/api/job-seeker-profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PencilIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, userType, loading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id && userType === 'job-seeker') {
        try {
          const response = await getJobSeekerProfileByUserId(user.id);
          console.log("Profile API response:", response);
          
          // Check if we got data back and it's an array with at least one item
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            setProfileData(response.data[0]);
          } else if (response.data && !Array.isArray(response.data)) {
            // Or if it's directly an object
            setProfileData(response.data);
          } else {
            setError("No profile found. You need to create your profile.");
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          setError(`Error loading profile: ${error.message || 'Unknown error'}`);
        }
      }
      setIsLoading(false);
    };

    if (!loading) {
      loadProfile();
    }
  }, [user, userType, loading]);

  const handleCreateProfile = async () => {
    if (!user?.id) return;
    
    setIsCreatingProfile(true);
    try {
      const newProfileData = {
        users_permissions_user: user.id,
        firstName: user.username || "",
        lastName: "",
        email: user.email || "",
        phoneNumber: "",
      };
      
      const response = await createJobSeekerProfile(newProfileData);
      console.log("Created profile:", response);
      
      // Reload the page to show the new profile
      window.location.reload();
    } catch (error) {
      console.error("Error creating profile:", error);
      setError(`Error creating profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            Loading profile...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            Please log in to view your profile
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract user_permissions_user data if available
  const userPermissionsUser = profileData?.users_permissions_user || {};

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Profile</CardTitle>
          {profileData && (
            <Button asChild variant="outline" size="sm">
              <Link href="/profile/edit">
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4">
              <div className="text-red-500 mb-2">
                {error}
              </div>
              
              {userType === 'job-seeker' && (
                <Button 
                  onClick={handleCreateProfile}
                  disabled={isCreatingProfile}
                >
                  {isCreatingProfile ? 'Creating...' : 'Create My Profile'}
                </Button>
              )}
            </div>
          )}
          
          {profileData ? (
            <div>
              <h2 className="text-xl font-semibold">
                {profileData.firstName && profileData.lastName 
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : userPermissionsUser.username || user.username}
              </h2>
              
              {profileData.email && (
                <p className="text-gray-600 mt-1">{profileData.email}</p>
              )}
              
              {profileData.location && (
                <p className="text-gray-600 mt-1">{profileData.location}</p>
              )}

              {profileData.jobPreferences && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {profileData.jobPreferences === 'remote' ? 'Remote' : 
                     profileData.jobPreferences === 'on-site' ? 'On-site' : 'Hybrid'}
                  </span>
                </div>
              )}
              
              {profileData.bio && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-1">About</h3>
                  <p className="text-gray-700">{profileData.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Contact Information */}
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                  {profileData.phoneNumber && (
                    <p className="text-gray-700"><span className="font-medium">Phone:</span> {profileData.phoneNumber}</p>
                  )}
                  {profileData.email && (
                    <p className="text-gray-700"><span className="font-medium">Email:</span> {profileData.email}</p>
                  )}
                  {profileData.linkedin && (
                    <p className="text-gray-700"><span className="font-medium">LinkedIn:</span> <a href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profileData.linkedin}</a></p>
                  )}
                  {profileData.github && (
                    <p className="text-gray-700"><span className="font-medium">GitHub:</span> <a href={profileData.github.startsWith('http') ? profileData.github : `https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profileData.github}</a></p>
                  )}
                  {profileData.website && (
                    <p className="text-gray-700"><span className="font-medium">Website:</span> <a href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profileData.website}</a></p>
                  )}
                </div>
    
                {/* Salary Expectations */}
                {profileData.salaryExpectations && (
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Salary Expectations</h3>
                    <p className="text-gray-700">${Number(profileData.salaryExpectations).toLocaleString()} per year</p>
                  </div>
                )}
              </div>
              
              {/* Skills section */}
              {profileData.skills && profileData.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill) => (
                      <span key={skill.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Experience section */}
              {profileData.experiences && profileData.experiences.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Experience</h3>
                  {profileData.experiences.map((exp, index) => (
                    <div key={index} className="mb-4 border-l-2 border-gray-300 pl-4 py-1">
                      <p className="font-medium text-base">{exp.title || exp.position}</p>
                      <p className="text-gray-700">{exp.company}</p>
                      <p className="text-gray-600 text-sm">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                      <p className="mt-1 text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Education section */}
              {profileData.educations && profileData.educations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Education</h3>
                  {profileData.educations.map((edu, index) => (
                    <div key={index} className="mb-4 border-l-2 border-gray-300 pl-4 py-1">
                      <p className="font-medium text-base">{edu.institution}</p>
                      <p className="text-gray-700">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</p>
                      <p className="text-gray-600 text-sm">
                        {edu.startDate} - {edu.endDate || 'Present'}
                      </p>
                      {edu.description && <p className="mt-1 text-gray-700">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Certifications section */}
              {profileData.certifications && profileData.certifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Certifications</h3>
                  {profileData.certifications.map((cert, index) => (
                    <div key={index} className="mb-4 border-l-2 border-gray-300 pl-4 py-1">
                      <p className="font-medium text-base">{cert.name}</p>
                      <p className="text-gray-700">{cert.issuingOrganization}</p>
                      <p className="text-gray-600 text-sm">
                        Issued: {cert.issueDate}
                        {cert.expirationDate && ` · Expires: ${cert.expirationDate}`}
                      </p>
                      {cert.credentialId && (
                        <p className="text-gray-700 text-sm">Credential ID: {cert.credentialId}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Resume section */}
              {profileData.resume && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Resume</h3>
                  <Button asChild variant="outline">
                    <a href={`https://job-hunt-strapi-backend.fly.dev${profileData.resume.url}`} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ) : !error ? (
            <p>No profile information available. Please complete your profile.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
