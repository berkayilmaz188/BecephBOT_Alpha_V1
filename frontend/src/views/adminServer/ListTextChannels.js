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



const depositData = [
  {
    logoWidth: 28,
    logoHeight: 29,
    amount: '+$4,650',
    subtitle: 'Sell UI Kit',
    title: 'Gumroad Account',
    logo: '/images/logos/gumroad.png'
  },
  {
    logoWidth: 38,
    logoHeight: 38,
    amount: '+$92,705',
    title: 'Mastercard',
    subtitle: 'Wallet deposit',
    logo: '/images/logos/mastercard-label.png'
  },
  {
    logoWidth: 20,
    logoHeight: 28,
    amount: '+$957',
    title: 'Stripe Account',
    subtitle: 'iOS Application',
    logo: '/images/logos/stripe.png'
  },
  {
    logoWidth: 34,
    logoHeight: 32,
    amount: '+$6,837',
    title: 'American Bank',
    subtitle: 'Bank Transfer',
    logo: '/images/logos/american-bank.png'
  },
  {
    logoWidth: 33,
    logoHeight: 22,
    amount: '+$446',
    title: 'Bank Account',
    subtitle: 'Wallet deposit',
    logo: '/images/logos/citi-bank.png'
  }
]

const withdrawData = [
  {
    logoWidth: 29,
    logoHeight: 30,
    amount: '-$145',
    title: 'Google Adsense',
    subtitle: 'Paypal deposit',
    logo: '/images/logos/google.png'
  },
  {
    logoWidth: 34,
    logoHeight: 34,
    amount: '-$1870',
    title: 'Github Enterprise',
    logo: '/images/logos/github.png',
    subtitle: 'Security & compliance'
  },
  {
    logoWidth: 30,
    logoHeight: 30,
    amount: '-$450',
    title: 'Upgrade Slack Plan',
    subtitle: 'Debit card deposit',
    logo: '/images/logos/slack.png'
  },
  {
    logoWidth: 30,
    logoHeight: 30,
    amount: '-$540',
    title: 'Digital Ocean',
    subtitle: 'Cloud Hosting',
    logo: '/images/logos/digital-ocean.png'
  },
  {
    logoWidth: 36,
    logoHeight: 21,
    amount: '-$21',
    title: 'AWS Account',
    logo: '/images/logos/aws.png',
    subtitle: 'Choosing a Cloud Platform'
  }
]

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
   const { id, onMusicPlay } = props;
  
    const [textChannelsData, setTextChannelsData] = useState([]);
    const [voiceChannelsData, setVoiceChannelsData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('/api/server/textchannels', {
            serverID: id,
          });
          const data = response.data;
          setTextChannelsData(data);
        } catch (error) {
          console.error('Text kanal veri getirme hatası:', error);
        }
      };
    
      const fetchData2 = async () => {
        try {
          const response2 = await axios.post('/api/server/voiceChannels', {
            serverID: id,
          });
          const data2 = response2.data;
          setVoiceChannelsData(data2);
        } catch (error2) {
          console.error('Ses kanal veri getirme hatası:', error2);
        }
      };
    
      fetchData();
      fetchData2();
    }, [id]);
    

  

    const [channelTexts, setChannelTexts] = useState({});

    const handleTextChange = (e, channelId) => {
      const newText = e.target.value;
      setChannelTexts((prevChannelTexts) => ({
        ...prevChannelTexts,
        [channelId]: newText,
      }));
    };

    const [MusicPlay, setMusicPlay] = useState({});

    const handlePlayMusic = (e, VoiceChannelId) => {
      const newMusic = e.target.value;
      setMusicPlay((prevMusicPlay) => ({
        ...prevMusicPlay,
        [VoiceChannelId]: newMusic,
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
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      
  <Box sx={{ width: '100%' }}>
    <CardHeader
      title='Mesaj Kanallari'
      // Diğer stiller
    />
    <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
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

      <Divider flexItem />

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
  <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
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

export default ListTextChannels
