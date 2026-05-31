import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (lockoutTime === null) return
    if (lockoutTime <= 0) {
      setLockoutTime(null)
      setFailedAttempts(0)
      return
    }
    const timer = setTimeout(() => {
      setLockoutTime(lockoutTime - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [lockoutTime])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (lockoutTime !== null) {
      toast.error(`Too many failed login attempts. Please wait ${lockoutTime} seconds.`)
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        const nextFailed = failedAttempts + 1
        setFailedAttempts(nextFailed)
        if (nextFailed >= 5) {
          setLockoutTime(30)
          toast.error('Too many failed attempts. You have been locked out for 30 seconds.')
        } else {
          toast.error('Invalid email or password. Please try again.')
        }
        return
      }

      setFailedAttempts(0)

      // Success — navigate to dashboard (or redirectTo if provided)
      const targetPath = redirectTo || '/dashboard'
      navigate({ to: targetPath, replace: true })
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='you@example.com'
                  autoComplete='email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex justify-between'>
                <span>Password</span>
                <Link
                  to='/forgot-password'
                  className='text-xs font-medium text-primary hover:underline'
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='••••••••'
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='mt-2' disabled={isLoading || lockoutTime !== null}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {lockoutTime !== null ? `Locked (${lockoutTime}s)` : 'Sign in'}
        </Button>

        <p className='text-center text-xs text-muted-foreground'>
          Access is by invitation only. Contact your manager for credentials.
        </p>
      </form>
    </Form>
  )
}
