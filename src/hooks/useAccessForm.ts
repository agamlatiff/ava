'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/lib/actions/auth'

export type FormState = 'idle' | 'typing' | 'loading' | 'error' | 'success'

export function useAccessForm() {
  const [secret, setSecret] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSecret(val)
    setState(val.length > 0 ? 'typing' : 'idle')
    setErrorMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = secret.trim()
    if (!trimmed) return

    setState('loading')

    try {
      const res = await loginAction(trimmed)

      if (res.success) {
        setState('success')
        setTimeout(() => {
          router.push('/home')
          router.refresh()
        }, 700)
      } else {
        setState('error')
        setErrorMsg(res.error || 'Invalid secret. Try again.')
        setTimeout(() => {
          setState('idle')
          inputRef.current?.focus()
        }, 1500)
      }
    } catch {
      setState('error')
      setErrorMsg('Something went wrong. Please try again.')
      setTimeout(() => {
        setState('idle')
      }, 1500)
    }
  }

  return {
    secret,
    state,
    errorMsg,
    inputRef,
    handleChange,
    handleSubmit,
  }
}
