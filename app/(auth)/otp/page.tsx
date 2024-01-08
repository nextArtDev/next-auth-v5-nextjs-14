'use client'
// import { useState } from 'react'
// import OtpInput from './otp-input'

// export default function App() {
//   const [otp, setOtp] = useState('')
//   const onChange = (value: string) => setOtp(value)

//   return (
//     <div dir="ltr" className="container w-[800px] max-w-full mx-auto py-5 px-4">
//       <h1>React TypeScript OTP Input</h1>
//       <form action="">
//         <OtpInput value={otp} valueLength={6} onChange={onChange} />
//       </form>
//       <footer className="footer">
//         <a href="https://dominicarrojado.com/posts/how-to-create-your-own-otp-input-in-react-and-typescript-with-tests-part-1/">
//           Learn how to build this OTP input in React and TypeScript
//         </a>
//       </footer>
//     </div>
//   )
// }
import React, { startTransition, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import OtpInput from './components/otp-input'
import { activation } from '@/actions/register'
import { useRouter } from 'next/navigation'
import { FormError } from '@/components/auth/form-error'
import { FormSuccess } from '@/components/auth/form-success'

type FormData = {
  otp: string
}

export default function OtpForm() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      otp: '',
    },
  })
  const userID = 'clr50ystz0004pyjrvxkyn2r6'

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      activation({ id: userID, verificationCode: data.otp }).then((res) => {
        setError(res.error)
        setSuccess(res.success)
        if (res.success) {
          router.push('/')
        }
        if (res.error) {
          router.push('/register')
        }
      })
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
