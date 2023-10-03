// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'

// ** Component Import
import VerticalAppBarContent from './components/vertical/AppBarContent'
import VerticalAppBarContentNotLogin from './components/vertical/AppBarContentNotLogin'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import navigation from 'src/navigation/vertical'; 
import { useRouter } from 'next/router';


const UserLayout = ({ children, visibleItems }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const router = useRouter();

  const navItems = navigation();
  const filteredNavItems = visibleItems
    ? navItems.filter(item => visibleItems.includes(item.title))
    : navItems;


  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  const UpgradeToProImg = () => {
    return (
      <Box sx={{ mx: 'auto' }}>
        <a
          target='_blank'
          rel='noreferrer'
          href='https://discord.gg/qSASVCQa94'
        >
          <img width={220} alt='upgrade to premium' src={`/images/misc/upgrade-banner-${settings.mode}.png`} />
        </a>
      </Box>
    )
  }

  const isHomePage = router.pathname === '/';

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={filteredNavItems}
      afterVerticalNavMenuContent={UpgradeToProImg}
      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        isHomePage ? (
          <VerticalAppBarContentNotLogin
            hidden={hidden}
            settings={settings}
            saveSettings={saveSettings}
            toggleNavVisibility={props.toggleNavVisibility}
          />
        ) : (
          <VerticalAppBarContent
            hidden={hidden}
            settings={settings}
            saveSettings={saveSettings}
            toggleNavVisibility={props.toggleNavVisibility}
          />
        )
      )}
    >
      {children}
    </VerticalLayout>
  )
}

export default UserLayout
