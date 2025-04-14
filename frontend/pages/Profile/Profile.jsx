
import { Box, Card, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import UserAvatar from '../../components/Cards/UserAvatar';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';
import CodeforcesRatingGraph from '../../components/Charts/CodeforcesRatingGraph';
import UserInfo from '../../components/Cards/UserInfo';
import UserInfoHook from '../../components/CustomHooks/UserInfoHook';
import UserSumissionStatusHook from '../../components/CustomHooks/UserSumissionStatusHook';

import { useAuth } from '../../components/AuthProvider/AuthProvider';

const UserProfile = () => {
  const { cfhandle } = useAuth();
  const { userInfo, loading: loadingUserInfo, error: errorUserInfo } = UserInfoHook(cfhandle);
  const { problemRatingDataPoints,
    submissionStatusDataPoints,
    programmingLanguageDataPoints,
    loading: loadingPieBarChart, error: errorPieBarChart
  } = UserSumissionStatusHook(cfhandle);

  //////////////// Checking number of renders : Just testing things ///////////
  // const renderCnt = useRef(0);
  // useEffect(() => {
  //     renderCnt.current = renderCnt.current + 1;
  //     console.log(renderCnt);
  // });
  // console.log("Rendering UserProfile");
  /////////////////////////////////////////////////////////////////////////////

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

  const LoadingUserInfoComponent = () => {
    return (
      <Card sx={cardStyle}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 400
          }} >
          <Typography width={150} >Loading...</Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>

        {/* First row - User info and stats */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex' }}>
          {
            loadingUserInfo ? <LoadingUserInfoComponent /> :
              errorUserInfo ? <Typography>Something went wrong...</Typography> :
                <UserAvatar userInfo={userInfo} />
          }
        </Grid>
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex' }}>
          {
            loadingUserInfo ? <LoadingUserInfoComponent /> :
              errorUserInfo ? <Typography>Something went wrong...</Typography> :
                <UserInfo userInfo={userInfo} />
          }
        </Grid>

        {/* Second row - Pie chart for Problem Rating Distribution*/}
        <Grid size={{ xs: 12, md: 6 }}>
          {
            errorPieBarChart ? <Typography>Something went wrong...</Typography> :
              <CustomPieChart dataPoints={loadingPieBarChart ? [] : problemRatingDataPoints}
                loading={loadingPieBarChart}
              />
          }
        </Grid>
        {/* Third row - Pie chart for Language Submission Distribution*/}
        <Grid size={{ xs: 12, md: 12 }}>
          {
            errorPieBarChart ? <Typography>Something went wrong...</Typography> :
              <CustomPieChart dataPoints={loadingPieBarChart ? [] : programmingLanguageDataPoints}
                loading={loadingPieBarChart}
              />
          }
        </Grid>
        {/* Fourth row - Pie chart for Submission Status Distribution*/}
        <Grid size={{ xs: 12, md: 12 }}>
          {
            errorPieBarChart ? <Typography>Something went wrong...</Typography> :
              <CustomPieChart dataPoints={loadingPieBarChart ? [] : submissionStatusDataPoints}
                loading={loadingPieBarChart}
              />
          }
        </Grid>
        {/* Fifth row - Bar chart for */}
        <Grid size={{ xs: 12, md: 12 }}>
          {
            errorUserInfo ? <Typography>Something went wrong...</Typography> :
              <CustomBarChart dataPoints={loadingPieBarChart ? [] : problemRatingDataPoints}
                loading={loadingPieBarChart}
              />
          }
        </Grid>
        {/* Sixth row - Codeforces rating ghaph */}
        <Grid size={{ xs: 12, md: 12 }}>
          {
            <CodeforcesRatingGraph cfhandle={cfhandle} />
          }
        </Grid>

      </Grid>
    </Container>
  );
};

export default UserProfile;
