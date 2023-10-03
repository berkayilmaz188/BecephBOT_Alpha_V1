// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar';


const ListAdminRoles = (props) => {

    const { id , AdminsData } = props;
    

  return (
    
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }} className="noscrollbar" style={{ maxHeight: 32 * 10 + 'px', overflowY: 'auto' }}>

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
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
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

export default ListAdminRoles
