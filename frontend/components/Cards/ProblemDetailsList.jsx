import { Card, CardActionArea, CardContent, Collapse, Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


export default function ProblemDetailsList({ problemList, openIndex, handleCardExpand, categoriesOfOpenProblem, disableSaveProblemOption, 
  handleOpenDialog, setIsRemoveActionClicked, setIsSaveActionClicked }) {

  const handleSaveOptionButton = (event, problem) => {
    event.stopPropagation();

    if (categoriesOfOpenProblem.length > 0) {
      console.log('User wants to remove problem', problem);
      if( setIsRemoveActionClicked )
        setIsRemoveActionClicked(true);
      handleOpenDialog();
    } else {
      console.log('User wants to add problem', problem);
      if( setIsSaveActionClicked )
        setIsSaveActionClicked(true);
      handleOpenDialog();
    }
    console.log('Categories of the problem:', categoriesOfOpenProblem);
  }

  return (
    <Stack spacing={2}>
      {problemList.map((item, index) => (

        <Card key={index} variant='outlined' >
          <CardActionArea onClick={() => handleCardExpand(index, item)}>

            <CardContent>

              <Typography variant="body1">{`${item.index}. ${item.name}`}</Typography>

              <Collapse in={openIndex === index} timeout="auto" unmountOnExit>

                <Stack spacing={2} >
                  <Divider />

                  <Typography>
                    Points: {item.points}
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    {item.tags.map((tag, index) => (
                      <Paper key={index} variant="outlined" sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 2 }}>
                        {tag}
                      </Paper>
                    ))}
                  </Stack>
                </Stack>
              </Collapse>

            </CardContent>
          </CardActionArea>

          <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
            <Stack direction="row" justifyContent={'space-between'} p={1}>
              <IconButton
                edge="end"
                aria-label="save"
                disabled={disableSaveProblemOption}
                onClick={(event) => handleSaveOptionButton(event, item)}
                color={categoriesOfOpenProblem.length > 0 ? 'success' : ''}
              >
                <BookmarkRoundedIcon/>
              </IconButton>

              <IconButton
                component="a"
                href={`https://codeforces.com/contest/${item.contestId}/problem/${item.index}`}
                target="_blank"
                rel="noopener noreferrer"
                edge="end"
                aria-label="go to"
              >
                <ExitToAppIcon />
              </IconButton>
            </Stack>
          </Collapse>

        </Card>
      ))}
    </Stack>
  )
}
