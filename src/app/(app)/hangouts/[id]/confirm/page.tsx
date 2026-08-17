import type { Metadata } from 'next'
import { getSession } from '@/lib/session'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { ConfirmPage } from '@/components/pages/ConfirmPage'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Let's Go — Confirm Hangout",
  description: "Confirm the finalized hangout plan together.",
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  const currentUserId = session.userId || 'agam'

  const hangout = await hangoutsRepository.findById(id)
  if (!hangout) {
    redirect('/home')
  }

  return <ConfirmPage hangout={hangout} currentUserId={currentUserId} />
}
