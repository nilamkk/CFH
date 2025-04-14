import { Card, CardContent, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { ResponsiveContainer } from 'recharts';

const CustomBarChart = ({ dataPoints, loading }) => {

    // Card shadow style - can be reused for all cards
    const cardStyle = {
        width: '100%',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1)'
        },
        borderRadius: 2
    };

    // convert dataPoints to series
    const xAxisData = [];
    const seriesData = [];
    for (let i = 0; i < dataPoints.length; i++) {
        xAxisData.push(dataPoints[i].label);
        seriesData.push(dataPoints[i].value);
    }

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    Problem Rating Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={350} >
                    <BarChart
                        xAxis={[{ id: 'barCategories', data: xAxisData, scaleType: 'band' }]}
                        series={[{ data: seriesData }]}
                        width={300}
                        height={600}
                        loading={loading}
                    />
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default CustomBarChart;