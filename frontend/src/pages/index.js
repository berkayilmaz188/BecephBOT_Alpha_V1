// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
const HomePage = () => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Typography variant="h4" align="center" gutterBottom>
              Hoş Geldiniz!
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              Burası sizin ana sayfanız. Burada uygulamanızın temel özelliklerini ve içeriğini gösterebilirsiniz.
            </Typography>
            <Grid container justifyContent="center">
              <Button variant="contained" color="primary" startIcon={<HomeIcon />}>
                Başla
              </Button>
            </Grid>
          </Paper>
        </Grid>
        {/* Diğer içerik ve komponentler buraya eklenebilir */}
      </Grid>
    </Container>
  );
};

export default HomePage
