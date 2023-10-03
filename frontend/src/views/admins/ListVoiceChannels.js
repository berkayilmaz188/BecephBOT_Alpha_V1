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

const ListVoiceChannels = (props) => {
   const { id, onMusicPlay } = props;
  

    const [voiceChannelsData, setVoiceChannelsData] = useState([]);
    const [channelTexts, setChannelTexts] = useState({});
    const router = useRouter();

    useEffect(() => {

  
      const fetchData2 = async () => {
        try {
          const response2 = await axios.post('/api/server/voiceChannels', { serverID: id });
          const data2 = response2.data;
          setVoiceChannelsData(data2);
        } catch (error2) {
          console.error('Ses kanal veri getirme hatası:', error2);
          if (error2.response && error2.response.status === 401) {
            router.push('/pages/login'); // Status 401 ise kullanıcıyı login sayfasına yönlendir.
          }
        }
      };
  
      fetchData2();
    }, [id, router]);
    

    const [MusicPlay, setMusicPlay] = useState({});

    const handlePlayMusic = (e, VoiceChannelId) => {
      const newMusic = e.target.value;
      setMusicPlay((prevMusicPlay) => ({
        ...prevMusicPlay,
        [VoiceChannelId]: newMusic,
      }));
    };

  
  const handleMusicPlay = (VoiceChannelId) => {
    const musicPlay = MusicPlay[VoiceChannelId];
    const serverID = id;
    const voiceChannelID = VoiceChannelId;
    
    axios.post('/api/music/musicPlay', {
      serverID,
      voiceChannelID,
      musicPlay,
    })
    .then((response) => {
      onMusicPlay(response.data); // Responce verilerini onMusicPlay ile iletilir
    })
    .catch((error) => {
      console.error('Mesaj gönderme hatası:', error);
    });

    setChannelTexts((prevMusicPlay) => ({
      ...prevMusicPlay,
      [VoiceChannelId]: '',
    }));
    setMusicPlay({ ...MusicPlay, [VoiceChannelId]: '' });
  };


  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }} >
      

      <Box sx={{ width: '100%' }}>
  <CardHeader
    title='Ses Kanallari'
    sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
    action={<Typography variant='caption'>Kanala Müzik Linki Gönderip Müzik Oynatabilirsiniz.</Typography>}
    titleTypographyProps={{
      variant: 'h6',
      sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
    }}
  />
  <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }} className="newscrollbar" style={{ maxHeight: 31 * 10 + 'px', overflowY: 'auto' }}>
    {voiceChannelsData.map((item, index) => {
      return (
        <Grid
          key={item.title}
          container
          alignItems="center"
          spacing={2}
          sx={{ mb: index !== voiceChannelsData.length - 1 ? 6 : 0 }}
        >
          <Grid item xs={12} md={3}>
            <Box sx={{ minWidth: 36, display: 'flex', justifyContent: 'center' }}>
              <VolumeUpIcon fontSize="large" />
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              label={item.name}
              variant="outlined"
              value={MusicPlay[item.id] || ''}
              onChange={(e) => handlePlayMusic(e, item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  
                  handleMusicPlay(item.id);
                }
              }}
              fullWidth 
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

export default ListVoiceChannels
