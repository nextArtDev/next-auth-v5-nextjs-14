'use client'

import React, { startTransition, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import OtpInput from '../components/otp-input'
import { activation } from '@/actions/register'
import { useParams, useRouter } from 'next/navigation'
import { FormError } from '@/components/auth/form-error'
import { FormSuccess } from '@/components/auth/form-success'
import { sendSms } from '@/actions/sms'

type FormData = {
  otp: string
}

export default function OtpForm({ params }: { params: { phone: string } }) {
  const router = useRouter()

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      otp: '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      activation({ phone: params.phone, verificationCode: data.otp }).then(
        (res) => {
          setError(res.error)
          setSuccess(res.success)
          if (res.success) {
            router.push('/')
          }
          if (res.error) {
            router.push('/register')
          }
        }
      )
    })

    // console.log(data) // Handle form submission
    // const res = await activation({ id: userID, verificationCode: data.otp })
    // console.log(res)
  }

  // Function to trigger form submission programmatically
  const handleComplete = () => {
    handleSubmit(onSubmit)() // Invoke the submit handler
  }

  return (
    <form dir="ltr" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="otp"
        render={({ field: { onChange, value } }) => (
          <OtpInput
            value={value}
            valueLength={6}
            onChange={onChange}
            onComplete={handleComplete} // Pass the handleComplete function
          />
        )}
      />
      <FormError message={error} />
      <FormSuccess message={success} />
    </form>
  )
}
