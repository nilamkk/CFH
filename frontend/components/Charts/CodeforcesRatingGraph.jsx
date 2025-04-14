import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, ReferenceArea } from 'recharts';


const CodeforcesRatingGraph = ({ cfhandle }) => {

  const [ratingHistory, setRatingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatingHistory = async () => {
      try {
        const response = await fetch(`https://codeforces.com/api/user.rating?handle=${cfhandle}`);
        if (!response.ok) {
          throw new Error('Failed to fetch rating history');
        }
        const data = await response.json();
        if (data.status === 'OK') {
          setRatingHistory(data.result);
          // setRatingHistory([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching rating history:', error);
        setLoading(false);
      }
    };
    fetchRatingHistory();
  }, [cfhandle]);

  let maxRating = 0;
  let firstContestDateTime = null, lastContestDateTime = null;

  const ratingData = ratingHistory.map((ratingItem) => {
    maxRating = Math.max(maxRating, ratingItem.newRating);
    if (!firstContestDateTime || ratingItem.ratingUpdateTimeSeconds < firstContestDateTime)
      firstContestDateTime = ratingItem.ratingUpdateTimeSeconds;
    if (!lastContestDateTime || ratingItem.ratingUpdateTimeSeconds > lastContestDateTime)
      lastContestDateTime = ratingItem.ratingUpdateTimeSeconds;
    return {
      id: ratingItem.contestId,
      date: ratingItem.ratingUpdateTimeSeconds,
      rating: ratingItem.newRating,
      contest: ratingItem.contestName,
      rank: ratingItem.rank,
      // convert number to string and add '+' sign if positive
      ratingChange: (ratingItem.newRating - ratingItem.oldRating > 0 ? '+' : '') + (ratingItem.newRating - ratingItem.oldRating).toString()
    }
  })

  maxRating = Math.min(maxRating + 500, 4500);

  const ratingRanges = [
    { y1: 0, y2: 1199, color: '#BCBEBD', opacity: 0.9, label: 'Newbie' },
    { y1: 1200, y2: 1399, color: '#75F582', opacity: 0.9, label: 'Pupil' },
    { y1: 1400, y2: 1599, color: '#47EFBB', opacity: 0.9, label: 'Specialist' },
    { y1: 1600, y2: 1899, color: '#A0A0E7', opacity: 0.9, label: 'Expert' },
    { y1: 1900, y2: 2099, color: '#F598FE', opacity: 0.9, label: 'Candidate Master' },
    { y1: 2100, y2: 2299, color: '#F5D787', opacity: 0.9, label: 'Master' },
    { y1: 2300, y2: 2399, color: '#F7BB16', opacity: 0.9, label: 'Grandmaster' },
    { y1: 2400, y2: 2599, color: '#F97A7A', opacity: 0.9, label: 'Legendary Grandmaster' },
    { y1: 2600, y2: 2999, color: '#F34D4D', opacity: 0.9, label: 'Legendary Grandmaster' },
    { y1: 3000, y2: 4500, color: '#9F0A0A', opacity: 0.9, label: 'Legendary Grandmaster' }
  ];

  let maxRatingRange = 0;
  let adjustedRatingRanges = ratingRanges.filter((range) => {
    if (range.y1 <= maxRating)
      maxRatingRange = Math.max(maxRatingRange, range.y2);
    return range.y1 <= maxRating
  });
  let adjustedDomain = [0, maxRatingRange];
  let ticks = [800, 1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000, 4500];
  let adjustedTicks = ticks.filter((tick) => tick <= maxRatingRange);

  // get the date difference in first and last contest date
  let firstContestDate = new Date(firstContestDateTime * 1000);
  let lastContestDate = new Date(lastContestDateTime * 1000);

  function getDateDifference(startDate, endDate) {
    // Ensure startDate is before endDate
    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }
    // Calculate years
    let years = endDate.getFullYear() - startDate.getFullYear();
    // Calculate months
    let months = endDate.getMonth() - startDate.getMonth();
    // Calculate days
    let days = endDate.getDate() - startDate.getDate();
    // Adjust for negative months or days
    if (days < 0) {
      months--;
      const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
      days += lastDayOfMonth;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return {
      years: years,
      months: months,
      days: days
    };
  }

  function generateDateInterval(startDateMs, endDateMs, dateDifference) {
    // Format options for different interval types
    const yearFormat = { year: 'numeric' };
    const monthYearFormat = { year: 'numeric', month: 'short' };
    const dayMonthYearFormat = { year: 'numeric', month: 'short', day: 'numeric' };

    // Number of intervals to generate (always 7 points)
    const numIntervals = 7;

    // Array to store the interval points
    const intervalPoints = [];
    const intervalPointsMiliSec = [];

    // Determine interval type based on conditions
    let intervalType, formatOptions;

    if (dateDifference.years >= 7) {
      // Year-only interval
      intervalType = 'year';
      formatOptions = yearFormat;
    } else if (dateDifference.months >= 7) {
      // Month-year interval
      intervalType = 'month';
      formatOptions = monthYearFormat;
    } else if (dateDifference.days >= 7) {
      // Day-month-year interval
      intervalType = 'day';
      formatOptions = dayMonthYearFormat;
    } else {
      // Default to day-month-year for smaller intervals
      intervalType = 'day';
      formatOptions = dayMonthYearFormat;
    }

    // Calculate time difference in milliseconds
    const timeDifferenceMs = endDateMs - startDateMs;

    // Calculate step size for equal spacing
    const stepMs = timeDifferenceMs / (numIntervals - 1);

    // Generate the interval points (backward from end date)
    for (let i = 0; i < numIntervals; i++) {
      const pointTimeMs = endDateMs - (stepMs * i);
      const datePoint = new Date(pointTimeMs);
      intervalPointsMiliSec.push(Math.floor(pointTimeMs));
      // Format the date according to the interval type
      const formattedDate = datePoint.toLocaleDateString('en-US', formatOptions);
      intervalPoints.push(formattedDate);
    }

    return [intervalPointsMiliSec.reverse(), intervalPoints.reverse()];
  }

  const formatDateXAxis = (dateSeconds, dateDifference) => {
    const date = new Date(dateSeconds * 1000);

    // Format options for different interval types
    const yearFormat = { year: 'numeric' };
    const monthYearFormat = { year: 'numeric', month: 'short' };
    const dayMonthYearFormat = { year: 'numeric', month: 'short', day: 'numeric' };

    // Determine interval type based on conditions
    let intervalType, formatOptions;

    if (dateDifference.years >= 7) {
      // Year-only interval
      intervalType = 'year';
      formatOptions = yearFormat;
    } else if ((dateDifference.years * 12 + dateDifference.months) >= 7) {
      // Month-year interval
      intervalType = 'month';
      formatOptions = monthYearFormat;
    } else if ((dateDifference.years * 12 * 365 + dateDifference.months * 30 + dateDifference.days) >= 7) {
      // Day-month-year interval
      intervalType = 'day';
      formatOptions = dayMonthYearFormat;
    } else {
      // Default to day-month-year for smaller intervals
      intervalType = 'day';
      formatOptions = dayMonthYearFormat;
    }

    return date.toLocaleDateString('en-US', formatOptions);
  }

  let yAxisTicks, yAxisTicksWithLabels;
  if (!firstContestDateTime && !lastContestDateTime) {
    firstContestDateTime = new Date().getTime();
    lastContestDateTime = new Date().getTime();
  } else {
    firstContestDateTime = firstContestDateTime * 1000;
    lastContestDateTime = lastContestDateTime * 1000;
  }
  let dateDifference = getDateDifference(firstContestDate, lastContestDate);
  [yAxisTicks, yAxisTicksWithLabels] = generateDateInterval(firstContestDateTime, firstContestDateTime, dateDifference);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card sx={{
          bgcolor: '#f8f9fa',
          p: 1.5,
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: 300
        }}>
          <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.contest}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Rank: {data.rank}
          </Typography>
          <Typography variant="body2" sx={{
            color: data.ratingChange.startsWith('+') ? 'success.main' : 'error.main',
            fontWeight: 'bold'
          }}>
            Rating change: {data.ratingChange}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            New rating: {data.rating}
          </Typography>
        </Card>
      );
    }
    return null;
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

  if (loading) {
    return (
      <Card sx={cardStyle}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Rating History
          </Typography>
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width : '100%',
              height: 400
            }} >
            <Typography width={150} >Loading data...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rating History
        </Typography>
        <div style={{ width: '100%', height: 500 }}>
          <ResponsiveContainer>
            <LineChart
              data={ratingData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {adjustedRatingRanges.map((range, index) => (
                <React.Fragment key={index}>
                  {/* Background color areas */}
                  <ReferenceArea
                    y1={range.y1}
                    y2={range.y2}
                    fill={range.color}
                    fillOpacity={range.opacity}
                  />
                  {/* Dividing lines */}
                  <ReferenceLine
                    y={range.y2}
                    stroke={range.color}
                    strokeDasharray="3 3"
                  />
                  {/* Rating range labels */}
                  <text
                    x={40}
                    y={(range.y1 + range.y2) / 2}
                    fill={range.color}
                    textAnchor="end"
                    fontSize="12"
                  >
                    {range.label}
                  </text>
                </React.Fragment>
              ))}
              <XAxis
                dataKey="date"
                type='number'
                domain={[firstContestDateTime / 1000, lastContestDateTime / 1000]}
                tickFormatter={(date) => formatDateXAxis(date, dateDifference)}
                tickCount={8}
                tick={{ textAnchor: 'middle' }}
                // angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                domain={adjustedDomain}
                ticks={adjustedTicks}
                label={{ value: 'Rating', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="linear"
                dataKey="rating"
                stroke="#1a73e8"
                strokeWidth={2}
                dot={{
                  r: 6,
                  fill: '#fff',
                  stroke: '#1a73e8',
                  strokeWidth: 2
                }}
                activeDot={{
                  r: 8,
                  fill: '#1a73e8',
                  stroke: '#fff',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeforcesRatingGraph;