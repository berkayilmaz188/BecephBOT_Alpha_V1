// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { createTheme } from '@mui/material/styles';

import React, { useState, useEffect } from 'react';
import axios from 'axios';



const serverStatusToSalesData = (serverStatus) => {
    return [
   
      {
        stats: serverStatus.onlineMembers, // onlineMembers ile doldurun
        title: 'Online Kullanici',
        color: 'success',
        icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />,
      },
      {
        stats: serverStatus.dndMembers, // dndMembers ile doldurun
        title: 'Rahatsiz Etmeyin',
        color: 'error',
        icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />,
      },
      {
        stats: serverStatus.idleMembers, // idleMembers ile doldurun
        title: 'Boşta Kullanici',
        color: 'warning',
        icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />,
      },
      {
        stats: serverStatus.offlineMembers,
        title: 'Offline Kullanici',
        color: '#002884', // #8B008B rengini doğrudan kullanabilirsiniz
        icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />,
      },
      
    ];
  };
  

const renderStats = () => {

  return salesData.map((item, index) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const ServerDetailsCard = (props) => {
    const { id } = props;
    const [serverStatus, setServerStatus] = useState({});


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post('/usersStatus', {
              serverID: id,
            });
            const data = response.data;
            setServerStatus(data);
          } catch (error) {
            console.error('Text kanal veri getirme hatası:', error);
          }
        };
      
        fetchData();
      }, [id]);

      const salesData = serverStatusToSalesData(serverStatus);

    
  return (
    <Card>
      <CardHeader
        title='Sunucu Bilgileri'
        action={
          <IconButton sizbile='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Toplam {serverStatus.totalMembers} 😎  üyen var , 
            </Box>{' '}
            {serverStatus.adminMembers} admin'e ve {serverStatus.adminRoles} adminRoles e sahipsin.
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
            {serverStatusToSalesData(serverStatus).map((item, index) => (
            <Grid item xs={12} sm={3} key={index}>
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    variant='rounded'
                    sx={{
                    mr: 3,
                    width: 44,
                    height: 44,
                    boxShadow: 3,
                    color: 'common.white',
                    backgroundColor: `${item.color}.main`
                    }}
                >
                    {item.icon}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='caption'>{item.title}</Typography>
                    <Typography variant='h6'>{item.stats}</Typography>
                </Box>
                </Box>
            </Grid>
            ))}
        </Grid>
        </CardContent>
    </Card>
  )
}

export default ServerDetailsCard
