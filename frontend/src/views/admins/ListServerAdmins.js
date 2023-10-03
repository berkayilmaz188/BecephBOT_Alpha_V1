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




const ListServerAdmins = (props) => {

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
    
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }} className="noscrollbar" style={{ maxHeight: 32 * 10 + 'px', overflowY: 'auto' }}>
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Adminler'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>Yönetici yetkisi olan kullanıcılar</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
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

    </Card>
  )
}

export default ListServerAdmins
