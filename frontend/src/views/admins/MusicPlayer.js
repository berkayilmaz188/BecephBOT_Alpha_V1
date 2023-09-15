// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import React, { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton';
import axios from 'axios';

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  

const MusicPlayer = (props) => {
  
  const { playedMusicData } = props;
  const [musicPlayerStatus, setMusicPlayerStatus] = useState([]);
  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [imageHeight, setImageHeight] = useState(115);

  useEffect(() => {
    if (playedMusicData) {
      console.log(playedMusicData);
    }
  }, [playedMusicData]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setImageHeight(Math.min(120, window.innerWidth - 20)); // En fazla 120 piksel yükseklik
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const imageWidth = Math.min(130, windowWidth - 20); // En fazla 130 piksel genişlik

  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  const sendMusicAction = (actionType) => {
    if (playedMusicData) {
      const { serverID, voiceChannelID } = playedMusicData;
      axios
        .post(`/music${actionType}`, {
          serverID,
          voiceChannelID,
        })
        .then((response) => {
          console.log(`${actionType} response:`, response.data);
          const StatusData = response.data;
          setMusicPlayerStatus(StatusData);
          // Burada response.data içinde status bilgisi var, isterseniz ekranda gösterebilirsiniz.
        })
        .catch((error) => {
          console.error(`${actionType} isteği hatası:`, error);
        });
    }
  };
  


  return (
    <Card sx={{ position: 'relative' }}>
        {playedMusicData && (
        <CardContent>
            <Typography variant='h6'>
              {playedMusicData.title && playedMusicData.title.length > 22
                ? `${playedMusicData.title.substring(0, 22)}... 🥳`
                : playedMusicData.title
                  ? `${playedMusicData.title} 🥳`
                  : 'Muzik Yok 🥳'}
            </Typography>

            <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
            
            </Typography>
            <Typography variant='h6' sx={{ my: 4, color: 'primary.main' }}>
            {formatDuration(playedMusicData.duration)}  {musicPlayerStatus.status}
            </Typography>
            
            <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ gap: '8px' }}>
            <IconButton
              color='success'
              onClick={() => sendMusicAction('Resume', playedMusicData.serverID, playedMusicData.voiceChannelID)}
            >
              <PlayArrowIcon sx={{ fontSize: 32 }} />
            </IconButton>
            <IconButton
              color='warning'
              onClick={() => sendMusicAction('Pause', playedMusicData.serverID, playedMusicData.voiceChannelID)}
            >
              <PauseIcon sx={{ fontSize: 32 }} />
            </IconButton>
            <IconButton
              color='error'
              onClick={() => sendMusicAction('Stop', playedMusicData.serverID, playedMusicData.voiceChannelID)}
            >
              <StopIcon sx={{ fontSize: 32 }} />
            </IconButton>
           </Box>
            
            <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
            <TrophyImg
            src={playedMusicData.thumbnail}
            alt='Music Thumbnail'
            style={{
              borderRadius: '50%',
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
            }}
          />
        </CardContent>
        )}
    </Card>
  )
}

export default MusicPlayer
