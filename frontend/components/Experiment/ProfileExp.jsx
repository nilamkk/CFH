import React from 'react';
import { 
  Container, 
  Card, 
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Sample data - you would replace this with actual data fetching
const sampleUser = {
  username: "CodeMaster",
  handle: "code_master",
  rank: "International Master",
  bestRank: "International Grandmaster",
  maxRating: 2450,
  avatar: "/api/placeholder/150/150",
  problemRatingDistribution: [
    { name: "800-1000", value: 45, color: "#cccccc" },
    { name: "1000-1200", value: 78, color: "#77ff77" },
    { name: "1200-1400", value: 65, color: "#77ddbb" },
    { name: "1400-1600", value: 43, color: "#aaaaff" },
    { name: "1600-1800", value: 32, color: "#ff88ff" },
    { name: "1800-2000", value: 18, color: "#ffcc88" },
    { name: "2000+", value: 7, color: "#ff7777" },
  ],
  ratingWiseAccepted: [
    { rating: "800", count: 120 },
    { rating: "900", count: 95 },
    { rating: "1000", count: 87 },
    { rating: "1100", count: 76 },
    { rating: "1200", count: 68 },
    { rating: "1300", count: 54 },
    { rating: "1400", count: 43 },
    { rating: "1500", count: 37 },
    { rating: "1600", count: 22 },
    { rating: "1700", count: 16 },
    { rating: "1800", count: 11 },
    { rating: "1900", count: 8 },
    { rating: "2000+", count: 5 },
  ]
};


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


const CodeForcesProfilePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* First row - User info and stats */}
        <Grid size = {{xs:12, md:3}} sx={{ display: 'flex' }}>
          <Card sx={ cardStyle }>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Avatar
                src={sampleUser.avatar}
                alt={sampleUser.username}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" component="h2" align="center">
                {sampleUser.username}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size = { {xs:12, md:9}}  sx={{ display: 'flex' }}>
          <Card sx={ cardStyle}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">Handle</Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>{sampleUser.handle}</Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">Current Rank</Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>{sampleUser.rank}</Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">Best Rank</Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>{sampleUser.bestRank}</Typography>
                  <Divider sx={{ my: 1 }} />
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">Max Rating</Typography>
                  <Typography variant="h6">{sampleUser.maxRating}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Second row - Pie chart */}
        <Grid size={{xs:12}}>
          <Card  sx={ cardStyle }>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Problem Rating Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={sampleUser.problemRatingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {sampleUser.problemRatingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} problems`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Third row - Bar chart */}
        <Grid size={{xs:12}}>
          <Card sx = {cardStyle } >
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Rating-wise Accepted Questions
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={sampleUser.ratingWiseAccepted}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `${value} questions`}
                    labelFormatter={(value) => `Rating: ${value}`}
                  />
                  <Bar dataKey="count" fill="#8884d8" name="Questions Solved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CodeForcesProfilePage;