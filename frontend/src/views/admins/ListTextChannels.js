// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiDivider from '@mui/material/Divider'
import TextField from '@mui/material/TextField';
import TextsmsIcon from '@mui/icons-material/Textsms';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Trophy from '../dashboard/Trophy'
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';



// Styled Divider component
const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const ListTextChannels = (props) => {
   const { id } = props;
  
    const [textChannelsData, setTextChannelsData] = useState([]);
   
    const router = useRouter();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('/api/server/textchannels', { serverID: id });
          const data = response.data;
          setTextChannelsData(data);
        } catch (error) {
          console.error('Text kanal veri getirme hatası:', error);
          if (error.response && error.response.status === 401) {
            router.push('/pages/login'); // Status 401 ise kullanıcıyı login sayfasına yönlendir.
          }
        }
      };
  
      fetchData();
    }, [id, router]);
    

    const [channelTexts, setChannelTexts] = useState({});

    const handleTextChange = (e, channelId) => {
      const newText = e.target.value;
      setChannelTexts((prevChannelTexts) => ({
        ...prevChannelTexts,
        [channelId]: newText,
      }));
    };


  const handleSendMessage = (channelId) => {
    // Burada mesajı göndermek için gerekli işlemi yapabilirsiniz
    const textMessage = channelTexts[channelId];
    const serverID = id;
    const textChannelID = channelId;
    
    // Örneğin axios ile bir POST isteği göndermek:
     axios.post('/api/message/messageChannel', {
       serverID,
       textChannelID,
       textMessage,
     })
       .then((response) => {
         // Başarılı cevap işlemleri
      })
       .catch((error) => {
         console.error('Mesaj gönderme hatası:', error);
      });

    // Mesaj gönderildikten sonra bu metin kanalındaki metni sıfırlayabilirsiniz
    setChannelTexts((prevChannelTexts) => ({
      ...prevChannelTexts,
      [channelId]: '',
    }));
  };

  

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}  >
      
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Mesaj Kanallari'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography variant='caption'>Kanal üzerine tıklayıp mesaj gönderebilirsiniz.</Typography>}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }} className="newscrollbar" style={{ maxHeight: 31 * 10 + 'px', overflowY: 'auto' }}>
          {textChannelsData.map((item, index) => {
            return (
              <Grid
                key={item.title}
                container
                alignItems="center"
                spacing={2}
                sx={{ mb: index !== textChannelsData.length - 1 ? 6 : 0 }}
              >
                <Grid item xs={12} md={3}>
                  <Box sx={{ minWidth: 38, display: 'flex', justifyContent: 'center' }}>
                    <TextsmsIcon fontSize="large" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextField
                    label={item.name}
                    variant="outlined"
                    value={channelTexts[item.id] || ''}
                    onChange={(e) => handleTextChange(e, item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Enter tuşuna basıldığında mesajı gönder
                        handleSendMessage(item.id);
                      }
                    }}
                    fullWidth  // TextField'i genişletir
                  />
                </Grid>
              </Grid>
            );
          })}
        </CardContent>
      </Box>   
    </Card>
    
  )
}

export default ListTextChannels
