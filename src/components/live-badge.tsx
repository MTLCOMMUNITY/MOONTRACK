interface LiveBadgeProps {
  isLive: boolean
}

export function LiveBadge({ isLive }: LiveBadgeProps) {
  if (!isLive) return null
  return (
    <span className='flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400'>
      <span className='relative flex size-2'>
        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
        <span className='relative inline-flex size-2 rounded-full bg-green-500' />
      </span>
      Live
    </span>
  )
}
