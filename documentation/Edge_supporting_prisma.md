# By default edge does not support prisma


DOC:
Create an auth.config.ts file with your config and export it:
auth.config.ts

```typescript
import GitHub from "next-auth/providers/github"

import type { NextAuthConfig } from "next-auth"

export default {
  providers: [GitHub],
} satisfies NextAuthConfig
```

- Create an auth.ts file and add your adapter there, together with the jwt session strategy:
auth.ts
```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"

const prisma = new PrismaClient()

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
```

- Make sure that Middleware is not using the import with a non-edge compatible adapter:
middleware.ts
- export { auth as middleware } from './auth'
+ import authConfig from "./auth.config"
+ import NextAuth from "next-auth"
+ export const { auth: middleware } = NextAuth(authConfig)