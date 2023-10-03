// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiDivider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar';

import { useState, useEffect } from 'react';
import axios from 'axios';


const Divider = styled(MuiDivider)(({ theme }) => ({
    margin: theme.spacing(5, 0),
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
      borderRight: 'none',
      margin: theme.spacing(0, 5),
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  }))

const ListServerAdminsRoles = (props) => {

    const { id, onAdminsData } = props;
    const [AdminsData, setAdminsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post('/api/server/serverAdmins', { serverID: id });
            const data = response.data;
            setAdminsData(data);
            onAdminsData(response.data);
          } catch (error) {
            console.error('Admin verisi getirme hatasi:', error);
          }
        };
        fetchData();
      }, [id]);

  return (
    
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      <Box sx={{ width: '100%' }} >
        <CardHeader
          title='Adminler'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>Yönetici yetkisi olan kullanıcılar</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }} className="noscrollbar" style={{ maxHeight: 32 * 10 + 'px', overflowY: 'auto' }}>
            {AdminsData.adminMembers && AdminsData.adminMembers.map((member, index) => (
                <Box
                    key={member.id}
                    sx={{ display: 'flex', alignItems: 'center', mb: index !== AdminsData.adminMembers.length - 1 ? 6 : 0 }}
                >
                    <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                    <Avatar
                    alt={member.displayName}
                    src={member.avatarURL}
                    sx={{ width: 42, height: 42, marginRight: '8px' }}
                  />
                    </Box>
                    <Box
                    sx={{
                        ml: 4,
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    >
                    <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{member.displayName}</Typography>
                        <Typography variant='caption'>{member.tag}</Typography>
                    </Box>
                    </Box>
                </Box>
                ))}
        </CardContent>
      </Box>

      <Divider flexItem />

      <Box sx={{ width: '100%' }} >
        <CardHeader
          title='Admin Roller'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>Yönetici Yetkisi Olan Roller</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }} className="newscrollbar" style={{ maxHeight: 31 * 10 + 'px', overflowY: 'auto' }}>
            {AdminsData.adminRoles && AdminsData.adminRoles.map((member, index) => (
                    <Box
                        key={member.id} 
                        sx={{ display: 'flex', alignItems: 'center', mb: index !== AdminsData.adminMembers.length - 1 ? 6 : 0 }}
                    >
                        <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                        <Avatar
                            sx={{
                            width: 40,
                            height: 40,
                            marginRight: 3,
                            fontSize: '1rem',
                            color: 'common.white',
                            backgroundColor: member.color // member.color kullanıldı
                            }}
                        >
                            {member.name.slice(0, 2).toUpperCase()} {/* member.name'nin ilk 2 harfi büyük olarak yansıtıldı */}
                        </Avatar>
                        </Box>
                        <Box
                        sx={{
                            ml: 4,
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                        >
                        <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{member.name}</Typography>
                        </Box>
                        </Box>
                    </Box>
                    ))}
        </CardContent>
      </Box>

    </Card>
  )
}

export default ListServerAdminsRoles
