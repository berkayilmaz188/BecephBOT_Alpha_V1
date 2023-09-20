// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

import { useState, useEffect } from 'react';
import axios from 'axios';


const sortUsers = (usersData) => {
  return usersData.sort((a, b) => {
    const statusOrder = ['online', 'dnd', 'idle', 'offline'];
    const statusA = statusOrder.indexOf(a.status);
    const statusB = statusOrder.indexOf(b.status);

    // Status sırasına göre sıralama yap
    if (statusA < statusB) return -1;
    if (statusA > statusB) return 1;

    // Status aynı ise displayName'e göre sıralama yap
    return a.displayName.localeCompare(b.displayName);
  });
};


const statusObj = {
  offline: { color: 'primary' },
  dnd: { color: 'error' },
  idle: { color: 'warning' },
  online: { color: 'success' }
}

const UsersTable = (props) => {
    const { id } = props;

    const [searchTerm, setSearchTerm] = useState('');

    const [usersDetailsData, setUsersDetailsData] = useState([]);
    const [messageInputs, setMessageInputs] = useState({}); 

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 

   useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.post('/api/server/users', {
          serverID: id,
        });
        const Usersdata = response.data;
        // Kullanıcıları sıralayın ve sıralanmış veriyi state'e atayın
        const sortedUsers = sortUsers(Usersdata);
        setUsersDetailsData(sortedUsers);
      } catch (error) {
        console.error('Users getirme hatasi', error);
      }
    };

    fetchUsersData();
  }, [id]);


  const handleInputChange = (e, userID) => {
    // Her kullanıcı için ayrı bir mesaj girişini güncelle
    setMessageInputs({ ...messageInputs, [userID]: e.target.value });
  };

  const handleMessageSend = async (userID) => {
    try {
      // Mesajı /messageUsers endpoint'ine gönder
      await axios.post('/api/message/messageUsers', {
        serverID: id,
        userID: userID,
        message: messageInputs[userID], // Her kullanıcı için ilgili mesajı kullanın
      });

      // Mesajı gönderdikten sonra ilgili mesaj girişini temizle
      setMessageInputs({ ...messageInputs, [userID]: '' });

      // Başarı durumunda bildirim göster
      setSnackbarMessage('Mesaj başarıyla gönderildi');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);

      // Hata durumunda bildirim göster
      setSnackbarMessage('Mesaj gönderme hatası');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredUsers = usersDetailsData.filter((user) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const lowerCaseDisplayName = user.displayName.toLowerCase();
    const lowerCaseTag = user.tag.toLowerCase();
  
    // displayName veya tag alanları arama terimini içeriyorsa kullanıcıyı göster
    return lowerCaseDisplayName.includes(lowerCaseSearchTerm) || lowerCaseTag.includes(lowerCaseSearchTerm);
  });
  

      
  return (
    <Card>
      
      <TableContainer>
        
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
        <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
          <SearchIcon sx={{ color: 'gray', marginRight: '4px', marginLeft:'4px' }} />
          <TextField
            placeholder="Arama"
            variant="standard"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '0', // Çerçeveyi kaldır
              },
              '& .MuiOutlinedInput-input': {
                textAlign: 'center', // Metni ortala
              },
            }}
            InputProps={{
              style: {
                border: 'none', // Dış çerçeveyi kaldır
              },
            }}
            InputLabelProps={{
              shrink: false, // Etiketi küçültme
              style: { fontSize: 10 },
            }}
          />
        </div>
          <TableHead>
            
            <TableRow>
              <TableCell>Kullanici Adi</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Admin Rolleri</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Send Message</TableCell>
              
            </TableRow>
            
          </TableHead>
          <TableBody>
          {usersDetailsData
              .filter((row) => {
                const normalizedSearchTerm = searchTerm.toLowerCase().trim();
                if (normalizedSearchTerm === '') {
                  return true;
                } else {
                  const normalizedDisplayName = row.displayName.toLowerCase();
                  const normalizedTag = row.tag.toLowerCase();
                  return (
                    normalizedDisplayName.includes(normalizedSearchTerm) ||
                    normalizedTag.includes(normalizedSearchTerm)
                  );
                }
              }).map(row => (
              <TableRow hover key={row.displayName} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    alt={row.displayName}
                    src={row.avatarURL}
                    sx={{ width: 48, height: 48, marginRight: '8px' }}
                  />
                  <div>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.displayName}</Typography>
                    <Typography variant='caption'>{row.tag}</Typography>
                  </div>
                  {row.isBot && (
                  <Chip
                    label="BOT"
                    color="info"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      '& .MuiChip-label': { fontWeight: 500 },
                      marginLeft: '8px', // Bot chip ile isim arasında boşluk bırakır
                    }}
                  />
                )}
                </Box>
              </TableCell>

                <TableCell>
                {row.isAdmin ? (
                  <DoneOutlineIcon sx={{ color: 'success.main' }} />
                ) : (
                  <CloseIcon sx={{ color: 'error.main' }} />
                )}
              </TableCell>
                
                <TableCell>
                  {row.roles.some(role => role.isAdminRole) ? (
                    row.roles
                      .filter(role => role.isAdminRole)
                      .map((adminRole, index) => (
                        <div key={index}>
                          <Typography variant='caption' sx={{ display: 'inline', marginRight: '4px' }}>
                            <Box component='span' sx={{ color: 'success.main', fontWeight: 500 }}>
                              {adminRole.name}
                            </Box>
                          </Typography>
                          <br />
                        </div>
                      ))
                  ) : (
                    <Typography variant='caption' sx={{ display: 'inline', color: 'default' }}>
                      Admin Rolu Yok
                    </Typography>
                  )}
                </TableCell>

                
                <TableCell>
                <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>

                <TableCell>
                <TextField
                    label="Mesaj Gönder"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={messageInputs[row.id] || ''}
                    onChange={(e) => handleInputChange(e, row.id)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleMessageSend(row.id); // Enter tuşuna basıldığında mesajı gönder
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 16 }, // Font boyutunu burada ayarlayabilirsiniz
                    }}
                  />
                </TableCell>
                

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={7000} // Bildirimin otomatik olarak kapanmasını ayarlayabilirsiniz (ms cinsinden)
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default UsersTable
