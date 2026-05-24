import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/ai-website-bootcamp')({
  component: BootcampLandingPage,
})

function BootcampLandingPage() {
  return (
    <>
      <div className='min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900'>
        <nav className='sticky top-0 z-50 bg-white shadow-sm'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex h-16 items-center justify-between'>
              <a href='/'>
                <div className='flex items-center space-x-3'>
                  <img
                    src='/moonLogoVariation1.png'
                    alt='MoonTech Life'
                    className='h-10 w-10'
                  />
                  <span className='text-xl font-bold text-gray-900'>
                    MoonTech Life
                  </span>
                </div>
              </a>
              <div className='hidden items-center space-x-8 md:flex'>
                <a
                  className='font-medium text-gray-700 transition-colors hover:text-blue-600'
                  href='/explore-programs'
                >
                  Explore Programs
                </a>
                <a
                  className='transform rounded-full bg-gradient-to-r from-blue-600 to-yellow-500 px-6 py-2 font-medium text-white transition-all hover:scale-105 hover:shadow-lg'
                  href='/100-days-tech-challenge'
                >
                  100 Days Tech Challenge
                </a>
              </div>
              <div className='md:hidden'>
                <button className='text-gray-700 transition-colors hover:text-blue-600'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-menu h-6 w-6'
                    aria-hidden='true'
                  >
                    <path d='M4 5h16'></path>
                    <path d='M4 12h16'></path>
                    <path d='M4 19h16'></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <section className='relative flex min-h-screen items-center overflow-hidden bg-[#0A0F1E]'>
          <div
            className='pointer-events-none absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          ></div>
          <div className='pointer-events-none absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]'></div>
          <div className='pointer-events-none absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-yellow-500/8 blur-[100px]'></div>
          <div className='relative z-10 mx-auto w-full max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8'>
            <div className='grid items-center gap-16 lg:grid-cols-2'>
              <div className='text-center lg:text-left'>
                <div className='mb-10 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2.5 text-sm font-bold text-yellow-400 backdrop-blur-sm'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-yellow-400'></div>
                  Limited Time — Early Bird Pricing Open
                </div>
                <h1 className='mb-8 text-5xl leading-[1.05] font-black tracking-tight text-white md:text-7xl'>
                  Stand Out by
                  <br />
                  Building{' '}
                  <span className='relative inline-block'>
                    <span className='bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent'>
                      Secure
                    </span>
                    <span className='absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-60'></span>
                  </span>
                  ,<br />
                  <span className='text-white'>Professional AI</span>
                  <br />
                  <span className='text-white'>Websites</span>
                </h1>
                <p className='mx-auto mb-10 max-w-lg text-lg leading-relaxed text-gray-400 lg:mx-0'>
                  A 4-week intensive program that teaches you how to build
                  websites with AI, protect them from vulnerabilities, and turn
                  your skills into real-world opportunities.
                </p>
                <div className='mb-10 flex items-center justify-center gap-4 lg:justify-start'>
                  <div className='flex -space-x-3'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0A0F1E] bg-gradient-to-br from-blue-500 to-blue-700 text-[10px] font-black text-white'>
                      UK
                    </div>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0A0F1E] bg-gradient-to-br from-blue-500 to-blue-700 text-[10px] font-black text-white'>
                      PT
                    </div>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0A0F1E] bg-gradient-to-br from-blue-500 to-blue-700 text-[10px] font-black text-white'>
                      HA
                    </div>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0A0F1E] bg-gradient-to-br from-blue-500 to-blue-700 text-[10px] font-black text-white'>
                      MI
                    </div>
                  </div>
                  <div>
                    <div className='mb-0.5 flex text-xs text-yellow-400'>
                      ★★★★★
                    </div>
                    <p className='text-xs text-gray-400'>
                      <span className='font-bold text-white'>
                        200+ students
                      </span>{' '}
                      already enrolled
                    </p>
                  </div>
                </div>
                <div className='mb-10'>
                  <p className='mb-4 flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-yellow-400 uppercase lg:justify-start'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-timer h-3.5 w-3.5'
                      aria-hidden='true'
                    >
                      <line x1='10' x2='14' y1='2' y2='2'></line>
                      <line x1='12' x2='15' y1='14' y2='11'></line>
                      <circle cx='12' cy='14' r='8'></circle>
                    </svg>
                    Early bird closes in
                  </p>
                  <div className='flex justify-center gap-3 md:justify-start'>
                    <div className='text-center'>
                      <div className='min-w-[68px] rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm'>
                        <span className='block text-2xl font-black text-white'>
                          10
                        </span>
                        <span className='text-[10px] font-bold tracking-wider text-yellow-400 uppercase'>
                          Days
                        </span>
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='min-w-[68px] rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm'>
                        <span className='block text-2xl font-black text-white'>
                          04
                        </span>
                        <span className='text-[10px] font-bold tracking-wider text-yellow-400 uppercase'>
                          Hours
                        </span>
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='min-w-[68px] rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm'>
                        <span className='block text-2xl font-black text-white'>
                          32
                        </span>
                        <span className='text-[10px] font-bold tracking-wider text-yellow-400 uppercase'>
                          Mins
                        </span>
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='min-w-[68px] rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm'>
                        <span className='block text-2xl font-black text-white'>
                          52
                        </span>
                        <span className='text-[10px] font-bold tracking-wider text-yellow-400 uppercase'>
                          Secs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col justify-center gap-4 sm:flex-row lg:justify-start'>
                  <Link
                    className='group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-4 text-lg font-black text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]'
                    to='/checkout'
                  >
                    <span className='relative z-10'>Secure Your Spot Now</span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-arrow-right relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1'
                      aria-hidden='true'
                    >
                      <path d='M5 12h14'></path>
                      <path d='m12 5 7 7-7 7'></path>
                    </svg>
                    <div className='absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 transition-opacity group-hover:opacity-100'></div>
                  </Link>
                  <div className='flex flex-col items-center justify-center px-2 text-center sm:items-start sm:text-left'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-2xl font-black text-white'>
                        ₦25,000
                      </span>
                      <span className='text-sm text-gray-500 line-through'>
                        ₦50,000
                      </span>
                    </div>
                    <span className='text-xs font-bold text-green-400'>
                      50% Early Bird Discount
                    </span>
                  </div>
                </div>
                <div className='mt-4 flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:items-center sm:gap-2 lg:justify-start'>
                  <div className='flex items-center gap-1.5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-lock h-3.5 w-3.5 flex-shrink-0 text-gray-500'
                      aria-hidden='true'
                    >
                      <rect
                        width='18'
                        height='11'
                        x='3'
                        y='11'
                        rx='2'
                        ry='2'
                      ></rect>
                      <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                    </svg>
                    <span className='text-xs text-gray-500'>
                      Secure payment via{' '}
                      <span className='font-bold text-white'>Flutterwave</span>
                    </span>
                  </div>
                  <span className='hidden text-xs text-gray-600 sm:inline'>
                    ·
                  </span>
                  <span className='text-xs text-gray-500'>
                    SSL encrypted · No hidden fees
                  </span>
                </div>
                <div className='mx-auto mt-8 flex max-w-lg flex-col items-center justify-center gap-4 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/10 p-6 lg:mx-0 lg:items-start lg:justify-start'>
                  <div className='text-center lg:text-left'>
                    <p className='mb-1 text-lg font-bold text-white'>
                      Still deciding or have questions?
                    </p>
                    <p className='text-sm text-gray-400'>
                      Join our WhatsApp chat group to hear more info from the
                      team before making payment.
                    </p>
                  </div>
                  <a
                    className='group text-md relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] sm:w-auto'
                    href='https://chat.whatsapp.com/CThjVXHpwfu5IHPFSCDuLI?mode=gi_t'
                  >
                    <span>Join WhatsApp Group</span>
                  </a>
                </div>
              </div>
              <div className='relative hidden items-center justify-center lg:flex'>
                <div className='relative w-full max-w-[520px] overflow-hidden rounded-3xl border border-white/10 bg-[#0D1526] shadow-[0_0_80px_rgba(59,130,246,0.15)] backdrop-blur'>
                  <div className='flex items-center gap-2 border-b border-white/5 bg-[#111827] px-5 py-4'>
                    <div className='h-3 w-3 rounded-full bg-red-400/80'></div>
                    <div className='h-3 w-3 rounded-full bg-yellow-400/80'></div>
                    <div className='h-3 w-3 rounded-full bg-green-400/80'></div>
                    <span className='ml-3 font-mono text-xs text-gray-500'>
                      secure-website.tsx
                    </span>
                    <div className='ml-auto flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1'>
                      <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-400'></div>
                      <span className='text-[10px] font-bold text-green-400'>
                        SECURE
                      </span>
                    </div>
                  </div>
                  <div className='p-6 font-mono text-sm leading-7'>
                    <div>
                      <span className='text-blue-400'>import</span>{' '}
                      <span className='text-white'>
                        &#123;SecurityLayer&#125;
                      </span>{' '}
                      <span className='text-blue-400'>from</span>{' '}
                      <span className='text-green-400'>
                        &#x27;@moontech/shield&#x27;
                      </span>
                    </div>
                    <div className='mt-2'>
                      <span className='text-purple-400'>const</span>{' '}
                      <span className='text-yellow-300'>buildWithAI</span>{' '}
                      <span className='text-white'>= (</span>
                      <span className='text-orange-300'>project</span>
                      <span className='text-white'>) =&gt; &#123;</span>
                    </div>
                    <div className='pl-6'>
                      <span className='text-blue-400'>return</span>{' '}
                      <span className='text-white'>&#123;</span>
                    </div>
                    <div className='pl-12'>
                      <span className='text-green-300'>status</span>
                      <span className='text-white'>:</span>{' '}
                      <span className='text-yellow-300'>
                        &#x27;production-ready&#x27;
                      </span>
                      <span className='text-white'>,</span>
                    </div>
                    <div className='pl-12'>
                      <span className='text-green-300'>security</span>
                      <span className='text-white'>:</span>{' '}
                      <span className='text-yellow-300'>
                        &#x27;enterprise-grade&#x27;
                      </span>
                      <span className='text-white'>,</span>
                    </div>
                    <div className='pl-12'>
                      <span className='text-green-300'>aiPowered</span>
                      <span className='text-white'>:</span>{' '}
                      <span className='text-blue-300'>true</span>
                    </div>
                    <div className='pl-6'>
                      <span className='text-white'>&#125;</span>
                    </div>
                    <div>
                      <span className='text-white'>&#125;</span>
                    </div>
                    <div className='mt-4 flex items-center gap-2'>
                      <div className='h-4 w-2 animate-pulse rounded-sm bg-blue-400'></div>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 bg-blue-600 px-5 py-3 text-xs text-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-shield h-3.5 w-3.5'
                      aria-hidden='true'
                    >
                      <path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'></path>
                    </svg>
                    <span className='font-bold'>
                      0 vulnerabilities detected — All clear ✓
                    </span>
                    <span className='ml-auto text-blue-200'>
                      4-week bootcamp
                    </span>
                  </div>
                </div>
                <div
                  className='absolute -top-4 -left-4 animate-bounce rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl'
                  style={{ animationDuration: '3s' }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-green-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-5 w-5 text-green-600'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <div>
                      <p className='text-[10px] font-medium text-gray-500'>
                        Security Verified
                      </p>
                      <p className='text-sm font-black text-gray-900'>
                        Enterprise Grade
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className='absolute -right-4 -bottom-4 rounded-2xl border border-white/10 bg-[#111827] p-4 shadow-2xl'
                  style={{ animation: 'bounce 4s ease-in-out infinite' }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/20'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-award h-5 w-5 text-yellow-400'
                        aria-hidden='true'
                      >
                        <path d='m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526'></path>
                        <circle cx='12' cy='8' r='6'></circle>
                      </svg>
                    </div>
                    <div>
                      <p className='text-[10px] font-medium text-gray-500'>
                        Upon Completion
                      </p>
                      <p className='text-sm font-black text-white'>
                        Certified Developer
                      </p>
                    </div>
                  </div>
                </div>
                <div className='absolute top-1/2 -right-8 -translate-y-1/2 rounded-2xl border border-blue-500/20 bg-[#111827] px-4 py-3 shadow-xl'>
                  <div className='text-center'>
                    <p className='text-2xl font-black text-yellow-400'>4</p>
                    <p className='text-[10px] font-bold tracking-wider text-gray-400 uppercase'>
                      Weeks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-white/5 to-transparent'></div>
        </section>
        <section className='bg-white py-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-16 text-center'>
              <h2 className='mb-4 text-sm font-bold tracking-widest text-blue-600 uppercase'>
                The Community Behind the Magic
              </h2>
              <h3 className='mb-6 text-3xl font-bold text-gray-900 md:text-5xl'>
                About Moontech Life
              </h3>
              <p className='mx-auto max-w-3xl text-xl leading-relaxed text-gray-600'>
                Moontech Life is a tech community helping people break into
                tech. We recently hosted the 100 Days Tech Challenge, with over
                2,000 participants.
              </p>
            </div>
            <div className='mb-20 grid gap-8 text-center md:grid-cols-3'>
              <div className='transform rounded-3xl border border-gray-100 bg-gray-50 p-8 transition-all hover:-translate-y-2'>
                <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-users'
                    aria-hidden='true'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                    <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                    <circle cx='9' cy='7' r='4'></circle>
                  </svg>
                </div>
                <div className='mb-2 text-4xl font-bold text-gray-900'>
                  2,000+
                </div>
                <div className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
                  Community Members
                </div>
              </div>
              <div className='transform rounded-3xl border border-gray-100 bg-gray-50 p-8 transition-all hover:-translate-y-2'>
                <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-rocket'
                    aria-hidden='true'
                  >
                    <path d='M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z'></path>
                    <path d='m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'></path>
                    <path d='M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0'></path>
                    <path d='M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'></path>
                  </svg>
                </div>
                <div className='mb-2 text-4xl font-bold text-gray-900'>
                  500+
                </div>
                <div className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
                  Successful Projects
                </div>
              </div>
              <div className='transform rounded-3xl border border-gray-100 bg-gray-50 p-8 transition-all hover:-translate-y-2'>
                <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-award'
                    aria-hidden='true'
                  >
                    <path d='m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526'></path>
                    <circle cx='12' cy='8' r='6'></circle>
                  </svg>
                </div>
                <div className='mb-2 text-4xl font-bold text-gray-900'>
                  150+
                </div>
                <div className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
                  Career Transitions
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='bg-[#0F172A] py-24 text-white'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='grid items-center gap-16 lg:grid-cols-2'>
              <div>
                <h2 className='mb-8 text-3xl leading-tight font-bold md:text-5xl'>
                  Why This Program is{' '}
                  <span className='text-blue-400'>Different</span>
                </h2>
                <p className='mb-10 text-xl leading-relaxed text-gray-300'>
                  AI makes building websites easy, but most creators ignore the
                  risks. Websites can be hacked, client projects can fail, and
                  opportunities can be lost.
                </p>
                <div className='space-y-6'>
                  <div className='flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-6'>
                    <div className='mt-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-6 w-6 text-blue-400'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className='mb-1 text-lg font-bold'>
                        Beyond Drag-and-Drop
                      </h4>
                      <p className='text-gray-400'>
                        Learn the &#x27;How&#x27; and &#x27;Why&#x27; behind
                        AI-generated code.
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-6'>
                    <div className='mt-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-6 w-6 text-blue-400'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className='mb-1 text-lg font-bold'>
                        Security-First Mentality
                      </h4>
                      <p className='text-gray-400'>
                        Protect your client&#x27;s data and your reputation.
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-6'>
                    <div className='mt-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-6 w-6 text-blue-400'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className='mb-1 text-lg font-bold'>
                        Production-Ready Skills
                      </h4>
                      <p className='text-gray-400'>
                        Build sites that actually handle real traffic and
                        attacks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-yellow-500/20 p-8 backdrop-blur-sm'>
                <div className='mb-8 flex items-center gap-3'>
                  <div className='h-3 w-3 rounded-full bg-red-400'></div>
                  <div className='h-3 w-3 rounded-full bg-yellow-400'></div>
                  <div className='h-3 w-3 rounded-full bg-green-400'></div>
                  <span className='ml-2 font-mono text-xs text-gray-400'>
                    security_audit_report.vinc
                  </span>
                </div>
                <div className='space-y-4 font-mono text-sm text-blue-100'>
                  <p className='text-xs text-green-400'>
                    # Scanning AI-generated component...
                  </p>
                  <p>
                    <span className='text-red-400'>[!]</span> Vulnerability
                    detected: Cross-Site Scripting (XSS)
                  </p>
                  <p>
                    <span className='text-red-400'>[!]</span> Missing CSP
                    Headers
                  </p>
                  <p className='pt-4 text-yellow-400'>
                    # Remediation steps initiated...
                  </p>
                  <div className='h-2 w-full overflow-hidden rounded-full bg-white/10'>
                    <div className='h-full w-2/3 bg-blue-500'></div>
                  </div>
                  <p className='pt-2 text-center text-xs tracking-widest text-gray-500 uppercase'>
                    Protecting what you build
                  </p>
                </div>
                <div className='mt-12 text-center'>
                  <p className='mb-4 text-lg font-bold'>
                    Don&#x27;t just build. Build Securely.
                  </p>
                  <p className='text-sm text-gray-400'>
                    Most AI courses stop at &quot;it works&quot;. We start at
                    &quot;it&#x27;s safe&quot;.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='bg-gray-50 py-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-20 text-center'>
              <h2 className='mb-6 text-3xl font-bold text-gray-900 md:text-5xl'>
                4-Week Intensive Curriculum
              </h2>
              <p className='text-xl text-gray-600'>
                A structured path from messy AI prompts to professional
                engineering.
              </p>
            </div>
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 transition-all hover:scale-105'>
                <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-cpu'
                    aria-hidden='true'
                  >
                    <path d='M12 20v2'></path>
                    <path d='M12 2v2'></path>
                    <path d='M17 20v2'></path>
                    <path d='M17 2v2'></path>
                    <path d='M2 12h2'></path>
                    <path d='M2 17h2'></path>
                    <path d='M2 7h2'></path>
                    <path d='M20 12h2'></path>
                    <path d='M20 17h2'></path>
                    <path d='M20 7h2'></path>
                    <path d='M7 20v2'></path>
                    <path d='M7 2v2'></path>
                    <rect x='4' y='4' width='16' height='16' rx='2'></rect>
                    <rect x='8' y='8' width='8' height='8' rx='1'></rect>
                  </svg>
                </div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 uppercase'>
                    Week 1
                  </span>
                </div>
                <h4 className='mb-4 text-xl font-bold text-gray-900'>
                  AI Coding Workflow &amp; Setup
                </h4>
                <p className='text-sm leading-relaxed text-gray-600'>
                  Learn how to code with AI, not just write code. Hands-on setup
                  of real projects like a pro developer.
                </p>
              </div>
              <div className='rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 transition-all hover:scale-105'>
                <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-code'
                    aria-hidden='true'
                  >
                    <path d='m16 18 6-6-6-6'></path>
                    <path d='m8 6-6 6 6 6'></path>
                  </svg>
                </div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 uppercase'>
                    Week 2
                  </span>
                </div>
                <h4 className='mb-4 text-xl font-bold text-gray-900'>
                  Feature Building &amp; Pair Programming
                </h4>
                <p className='text-sm leading-relaxed text-gray-600'>
                  Build real-world features using AI as your coding partner.
                  Gain practical skills in collaborative coding.
                </p>
              </div>
              <div className='rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 transition-all hover:scale-105'>
                <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-lock'
                    aria-hidden='true'
                  >
                    <rect
                      width='18'
                      height='11'
                      x='3'
                      y='11'
                      rx='2'
                      ry='2'
                    ></rect>
                    <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                  </svg>
                </div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 uppercase'>
                    Week 3
                  </span>
                </div>
                <h4 className='mb-4 text-xl font-bold text-gray-900'>
                  Securing AI Code
                </h4>
                <p className='text-sm leading-relaxed text-gray-600'>
                  Understand vulnerabilities and protect your projects from
                  potential attacks, making your websites safe.
                </p>
              </div>
              <div className='rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 transition-all hover:scale-105'>
                <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-globe'
                    aria-hidden='true'
                  >
                    <circle cx='12' cy='12' r='10'></circle>
                    <path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'></path>
                    <path d='M2 12h20'></path>
                  </svg>
                </div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 uppercase'>
                    Week 4
                  </span>
                </div>
                <h4 className='mb-4 text-xl font-bold text-gray-900'>
                  Deployment &amp; Security Review
                </h4>
                <p className='text-sm leading-relaxed text-gray-600'>
                  Launch your projects confidently while reviewing security
                  practices just like a real engineer.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className='overflow-hidden bg-white py-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-20 text-center'>
              <h2 className='mb-6 text-3xl font-bold text-gray-900 md:text-5xl'>
                Meet Your Facilitators
              </h2>
              <p className='text-xl text-gray-600'>
                The experts who will guide you through the 4-week journey.
              </p>
            </div>
            <div className='grid gap-12 md:grid-cols-2'>
              <div className='group relative flex flex-col items-center gap-8 rounded-[2.5rem] border border-gray-100 bg-gray-50 p-6 transition-all duration-500 hover:bg-white hover:shadow-2xl md:flex-row'>
                <div className='relative h-80 w-64 flex-shrink-0 overflow-hidden rounded-[2rem] shadow-xl'>
                  <img
                    alt='Oluwasola Adebayo'
                    loading='lazy'
                    decoding='async'
                    data-nimg='fill'
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: '0',
                      top: '0',
                      right: '0',
                      bottom: '0',
                      color: 'transparent',
                    }}
                    sizes='100vw'
                    srcSet='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=640&amp;q=75 640w, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=750&amp;q=75 750w, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=828&amp;q=75 828w, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=3840&amp;q=75 3840w'
                    src='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage.png&amp;w=3840&amp;q=75'
                  />
                </div>
                <div className='flex-1'>
                  <h4 className='mb-2 text-2xl font-bold text-gray-900'>
                    Oluwasola Adebayo
                  </h4>
                  <p className='mb-4 text-sm font-bold tracking-wider text-blue-600 uppercase'>
                    Cybersecurity Professional
                  </p>
                  <p className='leading-relaxed text-gray-600 italic'>
                    &quot;With over 5 years of experience, Oluwasola specializes
                    in identifying vulnerabilities and securing digital systems.
                    He will guide you on how to spot weaknesses in AI-built
                    websites.&quot;
                  </p>
                </div>
              </div>
              <div className='group relative flex flex-col items-center gap-8 rounded-[2.5rem] border border-gray-100 bg-gray-50 p-6 transition-all duration-500 hover:bg-white hover:shadow-2xl md:flex-row'>
                <div className='relative h-80 w-64 flex-shrink-0 overflow-hidden rounded-[2rem] shadow-xl'>
                  <img
                    alt='Casper Okpara'
                    loading='lazy'
                    decoding='async'
                    data-nimg='fill'
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: '0',
                      top: '0',
                      right: '0',
                      bottom: '0',
                      color: 'transparent',
                    }}
                    sizes='100vw'
                    srcSet='/_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=640&amp;q=75 640w, /_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=750&amp;q=75 750w, /_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=828&amp;q=75 828w, /_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=1080&amp;q=75 1080w, /_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=1920&amp;q=75 1920w, /_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=2048&amp;q=75 2048w, /_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=3840&amp;q=75 3840w'
                    src='/_next/image?url=%2Fimages%2Fbootcamp%2F5bngru6q.png&amp;w=3840&amp;q=75'
                  />
                </div>
                <div className='flex-1'>
                  <h4 className='mb-2 text-2xl font-bold text-gray-900'>
                    Casper Okpara
                  </h4>
                  <p className='mb-4 text-sm font-bold tracking-wider text-blue-600 uppercase'>
                    Tech Entrepreneur &amp; AI Advocate
                  </p>
                  <p className='leading-relaxed text-gray-600 italic'>
                    &quot;Casper builds business-focused AI solutions and trains
                    people on AI and web development. He&#x27;ll guide you on
                    how to leverage AI to build functional, secure
                    products.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='overflow-hidden bg-white py-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-20 text-center'>
              <h2 className='mb-6 text-3xl font-bold text-gray-900 md:text-5xl'>
                What Our Students Say
              </h2>
              <p className='text-xl text-gray-600'>
                Real stories from real community members.
              </p>
            </div>
            <div className='grid gap-12 md:grid-cols-2'>
              <div className='group relative flex flex-col items-center overflow-hidden rounded-[3rem] border border-gray-100 bg-gray-50 p-10 text-center transition-all duration-500 hover:bg-white hover:shadow-2xl'>
                <div className='pointer-events-none absolute top-8 right-10 text-blue-500/5 transition-colors group-hover:text-blue-500/10'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-star h-20 w-20 fill-current'
                    aria-hidden='true'
                  >
                    <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                  </svg>
                </div>
                <div className='relative mb-8'>
                  <div className='absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-yellow-500 opacity-20 blur-xl transition-opacity group-hover:opacity-40'></div>
                  <div className='relative h-32 w-32 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-yellow-500 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-110'>
                    <div className='h-full w-full overflow-hidden rounded-full bg-white p-1'>
                      <img
                        alt='Ukeme Columba'
                        loading='lazy'
                        width='128'
                        height='128'
                        decoding='async'
                        data-nimg='1'
                        className='h-full w-full rounded-full object-cover'
                        style={{ color: 'transparent' }}
                        srcSet='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%202.png&amp;w=128&amp;q=75 1x, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%202.png&amp;w=256&amp;q=75 2x'
                        src='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%202.png&amp;w=256&amp;q=75'
                      />
                    </div>
                  </div>
                  <div className='absolute -right-2 -bottom-2 rounded-full border border-blue-100 bg-white p-1.5 shadow-lg'>
                    <div className='rounded-full bg-blue-600 p-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-4 w-4 text-white'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='relative z-10 w-full'>
                  <div className='mb-6 flex justify-center text-yellow-400'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                  </div>
                  <p className='mb-8 text-lg leading-relaxed font-medium text-gray-600 italic'>
                    &quot;Joining the MoonTechLife community gave me real
                    clarity. I went from not understanding digital marketing to
                    confidently using AI tools to improve my work. Now, I can
                    confidently help brands grow.&quot;
                  </p>
                  <div className='space-y-1'>
                    <h5 className='text-2xl font-black tracking-tight text-gray-900'>
                      Ukeme Columba
                    </h5>
                    <p className='text-xs font-bold tracking-[0.2em] text-blue-600 uppercase'>
                      Moontech Life Member
                    </p>
                  </div>
                </div>
                <div className='mt-8 flex w-full justify-center gap-4 border-t border-gray-100 pt-8'>
                  <div className='flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-[10px] font-black tracking-widest text-blue-600 uppercase'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-users h-3 w-3'
                      aria-hidden='true'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                      <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                      <circle cx='9' cy='7' r='4'></circle>
                    </svg>
                    COMMUNITY VERIFIED
                  </div>
                </div>
              </div>
              <div className='group relative flex flex-col items-center overflow-hidden rounded-[3rem] border border-gray-100 bg-gray-50 p-10 text-center transition-all duration-500 hover:bg-white hover:shadow-2xl'>
                <div className='pointer-events-none absolute top-8 right-10 text-blue-500/5 transition-colors group-hover:text-blue-500/10'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-star h-20 w-20 fill-current'
                    aria-hidden='true'
                  >
                    <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                  </svg>
                </div>
                <div className='relative mb-8'>
                  <div className='absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-yellow-500 opacity-20 blur-xl transition-opacity group-hover:opacity-40'></div>
                  <div className='relative h-32 w-32 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-yellow-500 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-110'>
                    <div className='h-full w-full overflow-hidden rounded-full bg-white p-1'>
                      <img
                        alt='Princess Truth'
                        loading='lazy'
                        width='128'
                        height='128'
                        decoding='async'
                        data-nimg='1'
                        className='h-full w-full rounded-full object-cover'
                        style={{ color: 'transparent' }}
                        srcSet='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%203.png&amp;w=128&amp;q=75 1x, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%203.png&amp;w=256&amp;q=75 2x'
                        src='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%203.png&amp;w=256&amp;q=75'
                      />
                    </div>
                  </div>
                  <div className='absolute -right-2 -bottom-2 rounded-full border border-blue-100 bg-white p-1.5 shadow-lg'>
                    <div className='rounded-full bg-blue-600 p-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-4 w-4 text-white'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='relative z-10 w-full'>
                  <div className='mb-6 flex justify-center text-yellow-400'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                  </div>
                  <p className='mb-8 text-lg leading-relaxed font-medium text-gray-600 italic'>
                    &quot;Before joining, I had interest in tech but lacked
                    structure and confidence. Now, I’m building real skills in
                    virtual assistance and digital marketing. I can confidently
                    offer my services.&quot;
                  </p>
                  <div className='space-y-1'>
                    <h5 className='text-2xl font-black tracking-tight text-gray-900'>
                      Princess Truth
                    </h5>
                    <p className='text-xs font-bold tracking-[0.2em] text-blue-600 uppercase'>
                      Moontech Life Member
                    </p>
                  </div>
                </div>
                <div className='mt-8 flex w-full justify-center gap-4 border-t border-gray-100 pt-8'>
                  <div className='flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-[10px] font-black tracking-widest text-blue-600 uppercase'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-users h-3 w-3'
                      aria-hidden='true'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                      <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                      <circle cx='9' cy='7' r='4'></circle>
                    </svg>
                    COMMUNITY VERIFIED
                  </div>
                </div>
              </div>
              <div className='group relative flex flex-col items-center overflow-hidden rounded-[3rem] border border-gray-100 bg-gray-50 p-10 text-center transition-all duration-500 hover:bg-white hover:shadow-2xl'>
                <div className='pointer-events-none absolute top-8 right-10 text-blue-500/5 transition-colors group-hover:text-blue-500/10'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-star h-20 w-20 fill-current'
                    aria-hidden='true'
                  >
                    <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                  </svg>
                </div>
                <div className='relative mb-8'>
                  <div className='absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-yellow-500 opacity-20 blur-xl transition-opacity group-hover:opacity-40'></div>
                  <div className='relative h-32 w-32 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-yellow-500 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-110'>
                    <div className='h-full w-full overflow-hidden rounded-full bg-white p-1'>
                      <img
                        alt='Haleema'
                        loading='lazy'
                        width='128'
                        height='128'
                        decoding='async'
                        data-nimg='1'
                        className='h-full w-full rounded-full object-cover'
                        style={{ color: 'transparent' }}
                        srcSet='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%204.png&amp;w=128&amp;q=75 1x, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%204.png&amp;w=256&amp;q=75 2x'
                        src='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%204.png&amp;w=256&amp;q=75'
                      />
                    </div>
                  </div>
                  <div className='absolute -right-2 -bottom-2 rounded-full border border-blue-100 bg-white p-1.5 shadow-lg'>
                    <div className='rounded-full bg-blue-600 p-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-4 w-4 text-white'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='relative z-10 w-full'>
                  <div className='mb-6 flex justify-center text-yellow-400'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                  </div>
                  <p className='mb-8 text-lg leading-relaxed font-medium text-gray-600 italic'>
                    &quot;My journey into tech has been a transformation.
                    MoonTechLife gave me the structure and discipline I needed.
                    Now, I design user-focused solutions and I&#x27;m building
                    my own brand.&quot;
                  </p>
                  <div className='space-y-1'>
                    <h5 className='text-2xl font-black tracking-tight text-gray-900'>
                      Haleema
                    </h5>
                    <p className='text-xs font-bold tracking-[0.2em] text-blue-600 uppercase'>
                      Moontech Life Member
                    </p>
                  </div>
                </div>
                <div className='mt-8 flex w-full justify-center gap-4 border-t border-gray-100 pt-8'>
                  <div className='flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-[10px] font-black tracking-widest text-blue-600 uppercase'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-users h-3 w-3'
                      aria-hidden='true'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                      <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                      <circle cx='9' cy='7' r='4'></circle>
                    </svg>
                    COMMUNITY VERIFIED
                  </div>
                </div>
              </div>
              <div className='group relative flex flex-col items-center overflow-hidden rounded-[3rem] border border-gray-100 bg-gray-50 p-10 text-center transition-all duration-500 hover:bg-white hover:shadow-2xl'>
                <div className='pointer-events-none absolute top-8 right-10 text-blue-500/5 transition-colors group-hover:text-blue-500/10'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-star h-20 w-20 fill-current'
                    aria-hidden='true'
                  >
                    <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                  </svg>
                </div>
                <div className='relative mb-8'>
                  <div className='absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-yellow-500 opacity-20 blur-xl transition-opacity group-hover:opacity-40'></div>
                  <div className='relative h-32 w-32 overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-yellow-500 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-110'>
                    <div className='h-full w-full overflow-hidden rounded-full bg-white p-1'>
                      <img
                        alt='Mirian Oluomachi'
                        loading='lazy'
                        width='128'
                        height='128'
                        decoding='async'
                        data-nimg='1'
                        className='h-full w-full rounded-full object-cover'
                        style={{ color: 'transparent' }}
                        srcSet='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%205.png&amp;w=128&amp;q=75 1x, /_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%205.png&amp;w=256&amp;q=75 2x'
                        src='/_next/image?url=%2Fimages%2Fbootcamp%2Fimage%20copy%205.png&amp;w=256&amp;q=75'
                      />
                    </div>
                  </div>
                  <div className='absolute -right-2 -bottom-2 rounded-full border border-blue-100 bg-white p-1.5 shadow-lg'>
                    <div className='rounded-full bg-blue-600 p-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-4 w-4 text-white'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='relative z-10 w-full'>
                  <div className='mb-6 flex justify-center text-yellow-400'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-star h-4 w-4 fill-current'
                      aria-hidden='true'
                    >
                      <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'></path>
                    </svg>
                  </div>
                  <p className='mb-8 text-lg leading-relaxed font-medium text-gray-600 italic'>
                    &quot;Joining showed me that tech isn’t as difficult as I
                    thought. I discovered how powerful AI automation can be and
                    have built skills that open me up to real opportunities
                    online.&quot;
                  </p>
                  <div className='space-y-1'>
                    <h5 className='text-2xl font-black tracking-tight text-gray-900'>
                      Mirian Oluomachi
                    </h5>
                    <p className='text-xs font-bold tracking-[0.2em] text-blue-600 uppercase'>
                      Moontech Life Member
                    </p>
                  </div>
                </div>
                <div className='mt-8 flex w-full justify-center gap-4 border-t border-gray-100 pt-8'>
                  <div className='flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-[10px] font-black tracking-widest text-blue-600 uppercase'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-users h-3 w-3'
                      aria-hidden='true'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                      <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                      <circle cx='9' cy='7' r='4'></circle>
                    </svg>
                    COMMUNITY VERIFIED
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-20 flex flex-col items-start justify-center gap-12 md:flex-row'>
              <div className='group w-full max-w-md'>
                <div className='relative overflow-hidden rounded-[2.5rem] bg-black shadow-2xl ring-8 ring-blue-500/5 transition-all duration-500 group-hover:-translate-y-2 group-hover:ring-blue-500/20'>
                  <video
                    className='aspect-[9/16] h-[500px] w-full object-cover focus:outline-none'
                    controls
                    preload='metadata'
                  >
                    <source
                      src='/videos/WhatsApp Video 2026-04-01 at 18.19.52.mp4'
                      type='video/mp4'
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div className='absolute top-6 left-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md'>
                    <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-500'></div>
                    Community Proof 01
                  </div>
                </div>
                <div className='mt-8 flex items-center gap-4 px-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 font-bold text-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-users h-6 w-6'
                      aria-hidden='true'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                      <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                      <circle cx='9' cy='7' r='4'></circle>
                    </svg>
                  </div>
                  <div>
                    <h5 className='font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                      Moontech Life Community Member
                    </h5>
                    <p className='text-sm text-gray-500'>
                      Verified Testimonial
                    </p>
                  </div>
                </div>
              </div>
              <div className='group w-full max-w-xl md:mt-24'>
                <div className='relative overflow-hidden rounded-[2.5rem] bg-black shadow-2xl ring-8 ring-blue-500/5 transition-all duration-500 group-hover:-translate-y-2 group-hover:ring-blue-500/20'>
                  <video
                    className='aspect-[9/16] h-[500px] w-full object-cover focus:outline-none'
                    controls
                    preload='metadata'
                  >
                    <source
                      src='/videos/WhatsApp Video 2026-04-02 at 22.47.26.mp4'
                      type='video/mp4'
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div className='absolute top-6 left-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md'>
                    <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500'></div>
                    Community Proof 02
                  </div>
                </div>
                <div className='mt-8 flex items-center gap-4 px-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 font-bold text-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-users h-6 w-6'
                      aria-hidden='true'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                      <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                      <circle cx='9' cy='7' r='4'></circle>
                    </svg>
                  </div>
                  <div>
                    <h5 className='font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                      Moontech Life Community Member
                    </h5>
                    <p className='text-sm text-gray-500'>
                      Verified Testimonial
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='overflow-hidden bg-gray-50 py-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-16 text-center'>
              <h2 className='mb-6 text-3xl font-bold text-gray-900 md:text-5xl'>
                Some websites our community members have built
              </h2>
            </div>
            <div className='flex justify-center'>
              <div className='group w-full max-w-5xl'>
                <div className='relative overflow-hidden rounded-[2.5rem] bg-black shadow-2xl ring-8 ring-blue-500/5 transition-all duration-500 group-hover:-translate-y-2 group-hover:ring-blue-500/20'>
                  <video
                    className='h-auto max-h-[80vh] w-full object-contain focus:outline-none'
                    controls
                    preload='metadata'
                  >
                    <source
                      src='/videos/WhatsApp Video 2026-04-08 at 11.40.14.mp4'
                      type='video/mp4'
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div className='absolute top-6 left-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md'>
                    <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500'></div>
                    Community Showcase
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='grid gap-20 lg:grid-cols-2'>
              <div>
                <h2 className='mb-10 text-4xl font-bold text-gray-900'>
                  Who This Is For
                </h2>
                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                    <h4 className='mb-2 font-bold text-blue-600'>Beginners</h4>
                    <p className='text-sm text-gray-500'>
                      No coding experience? We&#x27;ll show you how to start
                      with AI.
                    </p>
                  </div>
                  <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                    <h4 className='mb-2 font-bold text-blue-600'>
                      Freelancers
                    </h4>
                    <p className='text-sm text-gray-500'>
                      Scale your output and charge more for secure sites.
                    </p>
                  </div>
                  <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                    <h4 className='mb-2 font-bold text-blue-600'>Developers</h4>
                    <p className='text-sm text-gray-500'>
                      Improve your code security and AI workflow.
                    </p>
                  </div>
                  <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                    <h4 className='mb-2 font-bold text-blue-600'>Founders</h4>
                    <p className='text-sm text-gray-500'>
                      Build safer web products for your startup.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className='mb-10 text-4xl font-bold text-gray-900'>
                  What You&#x27;ll Leave With
                </h2>
                <ul className='space-y-6'>
                  <li className='flex items-center gap-4'>
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-5 w-5 text-green-600'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <span className='text-lg font-medium text-gray-800'>
                      At least one completed, secure website project
                    </span>
                  </li>
                  <li className='flex items-center gap-4'>
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-5 w-5 text-green-600'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <span className='text-lg font-medium text-gray-800'>
                      Professional AI-assisted coding mastery
                    </span>
                  </li>
                  <li className='flex items-center gap-4'>
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-5 w-5 text-green-600'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <span className='text-lg font-medium text-gray-800'>
                      Hands-on deployment &amp; CI/CD experience
                    </span>
                  </li>
                  <li className='flex items-center gap-4'>
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-5 w-5 text-green-600'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <span className='text-lg font-medium text-gray-800'>
                      Verified Certificate of Completion
                    </span>
                  </li>
                  <li className='flex items-center gap-4'>
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-circle-check h-5 w-5 text-green-600'
                        aria-hidden='true'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='m9 12 2 2 4-4'></path>
                      </svg>
                    </div>
                    <span className='text-lg font-medium text-gray-800'>
                      Premium portfolio-ready case study
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className='overflow-hidden bg-white py-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-20 text-center'>
              <h2 className='mb-6 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl'>
                Student Live Works
              </h2>
              <p className='text-xl font-medium text-gray-600'>
                Projects built by community members during our programs.
              </p>
            </div>
            <div className='grid gap-12 lg:grid-cols-3'>
              <div className='group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'>
                <div className='relative p-10 pb-0'>
                  <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-500 group-hover:bg-blue-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-terminal h-8 w-8 text-blue-600 transition-colors duration-500 group-hover:text-white'
                      aria-hidden='true'
                    >
                      <path d='M12 19h8'></path>
                      <path d='m4 17 6-6-6-6'></path>
                    </svg>
                  </div>
                </div>
                <div className='relative z-20 flex flex-1 flex-col p-10 pt-8'>
                  <div className='mb-6'>
                    <span className='rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase'>
                      Web Development
                    </span>
                  </div>
                  <h3 className='mb-4 text-2xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                    Modern Mobile Profile UI
                  </h3>
                  <p className='mb-8 flex-1 text-base leading-relaxed text-gray-600'>
                    Recreated a modern mobile profile UI focusing on layout
                    accuracy, typography, and frontend excellence.
                  </p>
                  <div className='flex items-center justify-between border-t border-gray-100 pt-8'>
                    <div className='flex flex-col'>
                      <span className='mb-1 text-xs font-medium text-gray-400'>
                        Student
                      </span>
                      <span className='font-bold text-gray-900'>
                        Luqman Adeniyi
                      </span>
                    </div>
                    <a
                      href='https://www.linkedin.com/posts/luqman-adeniyi-069591229_uidesign-frontenddevelopment-html-ugcPost-7443729975628832769-Dx_Y'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 font-bold text-blue-600 transition-all duration-300 hover:gap-4'
                    >
                      View Project
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-external-link h-4 w-4'
                        aria-hidden='true'
                      >
                        <path d='M15 3h6v6'></path>
                        <path d='M10 14 21 3'></path>
                        <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className='group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'>
                <div className='relative p-10 pb-0'>
                  <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-500 group-hover:bg-blue-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-cpu h-8 w-8 text-blue-600 transition-colors duration-500 group-hover:text-white'
                      aria-hidden='true'
                    >
                      <path d='M12 20v2'></path>
                      <path d='M12 2v2'></path>
                      <path d='M17 20v2'></path>
                      <path d='M17 2v2'></path>
                      <path d='M2 12h2'></path>
                      <path d='M2 17h2'></path>
                      <path d='M2 7h2'></path>
                      <path d='M20 12h2'></path>
                      <path d='M20 17h2'></path>
                      <path d='M20 7h2'></path>
                      <path d='M7 20v2'></path>
                      <path d='M7 2v2'></path>
                      <rect x='4' y='4' width='16' height='16' rx='2'></rect>
                      <rect x='8' y='8' width='8' height='8' rx='1'></rect>
                    </svg>
                  </div>
                </div>
                <div className='relative z-20 flex flex-1 flex-col p-10 pt-8'>
                  <div className='mb-6'>
                    <span className='rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase'>
                      AI Automation
                    </span>
                  </div>
                  <h3 className='mb-4 text-2xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                    Job Application System
                  </h3>
                  <p className='mb-8 flex-1 text-base leading-relaxed text-gray-600'>
                    Built an AI-powered system using Tally and Zapier that
                    summarizes responses and automates hiring flows.
                  </p>
                  <div className='flex items-center justify-between border-t border-gray-100 pt-8'>
                    <div className='flex flex-col'>
                      <span className='mb-1 text-xs font-medium text-gray-400'>
                        Student
                      </span>
                      <span className='font-bold text-gray-900'>John Agbo</span>
                    </div>
                    <a
                      href='https://www.linkedin.com/posts/john-agbo-332988285_100daystechchallenge-moontechlifecommunity-ugcPost-7442571731204009984-dSOi'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 font-bold text-blue-600 transition-all duration-300 hover:gap-4'
                    >
                      View Project
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-external-link h-4 w-4'
                        aria-hidden='true'
                      >
                        <path d='M15 3h6v6'></path>
                        <path d='M10 14 21 3'></path>
                        <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className='group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'>
                <div className='relative p-10 pb-0'>
                  <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-500 group-hover:bg-blue-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-monitor h-8 w-8 text-blue-600 transition-colors duration-500 group-hover:text-white'
                      aria-hidden='true'
                    >
                      <rect width='20' height='14' x='2' y='3' rx='2'></rect>
                      <line x1='8' x2='16' y1='21' y2='21'></line>
                      <line x1='12' x2='12' y1='17' y2='21'></line>
                    </svg>
                  </div>
                </div>
                <div className='relative z-20 flex flex-1 flex-col p-10 pt-8'>
                  <div className='mb-6'>
                    <span className='rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase'>
                      UI/UX Design
                    </span>
                  </div>
                  <h3 className='mb-4 text-2xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                    Activewear Landing Page
                  </h3>
                  <p className='mb-8 flex-1 text-base leading-relaxed text-gray-600'>
                    Created a high-converting landing page combining modern
                    aesthetics with conversion-focused UX principles.
                  </p>
                  <div className='flex items-center justify-between border-t border-gray-100 pt-8'>
                    <div className='flex flex-col'>
                      <span className='mb-1 text-xs font-medium text-gray-400'>
                        Student
                      </span>
                      <span className='font-bold text-gray-900'>
                        James Agbo
                      </span>
                    </div>
                    <a
                      href='https://www.linkedin.com/posts/james-agbo-6626ab247_uiux-productdesign-moontechlifecommunity-share-7442311274975371264-n3Hl'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 font-bold text-blue-600 transition-all duration-300 hover:gap-4'
                    >
                      View Project
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='lucide lucide-external-link h-4 w-4'
                        aria-hidden='true'
                      >
                        <path d='M15 3h6v6'></path>
                        <path d='M10 14 21 3'></path>
                        <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='relative mx-4 mb-24 overflow-hidden rounded-[4rem] bg-blue-600 py-24 text-white sm:mx-8'>
          <div className='absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl'></div>
          <div className='mx-auto max-w-5xl px-4 text-center'>
            <h2 className='mb-12 text-4xl font-bold md:text-5xl'>
              Bootcamp Bonuses &amp; Perks
            </h2>
            <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-users'
                    aria-hidden='true'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
                    <path d='M16 3.128a4 4 0 0 1 0 7.744'></path>
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
                    <circle cx='9' cy='7' r='4'></circle>
                  </svg>
                </div>
                <p className='text-sm font-bold'>Private Community Access</p>
              </div>
              <div className='rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-terminal'
                    aria-hidden='true'
                  >
                    <path d='M12 19h8'></path>
                    <path d='m4 17 6-6-6-6'></path>
                  </svg>
                </div>
                <p className='text-sm font-bold'>
                  Career &amp; Client Strategy
                </p>
              </div>
              <div className='rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-milestone'
                    aria-hidden='true'
                  >
                    <path d='M12 13v8'></path>
                    <path d='M12 3v3'></path>
                    <path d='M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z'></path>
                  </svg>
                </div>
                <p className='text-sm font-bold'>Official Certification</p>
              </div>
              <div className='rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-circle-dollar-sign'
                    aria-hidden='true'
                  >
                    <circle cx='12' cy='12' r='10'></circle>
                    <path d='M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8'></path>
                    <path d='M12 18V6'></path>
                  </svg>
                </div>
                <p className='text-sm font-bold'>Best Student Prize</p>
              </div>
            </div>
          </div>
        </section>
        <section className='bg-white py-24'>
          <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-16 text-center'>
              <h2 className='mb-6 text-3xl font-bold text-gray-900 md:text-5xl'>
                Frequently Asked Questions
              </h2>
            </div>
            <div className='space-y-4'>
              <div className='border-b border-gray-200 py-4'>
                <button className='flex w-full items-center justify-between text-left transition-colors hover:text-blue-600'>
                  <span className='text-lg font-semibold text-gray-900'>
                    Do I need prior coding experience?
                  </span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-chevron-down h-5 w-5 transform text-gray-400 transition-transform'
                    aria-hidden='true'
                  >
                    <path d='m6 9 6 6 6-6'></path>
                  </svg>
                </button>
                <div className='mt-2 max-h-0 overflow-hidden text-gray-600 opacity-0 transition-all duration-300'>
                  <p className='pb-4'>
                    No, absolute beginners are welcome. While some tech
                    familiarity helps, our AI-assisted workflow is designed to
                    bridge the gap and help you build while you learn the
                    fundamentals.
                  </p>
                </div>
              </div>
              <div className='border-b border-gray-200 py-4'>
                <button className='flex w-full items-center justify-between text-left transition-colors hover:text-blue-600'>
                  <span className='text-lg font-semibold text-gray-900'>
                    Will sessions be live or recorded?
                  </span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-chevron-down h-5 w-5 transform text-gray-400 transition-transform'
                    aria-hidden='true'
                  >
                    <path d='m6 9 6 6 6-6'></path>
                  </svg>
                </button>
                <div className='mt-2 max-h-0 overflow-hidden text-gray-600 opacity-0 transition-all duration-300'>
                  <p className='pb-4'>
                    Sessions will be held live twice a week to allow for Q&amp;A
                    and real-time support. All sessions will be recorded and
                    shared for later reference if you miss one.
                  </p>
                </div>
              </div>
              <div className='border-b border-gray-200 py-4'>
                <button className='flex w-full items-center justify-between text-left transition-colors hover:text-blue-600'>
                  <span className='text-lg font-semibold text-gray-900'>
                    What tools will we use?
                  </span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-chevron-down h-5 w-5 transform text-gray-400 transition-transform'
                    aria-hidden='true'
                  >
                    <path d='m6 9 6 6 6-6'></path>
                  </svg>
                </button>
                <div className='mt-2 max-h-0 overflow-hidden text-gray-600 opacity-0 transition-all duration-300'>
                  <p className='pb-4'>
                    We’ll use a variety of modern AI coding assistants, security
                    scanning tools, and deployment platforms. You&#x27;ll get a
                    full list and setup guide in Week 1.
                  </p>
                </div>
              </div>
              <div className='border-b border-gray-200 py-4'>
                <button className='flex w-full items-center justify-between text-left transition-colors hover:text-blue-600'>
                  <span className='text-lg font-semibold text-gray-900'>
                    Will I get support during the program?
                  </span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-chevron-down h-5 w-5 transform text-gray-400 transition-transform'
                    aria-hidden='true'
                  >
                    <path d='m6 9 6 6 6-6'></path>
                  </svg>
                </button>
                <div className='mt-2 max-h-0 overflow-hidden text-gray-600 opacity-0 transition-all duration-300'>
                  <p className='pb-4'>
                    Absolutely. We have dedicated mentors and a private
                    Slack/Discord community where you can get support 24/7 from
                    facilitators and peers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='relative overflow-hidden py-24'>
          <div className='absolute inset-0 -z-10 origin-left skew-y-2 bg-blue-50'></div>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='relative overflow-hidden rounded-[3.5rem] border border-gray-100 bg-white text-center shadow-2xl'>
              <div className='bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-sm font-bold tracking-[0.2em] text-white uppercase'>
                Early Bird Offer - Only 10 Spots Available
              </div>
              <div className='p-12 md:p-24'>
                <h2 className='mb-8 text-4xl font-bold text-gray-900 md:text-6xl'>
                  Ready to Master Secure AI Building?
                </h2>
                <div className='mb-12 flex flex-col items-center justify-center gap-8 md:flex-row'>
                  <div className='rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-gray-50 p-8'>
                    <p className='mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase'>
                      Early Bird Price
                    </p>
                    <p className='text-5xl font-black text-blue-600'>₦25,000</p>
                    <p className='mt-2 text-sm text-gray-400'>
                      First 10 Students Only
                    </p>
                  </div>
                  <div className='rounded-[2.5rem] border border-gray-100 bg-gray-50/50 p-8 opacity-60'>
                    <p className='mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase'>
                      Regular Price
                    </p>
                    <p className='text-5xl font-black text-gray-400'>₦50,000</p>
                    <p className='mt-2 text-sm text-gray-400'>
                      Standard Enrollment
                    </p>
                  </div>
                </div>
                <div className='mx-auto max-w-md'>
                  <Link
                    className='group relative inline-flex w-full transform items-center justify-center rounded-full bg-blue-600 px-12 py-6 text-xl font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)]'
                    to='/checkout'
                  >
                    Secure Your Spot Now
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-arrow-right ml-3 h-6 w-6 transition-transform group-hover:translate-x-2'
                      aria-hidden='true'
                    >
                      <path d='M5 12h14'></path>
                      <path d='m12 5 7 7-7 7'></path>
                    </svg>
                  </Link>
                  <div className='mt-5 flex flex-col items-center gap-2 text-center'>
                    <div className='flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-400'>
                      <div className='flex items-center gap-1.5'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='lucide lucide-lock h-3.5 w-3.5 flex-shrink-0 text-gray-500'
                          aria-hidden='true'
                        >
                          <rect
                            width='18'
                            height='11'
                            x='3'
                            y='11'
                            rx='2'
                            ry='2'
                          ></rect>
                          <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                        </svg>
                        <span>
                          Secure payment via{' '}
                          <span className='font-bold text-gray-200'>
                            Flutterwave
                          </span>
                        </span>
                      </div>
                      <span className='text-gray-600'>·</span>
                      <span>SSL encrypted</span>
                      <span className='text-gray-600'>·</span>
                      <span>No hidden fees</span>
                    </div>
                  </div>
                  <div className='mt-8 flex flex-col items-center gap-4 rounded-3xl border border-[#25D366]/20 bg-[#25D366]/10 p-6'>
                    <div className='text-center'>
                      <p className='mb-1 text-lg font-bold text-zinc-900'>
                        Still deciding or have questions?
                      </p>
                      <p className='text-sm text-gray-400'>
                        Join our WhatsApp chat group to hear more info from the
                        team before making payment.
                      </p>
                    </div>
                    <a
                      className='group relative inline-flex w-full transform items-center justify-center rounded-xl bg-[#25D366] px-8 py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(37,211,102,0.3)]'
                      href='https://chat.whatsapp.com/CThjVXHpwfu5IHPFSCDuLI?mode=gi_t'
                    >
                      Join WhatsApp Group
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className='bg-gray-900 py-16 text-white'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='grid gap-8 md:grid-cols-4'>
              <div className='md:col-span-2'>
                <div className='mb-4 flex items-center space-x-3'>
                  <img
                    src='/moonLogoVariation1.png'
                    alt='MoonTech Life'
                    className='h-8 w-8'
                  />
                  <span className='text-xl font-bold'>MoonTech Life</span>
                </div>
                <p className='mb-4 max-w-md text-gray-400'>
                  Empowering the next generation of tech professionals through
                  free, comprehensive training and community support.
                </p>
                <p className='mb-6 text-sm text-gray-400'>
                  <span className='font-medium text-gray-300'>Email: </span>
                  <a
                    href='mailto:Team@moontechlife.com'
                    className='transition-colors hover:text-white'
                  >
                    Team@moontechlife.com
                  </a>
                </p>
                <div className='flex space-x-4'>
                  <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-blue-600'>
                    <a
                      className='text-xs font-bold'
                      target='_blank'
                      href='https://x.com/mtl_community'
                    >
                      𝕏
                    </a>
                  </div>
                  <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-blue-600'>
                    <a
                      target='_blank'
                      className='text-xs font-bold'
                      href='https://www.linkedin.com/company/moontechlife-communiy/'
                    >
                      in
                    </a>
                  </div>
                  <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-blue-600'>
                    <a
                      target='_blank'
                      className='text-xs font-bold'
                      href='https://web.facebook.com/MLTCommunity'
                    >
                      fb
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h4 className='mb-4 text-lg font-semibold'>Programs</h4>
                <ul className='space-y-2'>
                  <li>
                    <a
                      className='text-gray-400 transition-colors hover:text-white'
                      href='/100-days-tech-challenge'
                    >
                      100 Days Tech Challenge
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-gray-400 transition-colors hover:text-white'
                      href='/virtual-gaming-challenge'
                    >
                      Virtual Gaming Challenge
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-gray-400 transition-colors hover:text-white'
                      href='/community-competition'
                    >
                      Community Competition
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className='mb-4 text-lg font-semibold'>Community</h4>
                <ul className='space-y-2'>
                  <li>
                    <a
                      className='text-gray-400 transition-colors hover:text-white'
                      href='/#about'
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-gray-400 transition-colors hover:text-white'
                      href='/#mission'
                    >
                      Mission
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-gray-400 transition-colors hover:text-white'
                      href='/#reviews'
                    >
                      Reviews
                    </a>
                  </li>
                  <li>
                    <a
                      href='mailto:Team@moontechlife.com'
                      className='text-gray-400 transition-colors hover:text-white'
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='mt-12 border-t border-gray-800 pt-8'>
              <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
                <p className='text-center text-sm text-gray-400 sm:text-left'>
                  © 2025 MoonTech Life Community. All rights reserved. Building
                  futures, one student at a time.
                </p>
                <div className='flex items-center gap-6 text-sm'>
                  <a
                    className='text-gray-400 transition-colors hover:text-white'
                    href='/privacy-policy'
                  >
                    Privacy Policy
                  </a>
                  <a
                    className='text-gray-400 transition-colors hover:text-white'
                    href='/terms-and-conditions'
                  >
                    Terms &amp; Conditions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
