import type { Metadata } from 'next'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { SaveMemoryPage } from '@/components/pages/SaveMemoryPage'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Let's Go — Save Memory",
  description: "Capture the highlights of your hangout.",
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const hangout = await hangoutsRepository.findById(id)
  if (!hangout) {
    redirect('/home')
  }

  return <SaveMemoryPage hangout={hangout} />
}
