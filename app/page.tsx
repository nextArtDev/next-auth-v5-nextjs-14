import { auth } from '@/auth'
import { LoginButton } from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const session = await auth()

  // Client Side
  // const data = useSession()
  // const session = data.data

  // console.log(session?.user)
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-200 to-blue-400">
      <div className="space-y-6 text-center">
        <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md')}>
          🔐 Auth
        </h1>
        {session?.user ? (
          <Link href={'/logout'}>Log uot</Link>
        ) : (
          <Link href={'/login'}>Log In</Link>
        )}
        <p>{session?.user.name}</p>

        <div className="mx-auto relative w-32 h-32 rounded-full">
          {session?.user?.image && (
            <Image
              fill
              src={session?.user?.image}
              alt="me"
              className="rounded-full object-cover"
            />
          )}
        </div>
        <p>{session?.user.phone}</p>
        <p className="text-white text-lg">A simple authentication service</p>
        <div>
          <LoginButton asChild>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
          {/* <LoginButton mode="modal" asChild>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton> */}
        </div>
      </div>
    </main>
  )
}

// tailwind gradient
// background-image: radial-gradient(
//     ellipse at top,
//     #6366f1,
//     #0ea5e9
//   );
