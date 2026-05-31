import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/ai-website-bootcamp')({
  component: BootcampLandingPage,
})

function CountdownTimer({ isDarkBg = false }: { isDarkBg?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 4,
    minutes: 32,
    seconds: 52,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev
        if (seconds > 0) seconds--
        else {
          seconds = 59
          if (minutes > 0) minutes--
          else {
            minutes = 59
            if (hours > 0) hours--
            else {
              hours = 23
              if (days > 0) days--
            }
          }
        }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='flex justify-center gap-3'>
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className='text-center'>
          <div className={`min-w-[68px] rounded-xl border p-3 backdrop-blur-sm ${
            isDarkBg 
              ? 'border-white/10 bg-white/5' 
              : 'border-[#0A0F1E]/20 bg-[#0A0F1E]'
          }`}>
            <span className='block text-2xl font-black text-white'>
              {item.value.toString().padStart(2, '0')}
            </span>
            <span className='text-[10px] font-bold tracking-wider text-yellow-400 uppercase'>
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function BootcampLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Do I need prior coding experience?',
      a: 'No, absolute beginners are welcome. While some tech familiarity helps, our AI-assisted workflow is designed to bridge the gap and help you build while you learn the fundamentals.',
    },
    {
      q: 'Will sessions be live or recorded?',
      a: 'Sessions will be held live twice a week to allow for Q&A and real-time support. All sessions will be recorded and shared for later reference if you miss one.',
    },
    {
      q: 'What tools will we use?',
      a: "We’ll use a variety of modern AI coding assistants, security scanning tools, and deployment platforms. You'll get a full list and setup guide in Week 1.",
    },
    {
      q: 'Will I get support during the program?',
      a: 'Absolutely. We have dedicated mentors and a private Slack/Discord community where you can get support 24/7 from facilitators and peers.',
    },
  ]

  return (
    <div className='min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900'>
      {/* Navbar */}
      <nav className='sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <a href='https://www.moontechlife.com/'>
              <div className='flex items-center space-x-3'>
                <img src='/moon-logo.png' alt='MoonTech Life' className='h-10 w-10' />
                <span className='text-xl font-bold text-gray-900'>MoonTech Life</span>
              </div>
            </a>
            <div className='hidden items-center space-x-8 md:flex'>
              <a className='font-medium text-gray-700 transition-colors hover:text-blue-600' href='/explore-programs'>
                Explore Programs
              </a>
              <a className='transform rounded-full bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-2 font-medium text-white transition-all hover:scale-105 hover:shadow-lg' href='https://www.moontechlife.com/100-days-tech-challenge'>
                100 Days Tech Challenge
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative flex min-h-[90vh] items-center overflow-hidden bg-[#E2E4E6] py-20'>
        <div className='relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8'>


          <h1 className='mb-6 text-4xl leading-[1.1] font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl'>
            How To Build Websites With AI, Secure Them, And Charge Clients Between <span className='text-blue-700'>₦100,000</span> and <span className='text-blue-700'>₦500,000</span> Per Project.
          </h1>
          
          <p className='mx-auto mb-10 max-w-3xl text-xl font-semibold leading-relaxed text-gray-700 md:text-2xl'>
            Even If You Have Never Written A Single Line Of Code And Have No Idea Where To Start.
          </p>

          <div className='mx-auto max-w-xl rounded-3xl bg-[#0A0F1E] p-8 shadow-2xl'>
             <div className='mb-6 flex flex-col items-center justify-center gap-4 border-b border-white/10 pb-6 sm:flex-row'>
                <div className='text-center'>
                    <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Early Bird</p>
                    <p className='text-4xl font-black text-white'>₦25,000</p>
                </div>
                <div className='hidden sm:block h-12 w-px bg-white/10'></div>
                <div className='text-center opacity-50'>
                    <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Regular</p>
                    <p className='text-3xl font-black text-gray-500 line-through'>₦50,000</p>
                </div>
             </div>

            <div className='mb-8'>
              <p className='mb-4 text-center text-xs font-bold tracking-widest text-yellow-400 uppercase'>
                Early bird discount expires in:
              </p>
              <CountdownTimer isDarkBg={true} />
            </div>

            <Link
              className='group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-5 text-xl font-black text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]'
              to='/checkout'
            >
              <span className='relative z-10'>Secure Your Spot Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem & Agitation Section */}
      <section className='py-24 bg-white'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center sm:text-left'>
            <div className='prose prose-lg md:prose-xl mx-auto text-gray-800'>
                <p className='mb-8 leading-relaxed font-medium'>
                    <span className='font-bold text-black'>Most people who learn web development in Nigeria take a long time before they make their first naira from it.</span> Because it requires learning and relearning to get good enough to build projects that can actually attract clients.
                </p>
                <p className='mb-8 text-3xl font-black text-blue-600'>AI changed that.</p>
                <p className='mb-8 leading-relaxed font-medium'>
                    Now you can build a professional website in hours with the right prompts. You do not even need to write a single line of code.
                </p>
                <p className='mb-8 leading-relaxed font-medium'>
                    <span className='bg-yellow-200 px-2 py-1 font-bold text-black'>But here is what most people are missing.</span> Because AI makes building easy, anyone can do it now. Which means websites are being built faster than they are being secured. And a website that can be easily hacked is a liability to your client and to your reputation.
                </p>
                <p className='text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-6 py-2'>
                    That is why this program teaches you both. Build it fast with AI. Secure it like a professional. Then charge what you are actually worth.
                </p>
            </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className='py-24 bg-gray-50 border-t border-gray-100'>
        <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
            <h2 className='mb-16 text-center text-3xl md:text-5xl font-black tracking-tight text-gray-900 uppercase'>
                Why This Is Not Like <span className='text-yellow-500'>Every Other Program</span> You Have Seen
            </h2>
            
            <div className='grid gap-8 lg:grid-cols-3'>
                <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
                    <div className='w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl font-black'>1</div>
                    <p className='text-lg font-bold text-gray-900'>Build in Hours, Not Months</p>
                    <p className='mt-4 text-gray-600'>How to build a professional website using AI in hours, not weeks or months. Forget outdated tutorials that leave you stranded.</p>
                </div>
                <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
                    <div className='w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl font-black'>2</div>
                    <p className='text-lg font-bold text-gray-900'>Unbreakable Security</p>
                    <p className='mt-4 text-gray-600'>How to secure that website so it cannot be hacked. This is the only program in Nigeria that teaches you how to build with AI and secure them in the same training.</p>
                </div>
                <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
                    <div className='w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl font-black'>3</div>
                    <p className='text-lg font-bold text-gray-900'>Get Paid Like a Pro</p>
                    <p className='mt-4 text-gray-600'>How to find your first client, pitch them and get paid. Local clients. International clients. We show you exactly where to find them and what to say.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Community Showcase Section */}
      <section className='py-24 bg-[#0A0F1E] text-white'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
            <h2 className='mb-16 text-center text-3xl md:text-5xl font-black tracking-tight text-yellow-400 uppercase'>
                Some Websites Our Community Members Have Built
            </h2>
            <div className='aspect-video w-full rounded-3xl bg-black border border-white/10 overflow-hidden relative shadow-2xl'>
              <video 
                src='/Video/IMG_0364.mp4' 
                controls 
                preload='metadata'
                className='w-full h-full object-contain'
              />
            </div>
        </div>
      </section>

      {/* Community Background Section */}
      <section className='py-24 bg-white'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center'>
            <h2 className='mb-8 text-3xl md:text-5xl font-black tracking-tight text-gray-900 uppercase'>
                The Community <span className='text-yellow-500'>Behind The Magic</span>
            </h2>
            <p className='text-lg text-gray-600 leading-relaxed mb-6'>
                MoonTech Life is a tech community focused on helping beginners move from zero to income-ready tech skills through structured learning and hands-on building.
            </p>
            <p className='text-lg text-gray-600 leading-relaxed mb-6'>
                We recently hosted the 100 Days Tech Challenge, which brought together over 2,000 participants learning and building in public.
            </p>
            <p className='text-xl font-bold text-gray-900 leading-relaxed'>
                This bootcamp comes from that ecosystem and is designed to help people not just learn tech, but build real websites, secure them properly, and start getting paid for real work.
            </p>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className='py-24 bg-gray-50 border-y border-gray-100'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
             <h2 className='mb-16 text-center text-3xl md:text-5xl font-black tracking-tight text-gray-900 uppercase'>
                Here Is Exactly <span className='text-yellow-500'>What You Will Learn</span>
            </h2>
            
            <div className='grid gap-8 md:grid-cols-2'>
                <div className='bg-white p-8 rounded-3xl border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-black text-gray-200'>01</span>
                    <h3 className='text-xl font-black text-gray-900 mt-2 mb-4'>Week 1: AI Coding Workflow & Setup</h3>
                    <p className='text-gray-600 leading-relaxed'>Dive deep into the essentials of AI-driven development. You'll learn to set up your environment and adopt professional workflows, enabling you to build efficiently from day one.</p>
                </div>
                <div className='bg-white p-8 rounded-3xl border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-black text-gray-200'>02</span>
                    <h3 className='text-xl font-black text-gray-900 mt-2 mb-4'>Week 2: Feature Building & Pair Programming</h3>
                    <p className='text-gray-600 leading-relaxed'>Engage in hands-on, practical sessions where you'll construct real websites. We utilize an innovative pair programming approach with AI, ensuring you gain tangible experience without theoretical delays.</p>
                </div>
                <div className='bg-white p-8 rounded-3xl border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-black text-gray-200'>03</span>
                    <h3 className='text-xl font-black text-gray-900 mt-2 mb-4'>Week 3: Securing AI Code</h3>
                    <p className='text-gray-600 leading-relaxed'>This critical week focuses on cybersecurity. You will learn to identify vulnerabilities and implement robust protection mechanisms for every website you create. This specialized knowledge is your key to becoming a premium service provider.</p>
                </div>
                <div className='bg-white p-8 rounded-3xl border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-black text-gray-200'>04</span>
                    <h3 className='text-xl font-black text-gray-900 mt-2 mb-4'>Week 4: Deployment, Monetization & Client Acquisition</h3>
                    <p className='text-gray-600 leading-relaxed'>Launch your projects, build an impressive portfolio, and master the art of securing your first paying client. We cover everything from deployment best practices to effective monetization strategies.</p>
                </div>
            </div>
        </div>
      </section>

      {/* What You Get Section (NEW) */}
      <section className='py-24 bg-blue-600 text-white'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
             <h2 className='mb-12 text-center text-3xl md:text-5xl font-black tracking-tight uppercase'>
                When You Join <span className='text-yellow-300'>You Get</span>
            </h2>
            
            <div className='bg-white/10 p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] backdrop-blur-sm border border-white/20'>
                <ul className='space-y-6 text-lg font-medium'>
                    <li className='flex items-start gap-4'>
                        <span className='text-2xl'>✅</span>
                        <span>4 weeks of live virtual training with hands on practical sessions.</span>
                    </li>
                    <li className='flex items-start gap-4'>
                        <span className='text-2xl'>✅</span>
                        <span>Access to all session recordings so you never miss anything even if you cannot attend live.</span>
                    </li>
                    <li className='flex items-start gap-4'>
                        <span className='text-2xl'>✅</span>
                        <span>Certificate of completion to add to your portfolio and LinkedIn.</span>
                    </li>
                    <li className='flex items-start gap-4'>
                        <span className='text-2xl'>✅</span>
                        <span>Access to our private MoonTech community where you can connect network and get support.</span>
                    </li>
                    <li className='flex items-start gap-4'>
                        <span className='text-2xl'>✅</span>
                        <span>Real projects you build during the program that you can show to clients immediately.</span>
                    </li>
                    <li className='flex items-start gap-4'>
                        <span className='text-2xl'>✅</span>
                        <span>A clear roadmap to finding and landing your first paying client after the program.</span>
                    </li>
                    <li className='flex items-start gap-4'>
                        <span className='text-2xl'>✅</span>
                        <span>Bonus monetization session teaching you exactly how to turn your new skill into income.</span>
                    </li>
                </ul>
                
                <div className='mt-12 text-center'>
                    <p className='text-3xl md:text-4xl font-black text-yellow-300 uppercase'>
                        All of this for ₦25,000.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className='py-24 bg-white'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h2 className='mb-6 text-3xl md:text-5xl font-black tracking-tight text-gray-900 uppercase'>
                    Meet Your <span className='text-yellow-500'>Expert Instructors</span>
                </h2>
                <p className='max-w-2xl mx-auto text-gray-600 text-lg'>
                    Learn from industry leaders who are actively shaping the future of tech. Our instructors bring real-world experience and a passion for teaching, ensuring you receive the highest quality education.
                </p>
            </div>
            
            <div className='grid gap-8 md:grid-cols-3'>
                {/* Instructor 1 */}
                <div className='text-center'>
                    <div className='aspect-[4/5] max-w-[240px] mx-auto bg-gray-100 rounded-3xl mb-6 overflow-hidden relative'>
                         <img src='/images/facilitator/facilitator 1.jpg' alt='Oluwasola Adebayo' className='w-full h-full object-cover' />
                    </div>
                    <h3 className='text-2xl font-black text-gray-900'>Oluwasola Adebayo</h3>
                    <p className='text-blue-600 font-bold mb-4'>Cybersecurity Professional</p>
                    <p className='text-gray-600 text-sm leading-relaxed'>
                        With 5 years of experience identifying and rectifying vulnerabilities in complex digital systems, Oluwasola will equip you with the essential skills to secure every website you build. His expertise ensures your clients' sites are impenetrable, safeguarding your reputation and their assets.
                    </p>
                </div>
                {/* Instructor 2 */}
                <div className='text-center'>
                    <div className='aspect-[4/5] max-w-[240px] mx-auto bg-gray-100 rounded-3xl mb-6 overflow-hidden relative'>
                         <img src='/images/facilitator/facilitator 2.png' alt='Casper Okpara' className='w-full h-full object-cover' />
                    </div>
                    <h3 className='text-2xl font-black text-gray-900'>Casper Okpara</h3>
                    <p className='text-blue-600 font-bold mb-4'>Tech Entrepreneur & AI Advocate</p>
                    <p className='text-gray-600 text-sm leading-relaxed'>
                        Casper specializes in building cutting-edge AI-powered business solutions and has successfully trained hundreds in web development. He will reveal his proven methods for leveraging AI to create rapid, professional websites that attract and retain high-paying clients.
                    </p>
                </div>
                {/* Instructor 3 */}
                <div className='text-center'>
                    <div className='aspect-[4/5] max-w-[240px] mx-auto bg-gray-100 rounded-3xl mb-6 overflow-hidden relative'>
                         <img src='/images/facilitator/facilitator 3.jpg' alt='Igbayilola Kazeem' className='w-full h-full object-cover' />
                    </div>
                    <h3 className='text-2xl font-black text-gray-900'>Igbayilola Kazeem</h3>
                    <p className='text-blue-600 font-bold mb-4'>Product Engineer and AI Web Design Expert</p>
                    <p className='text-gray-600 text-sm leading-relaxed'>
                        Igbayilola has built websites and digital products used by real people across multiple industries. She works at the intersection of design and technology, using AI tools to bring ideas to life faster than traditional methods allow. In this program she teaches you how to build websites that do not just work but actually look and feel professional enough to attract paying clients.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-24 bg-[#0A0F1E] text-white overflow-hidden'>
         <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h2 className='mb-6 text-3xl md:text-5xl font-black tracking-tight text-yellow-400 uppercase'>
                    What People Are Saying
                </h2>
                <p className='max-w-2xl mx-auto text-gray-300 text-xl font-medium'>
                    Real results from real students who started with zero tech experience
                </p>
            </div>
            
            {/* Horizontal Carousel (CSS scrolling) */}
            <div className='relative w-full pb-10'>
                <div className='flex overflow-x-auto gap-6 snap-x snap-mandatory pb-8 no-scrollbar' style={{ scrollbarWidth: 'none' }}>
                    {/* Testimonial screenshots */}
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <div key={num} className='min-w-[300px] md:min-w-[350px] aspect-[3/4] bg-slate-950 rounded-3xl border border-white/10 snap-center overflow-hidden shadow-xl flex items-center justify-center'>
                            <img 
                              src={`/images/testimonial/testimonial-${num}.jpeg`} 
                              alt={`Testimonial review ${num}`} 
                              className='w-full h-full object-contain'
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Testimonials */}
            <div className='grid gap-8 md:grid-cols-2 mt-10'>
                <div className='aspect-video w-full rounded-3xl bg-black border border-white/10 overflow-hidden relative shadow-2xl'>
                    <video 
                      src='/Video/first student video testimonial.mp4' 
                      controls 
                      preload='metadata'
                      className='w-full h-full object-contain'
                    />
                </div>
                <div className='aspect-video w-full rounded-3xl bg-black border border-white/10 overflow-hidden relative shadow-2xl'>
                    <video 
                      src='/Video/Second student video testimonial.mp4' 
                      controls 
                      preload='metadata'
                      className='w-full h-full object-contain'
                    />
                </div>
            </div>
         </div>
      </section>

      {/* Target Audience Section */}
      <section className='py-24 bg-gray-50'>
         <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
            <h2 className='mb-12 text-center text-3xl md:text-5xl font-black tracking-tight text-gray-900 uppercase'>
                This Is For You If Any Of <span className='text-yellow-500'>This Sounds Familiar</span>
            </h2>
            <p className='text-xl text-gray-700 font-medium mb-10 text-center'>
                You have no tech background and are just trying to figure out your next move in life or career.
            </p>
            <ul className='space-y-6 text-lg text-gray-700 font-medium'>
                <li className='flex items-start gap-4'>
                    <span className='text-2xl text-blue-600 mt-1'>•</span>
                    <span>You are going through a career transition and want a skill that actually pays.</span>
                </li>
                <li className='flex items-start gap-4'>
                    <span className='text-2xl text-blue-600 mt-1'>•</span>
                    <span>You have been thinking about going into tech but do not know where to start.</span>
                </li>
                <li className='flex items-start gap-4'>
                    <span className='text-2xl text-blue-600 mt-1'>•</span>
                    <span>You already tried learning something but could not figure out how to make money from it.</span>
                </li>
                <li className='flex items-start gap-4'>
                    <span className='text-2xl text-blue-600 mt-1'>•</span>
                    <span>You are tired of learning things that lead nowhere.</span>
                </li>
                <li className='flex items-start gap-4'>
                    <span className='text-2xl text-blue-600 mt-1'>•</span>
                    <span>You want to charge clients in naira and dollars for a skill that is actually in demand right now.</span>
                </li>
                <li className='flex items-start gap-4'>
                    <span className='text-2xl text-blue-600 mt-1'>•</span>
                    <span>You want to finish this program with a real project in your portfolio and a clear path to your first client.</span>
                </li>
            </ul>
         </div>
      </section>

      {/* FAQ Section */}
      <section className='py-24 bg-white'>
          <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-16 text-center'>
              <h2 className='mb-6 text-3xl font-black text-gray-900 md:text-5xl uppercase'>
                Frequently Asked Questions
              </h2>
            </div>
            <div className='space-y-4'>
              {faqs.map((faq, i) => (
                <div key={i} className='border-b border-gray-200 py-4'>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className='flex w-full items-center justify-between text-left transition-colors hover:text-blue-600'
                  >
                    <span className='text-lg font-bold text-gray-900'>
                      {faq.q}
                    </span>
                    <span className='text-blue-600 transform transition-transform text-2xl'>
                        {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`mt-2 overflow-hidden text-gray-600 transition-all duration-300 ${
                      openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className='pb-4 pt-2 font-medium leading-relaxed'>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* Final CTA & Pricing Section */}
      <section className='py-24 bg-gray-50 border-t border-gray-200'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center'>
            <p className='text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed'>
                You now know what this program is. You know what it teaches. You know what it can do.
            </p>
            <p className='text-xl md:text-2xl font-medium text-gray-800 mb-16 leading-relaxed'>
                The only question is whether you are going to be the person who acts or the person who keeps waiting while someone else takes the clients you could have had.
            </p>

            <div className='mb-12 flex flex-col items-stretch justify-center gap-6 sm:flex-row'>
                <div className='flex-1 rounded-3xl sm:rounded-[2.5rem] bg-yellow-200 p-6 sm:p-8 text-left border border-yellow-300 shadow-sm'>
                <p className='mb-4 text-2xl font-bold text-gray-900'>
                    Early Bird
                </p>
                <p className='text-5xl font-black text-gray-900'>₦25,000</p>
                </div>
                <div className='flex-1 rounded-3xl sm:rounded-[2.5rem] bg-gray-200 p-6 sm:p-8 text-left border border-gray-300 opacity-60'>
                <p className='mb-4 text-2xl font-bold text-gray-600'>
                    Regular Price
                </p>
                <p className='text-5xl font-black text-gray-500 line-through'>₦50,000</p>
                </div>
            </div>

            <div className='mb-10'>
                <p className='mb-6 text-sm font-bold tracking-widest text-gray-500 uppercase'>
                    TIME UNTIL EARLY BIRD DISCOUNT EXPIRES
                </p>
                <CountdownTimer />
            </div>

            <Link
                className='inline-flex w-full max-w-md items-center justify-center rounded-2xl bg-[#0A0F1E] px-8 py-5 text-xl font-black text-white transition-all hover:-translate-y-1 hover:shadow-xl'
                to='/checkout'
            >
                YES, I AM READY TO START
            </Link>

            <p className='mt-6 text-sm font-medium text-gray-500'>
                Secure payment via Flutterwave. SSL encrypted. No hidden fees.
            </p>

            <div className='mt-10 pt-10 border-t border-gray-200'>
                <p className='text-lg text-gray-600 font-medium mb-4'>
                    Still have questions before you decide?
                </p>
                <a
                    className='inline-flex font-black text-lg text-green-600 hover:text-green-700 underline underline-offset-4 decoration-2 transition-colors'
                    href='https://chat.whatsapp.com/CThjVXHpwfu5IHPFSCDuLI?mode=gi_t'
                >
                    Join our WhatsApp group.
                </a>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 py-12 text-white'>
        <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
             <a href='https://www.moontechlife.com/' className='inline-flex items-center space-x-3 hover:opacity-80 transition-opacity mb-8'>
                <img src='/moon-logo.png' alt='MoonTech Life' className='h-8 w-8' />
                <span className='text-xl font-bold'>MoonTech Life</span>
             </a>
             <p className='text-gray-400 text-sm'>
                 © 2026 MoonTech Life Community. All rights reserved. Building the next generation of tech professionals.
             </p>
        </div>
      </footer>
    </div>
  )
}
