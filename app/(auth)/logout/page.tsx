'use client'

import { signOut } from 'next-auth/react'
import React from 'react'

type Props = {}

function page({}: Props) {
  return <button onClick={() => signOut()}>Out</button>
}

export default page
