import { useState } from 'react'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CopyInputProps {
  value: string
  label?: string
}

export function CopyInput({ value, label }: CopyInputProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy. Please copy manually.')
    }
  }

  return (
    <div className='space-y-1.5'>
      {label && (
        <p className='text-xs font-medium text-muted-foreground'>{label}</p>
      )}
      <div className='flex items-center gap-2'>
        <Input
          readOnly
          value={value}
          className='font-mono text-sm'
          onClick={handleCopy}
        />
        <Button
          type='button'
          variant='outline'
          size='icon'
          onClick={handleCopy}
          aria-label='Copy to clipboard'
        >
          {copied ? (
            <IconCheck className='size-4 text-green-500' />
          ) : (
            <IconCopy className='size-4' />
          )}
        </Button>
      </div>
    </div>
  )
}
