import { Padding } from "@mui/icons-material";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";


export default function UserInfo({ userInfo }) {

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

    const userCurrentRating = userInfo.rating?userInfo.rating:"Not available";
    const userCurrentRank = userInfo.rank?userInfo.rank:"Not available";
    const userMaxRank = userInfo.maxRank?userInfo.maxRank:"Not available";
    const userMaxRating = userInfo.maxRating?userInfo.maxRating:"Not available";


    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="subtitle1" color="text.secondary">Handle</Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>{userInfo.handle}</Typography>
                        <Divider sx={{ my: 1 }} />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" color="text.secondary">Rank</Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>{userCurrentRank}</Typography>
                        <Divider sx={{ my: 1 }} />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" color="text.secondary">Best Rank</Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>{userMaxRank}</Typography>
                        <Divider sx={{ my: 1 }} />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" color="text.secondary">Rating</Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>{userCurrentRating}</Typography>
                        <Divider sx={{ my: 1 }} />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" color="text.secondary">Max Rating</Typography>
                        <Typography variant="h6">{userMaxRating}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
