# middleware

## matcher 

everything inside config and matcher _just invoke the middleware_.
for example if we add : _matcher:['/auth/login']_ it wont be protected or public, it just would invoke the middleware when we route to this path.
so this long expression _matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']_ means _everything will invoke the middleware except this_

```typescript

export default auth((req) => {
    //..
    const isLoggedIn = !!req.auth;
    // This will be answered in every single route, except the matcher ones 
    console.log("Is logged In?",isLoggedIn )
}

export const config = {
    // this is from clerck not next-auth
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

__Here we protect ALL routes by default and then except them by config__