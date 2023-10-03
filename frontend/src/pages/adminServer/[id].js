// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'

import ListTextChannels from 'src/views/admins/ListTextChannels'

import { useRouter } from 'next/router';
import React, { useState } from 'react';
import MusicPlayer from 'src/views/admins/MusicPlayer'
import ServerDetailsCard from 'src/views/admins/ServerDetailsCard'
import UsersTable from 'src/views/admins/UsersTable'

import { checkTokenAndRedirect } from 'src/utils/redirects';
import ListVoiceChannels from 'src/views/admins/ListVoiceChannels'
import ListServerAdmins from 'src/views/admins/ListServerAdmins'
import ListAdminRoles from 'src/views/admins/ListAdminRoles'
import ListServerAdminsRoles from 'src/views/admins/ListServerAdminRoles'

export async function getServerSideProps(context) {
  return checkTokenAndRedirect(context);
}


const AdminServerDashboard = () => {
    const router = useRouter();
    const { id } = router.query;

    const [playedMusicData, setPlayedMusicData] = useState({});
    const [serverAdminsData, setServerAdminsData] = useState({});

    const handleMusicPlay = (responceData) => {
      setPlayedMusicData(responceData); // Responce verilerini ayarlayın
    };

    const handleServerAdminsData = (responceData) => {
      setServerAdminsData(responceData); // Responce verilerini ayarlayın
    };

  return (
    
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <MusicPlayer playedMusicData={playedMusicData}/>
        </Grid>
        <Grid item xs={12} md={8}>
          <ServerDetailsCard id={id}/>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <ListTextChannels id={id} />
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <ListVoiceChannels id={id} onMusicPlay={handleMusicPlay} />
        </Grid>
        <Grid item xs={12}>
          <UsersTable id={id} />
        </Grid>
        <Grid item xs={12} md={12} lg={8}>
          <ListServerAdminsRoles id={id}/>
        </Grid>

 
      </Grid>
    </ApexChartWrapper>
  )
}

export default AdminServerDashboard