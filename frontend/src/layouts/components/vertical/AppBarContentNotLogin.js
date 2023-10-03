// ** MUI Imports
import Box from '@mui/material/Box'

import useMediaQuery from '@mui/material/useMediaQuery'


// ** Icons Imports
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'

const AppBarContentNotLogin = props => {
  // ** Props


  // ** Hook
  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const router = useRouter();

  const handleLoginClick = () => {
    router.push('https://discord.com/api/oauth2/authorize?client_id=1069734207426928740&redirect_uri=http%3A%2F%2Flocalhost%3A4002%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds%20email');
  }

  

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
  
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Button color="inherit" onClick={handleLoginClick}>Giriş Yap</Button>
        </Box>
  
      </Box>
    </Box>
  )
}

export default AppBarContentNotLogin
