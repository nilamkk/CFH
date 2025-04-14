import { Card, CardContent, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { ResponsiveContainer } from 'recharts';

////////////////////////////////////////////////////////
// Use react standard hooks with screen break points to 
// adjust  pie chart size and legend positions 
// ask DeepSeek
////////////////////////////////////////////////////////

export default function CustomPieChart({ dataPoints, loading }) {

  // Card shadow style - can be reused for all cards
  const cardStyle = {
    width: '100%',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1)'
    },
    borderRadius: 2,
    height: '27rem'
  };
  
  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Problem Rating Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={300} >
          <PieChart
            series={[
              {
                data: dataPoints,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                valueFormatter: (item) => `${item.value} (${item.value}%)`
              },
            ]}
            height={100}
            loading={loading}
            margin={{ top: 0, bottom: 55, left: 10, right: 10 }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 0,

              },
            }}
          />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
};
