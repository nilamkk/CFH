import { 
    Card, 
    CardContent,
    Typography,
    Avatar
} from '@mui/material';


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

const UserAvatar = ({ userInfo }) => {

    return (
        <Card sx={cardStyle}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar
                    src={userInfo.titlePhoto}
                    alt={userInfo.firstName}
                    sx={{ width: 150, height: 150, mb: 2 }}
                />
                <Typography variant="h6" component="h2" align="center">
                    {`${userInfo.firstName} ${userInfo.lastName}`}
                </Typography>
                <Typography variant="h6" component="h2" align="center">
                    { userInfo.city ? `City: ${userInfo.city}` : ''}
                </Typography>
                <Typography variant="h6" component="h2" align="center">
                    {userInfo.country ? `Country: ${userInfo.country}` : ''}
                </Typography>
            </CardContent>
        </Card>
    );

};

export default UserAvatar;