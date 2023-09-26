// ** MUI Imports
import Grid from '@mui/material/Grid'

import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports

import BotServerList from 'src/views/admins/BotServerList'

const AdminsDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
      <Grid item xs={12}>
        <BotServerList />
        </Grid>
        
      </Grid>
    </ApexChartWrapper>
  )
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  // Token var mı kontrol edin
  if (!token) {
    return {
      redirect: {
        destination: '/adminLogin',
        permanent: false,
      },
    };
  }

  // Token var ise, sayfa props'ları döndürün
  return {
    props: {},
  };
}



export default AdminsDashboard
