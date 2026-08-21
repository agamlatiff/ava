import type { Metadata } from 'next'
import { CreateHangoutPage } from '@/components/pages/CreateHangoutPage'

export const metadata: Metadata = {
  title: "Ava — Plan Our Next Adventure",
  description: "Plan a new adventure together.",
}


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ activity?: string }>
}) {
  const { activity } = await searchParams
  return <CreateHangoutPage initialActivity={activity} />
}
