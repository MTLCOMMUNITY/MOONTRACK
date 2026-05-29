import { IconMoon } from '@tabler/icons-react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData, adminNavGroups } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useCurrentUser } from '@/hooks/use-current-user'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const currentUser = useCurrentUser()

  const navGroups = currentUser.isAdmin
    ? adminNavGroups
    : sidebarData.navGroups

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href={currentUser.isAdmin ? '/optcontrol' : '/dashboard'}>
                <div className='flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary/10 overflow-hidden'>
                  <img src='/moon-logo.png' alt='Logo' className='size-10 object-contain' />
                </div>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold'>MoonTrack</span>
                  <span className='truncate text-xs text-muted-foreground'>
                    MoonTech Life
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
