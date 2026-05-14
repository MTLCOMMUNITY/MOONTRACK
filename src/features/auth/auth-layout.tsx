import { IconMoon } from '@tabler/icons-react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center bg-background'>
      <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-6 py-8 sm:p-8'>

        {/* Brand header */}
        <div className='flex flex-col items-center gap-2 text-center'>
          <div className='flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md'>
            <IconMoon className='size-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Moon<span className='text-primary'>Track</span>
            </h1>
            <p className='text-xs text-muted-foreground'>MoonTech Life Community</p>
          </div>
        </div>

        {children}

        {/* Footer */}
        <p className='text-center text-xs text-muted-foreground'>
          Influencer Affiliate Dashboard &mdash; For internal use only
        </p>
      </div>
    </div>
  )
}
