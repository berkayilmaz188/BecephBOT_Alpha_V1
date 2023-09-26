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
import Button from '@mui/material/Button'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useRouter } from 'next/router';


const AdminsDashboard = () => {
    const [serverData, setServerData] = useState([]);
    const router = useRouter();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/server/BekoBOTServers', { withCredentials: true });
          const data = response.data;
          setServerData(data);
        } catch (error) {
          console.error('Veri getirme hatası:', error);
          if (error.response && error.response.status === 401) {
            try {
              await axios.post('/api/adminAuth/logout', {}, { withCredentials: true }); // Çerezi sil
              router.push('/Adminlogin');
            } catch (logoutError) {
              console.error('Logout hatası:', logoutError);
            }
          }
        }
      };
    
      fetchData();
    }, []);
    
    

      const handleButtonClick = (id) => {
        router.push(`/adminServer/${id}`);
      };

  return (
    
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Server Name</TableCell>
              <TableCell>Server ID</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Admin Members</TableCell>
              <TableCell>Admin Roles</TableCell>
              <TableCell>Server Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serverData.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.memberCount}</TableCell>
                <TableCell>{row.adminMembers}</TableCell>
                <TableCell>{row.adminRoles}</TableCell>
                <TableCell>
                <Button
                    variant='contained'
                    color='success'
                    onClick={() => handleButtonClick(row.id)}
                >
                    Enter
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default AdminsDashboard
