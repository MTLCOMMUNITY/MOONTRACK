import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
})

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })


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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (lockoutTime !== null) {
      toast.error(`Too many attempts. Please wait ${lockoutTime} seconds.`)
      return
    }

    setIsLoading(true)
    try {
      const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://moontrack.moontechlife.com'
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${redirectOrigin}/update-password`,
      })

      // Increment attempt counter to prevent email spamming/flooding
      const nextAttempts = failedAttempts + 1
      setFailedAttempts(nextAttempts)
      if (nextAttempts >= 5) {
        setLockoutTime(60)
        toast.error('Too many password reset requests. Please wait 60 seconds.')
        return
      }

      if (error) {
        console.warn('Password reset error:', error.message)
      }

      setIsSuccess(true)
      toast.success('If the email is registered, a password reset link has been sent!')
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className='p-6'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-semibold tracking-tight'>
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your email address and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className='flex flex-col space-y-4'>
              <div className='rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400'>
                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
              </div>
              <Button asChild variant='outline' className='w-full'>
                <Link to='/sign-in'>Return to sign in</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
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

                <Button className='mt-2 w-full' disabled={isLoading || lockoutTime !== null}>
                  {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Mail className='mr-2 h-4 w-4' />}
                  {lockoutTime !== null ? `Locked (${lockoutTime}s)` : 'Send reset link'}
                </Button>

                <div className='mt-4 text-center text-sm'>
                  Remember your password?{' '}
                  <Link to='/sign-in' className='font-medium text-primary hover:underline'>
                    Sign in
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
