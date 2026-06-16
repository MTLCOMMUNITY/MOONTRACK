import {
  IconCash,
  IconLayoutDashboard,
  IconLink,
  IconWallet,
  IconSettings,
  IconUserCog,
  IconPalette,
  IconBell,
  IconUsers,
  IconChartBar,
  IconCreditCard,
  IconBuildingBank,
  IconAdjustments,
  IconReport,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Influencer',
    email: '',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'MoonTrack',
      logo: IconLayoutDashboard,
      plan: 'MoonTech Life',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Earnings',
          url: '/earnings',
          icon: IconCash,
        },
        {
          title: 'Referral Links',
          url: '/referrals',
          icon: IconLink,
        },
        {
          title: 'Payouts',
          url: '/payouts',
          icon: IconWallet,
        },
        {
          title: 'Bank Details',
          url: '/bank',
          icon: IconBuildingBank,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },

            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
          ],
        },
      ],
    },
  ],
}

// Admin nav groups — only shown when isAdmin = true
export const adminNavGroups = [
  {
    title: 'Control Panel',
    items: [
      {
        title: 'Overview',
        url: '/optcontrol',
        icon: IconChartBar,
      },
      {
        title: 'Influencers',
        url: '/optcontrol/influencers',
        icon: IconUsers,
      },
      {
        title: 'Conversions',
        url: '/optcontrol/conversions',
        icon: IconCreditCard,
      },
      {
        title: 'Referral Links',
        url: '/optcontrol/referrals',
        icon: IconLink,
      },
      {
        title: 'Payments',
        url: '/optcontrol/payments',
        icon: IconCash,
      },
      {
        title: 'Payouts',
        url: '/optcontrol/payouts',
        icon: IconBuildingBank,
      },
      {
        title: 'Reports',
        url: '/optcontrol/reports',
        icon: IconReport,
      },
    ],
  },
  {
    title: 'Admin Settings',
    items: [
      {
        title: 'Platform Settings',
        url: '/optcontrol/settings',
        icon: IconAdjustments,
      },
      {
        title: 'Profile',
        url: '/settings',
        icon: IconUserCog,
      },
      {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: IconPalette,
      },
      {
        title: 'Notifications',
        url: '/settings/notifications',
        icon: IconBell,
      },
    ],
  },
]
