import React from 'react'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chart7 from './components/Chart7';
import Chart1ForecastWithToggle from './components/Chart1ForecastWithToggle';
import Chart2FossilToClean from './components/Chart2FossilToClean';
import Chart6WinterSources from './components/Chart6WinterSources';

const App = () => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom color="primary">
      JTxEntergy Dashboard
    </Typography>

    

    <Card variant="outlined" sx={{ mb: 8 }}>
        <CardContent>
            <Chart2FossilToClean />
        </CardContent>
    </Card>

    <Card variant="outlined" sx={{ mb: 8 }}>
        <CardContent>
            <Chart6WinterSources />
        </CardContent>
    </Card>

    <Card variant="outlined" sx={{ mb: 8 }}>
        <CardContent>
            <Chart1ForecastWithToggle />
        </CardContent>
    </Card>

    <Card variant="outlined" sx={{ mb: 8 }}>
        <CardContent>
            <Chart7 />
        </CardContent>
    </Card>

  
    

  </Container>
)

export default App
