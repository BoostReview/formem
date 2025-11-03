import { redirect } from "next/navigation"
import { getProfile } from "@/app/actions/profile"
import { ProfilePageClient } from "./ProfilePageClient"

export default async function ProfilePage() {
  const result = await getProfile()

  if (!result.success) {
    redirect("/dashboard")
  }

  return (
    <ProfilePageClient
      profile={result.profile!}
      org={result.org!}
      user={result.user!}
    />
  )
}


