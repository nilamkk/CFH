import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid2';
import {
    Alert, Box, Button, Card, CardActionArea, CardContent, CircularProgress, Collapse, Container, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Paper, Snackbar, Stack, TextField,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import ProblemDetailsList from '../../components/Cards/ProblemDetailsList';
import { useAuth } from '../../components/AuthProvider/AuthProvider';

const ProblemLists = (props) => {

    const { token: authToken } = useAuth();

    const [problemLists, setProblemLists] = useState([]);
    const [loadingProblemLists, setLoadingProblemLists] = useState(true);  // initial loading of problem lists
    const [selectedList, setSelectedList] = useState(null); // this has to be an object
    const [selectedListProblems, setSelectedListProblems] = useState([]);
    const [loadingProblems, setLoadingProblems] = useState(false); // for loading of problems

    const [inputListName, setInputListName] = useState(""); // State to store user input
    const [loadingListOperation, setLoadingListOperation] = useState(false); // loading after add/ remove list

    const [seletedForDelete, setSelectedForDelete] = useState(null); // this is id of the list to be deleted
    const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
    const [openDeleteListDialog, setOpenDeleteListDialog] = useState(false); // State to control dialog visibility
    const [deleteActionLoading, setDeleteActionLoading] = useState(false);

    // for problem open state and removal
    const [openIndex, setOpenIndex] = useState(null);
    const [openProblemDetails, setOpenProblemDetails] = useState(null);
    const [openRemoveProblemDialog, setOpenRemoveProblemDialog] = useState(false); // State to control dialog visibility
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    // selectedList is categories of problem

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    // Function to handle closing the dialog
    const handleProblemRemovalCloseDialog = () => {
        setOpenRemoveProblemDialog(false);
    };
    // Function to handle opening the dialog
    const handleProblemRemovalOpenDialog = () => {
        setOpenRemoveProblemDialog(true);
    }
    const handleProblemRemoval = async () => {
        const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/delete-problem-from-category`;
        const problemDTO = {
            problemid: openProblemDetails.problemid,
            categoryid: selectedList.categoryid
        }
        console.log(problemDTO);
        try {
            const result = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(problemDTO)
            });
            let parsedRes;
            if (!result.ok) {
                if (result.statusText)
                    throw new Error(result.statusText);
                parsedRes = await result.json();
                throw new Error(parsedRes.error.message);
            }
            parsedRes = await result.json();
            console.log(parsedRes);
            // Success
            handleProblemRemovalCloseDialog();
            setSelectedListProblems(parsedRes); // get the remaining problems and show 
            setOpenIndex(null);
            setSnackbarOpen(true);
            setDeleteActionLoading(false);
        } catch (error) {
            // Error
            setDeleteActionLoading(false);
            handleProblemRemovalCloseDialog();
        }
    }

    // Function to handle form submission
    const handleProblemRemovalSubmit = async () => {
        setDeleteActionLoading(true);
        await handleProblemRemoval();
    }

    // Function to handle opening the dialog
    const handleOpenDialog = (event) => {
        event.stopPropagation();
        setOpenDialog(true);
    }
    // Function to handle closing the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    // Function to handle input change
    const handleInputChange = (event) => {
        setInputListName(event.target.value);
    };
    // Function to handle form submission
    const handleSubmit = async () => {
        console.log("Submitted list name: ", inputListName); // categorytitle
        if (inputListName.trim() === "") return;
        setLoadingListOperation(true);
        // Add the new list to the existing lists in backend 
        const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/add-category`;
        const categoryDTO = {
            categorytitle: inputListName
        }
        try {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(categoryDTO)
            });
            let parsedRes;
            if (!result.ok) {
                if (result.statusText)
                    throw new Error(result.statusText);
                parsedRes = await result.json();
                throw new Error(parsedRes.error.message);
            }
            // Success
            parsedRes = await result.json();
            // then update the lists state
            setProblemLists(parsedRes);
            // then close the dialog
            handleCloseDialog();
            setInputListName("");
            setLoadingListOperation(false);
        } catch (error) {
            // Error
            handleCloseDialog();
            setInputListName("");
            setLoadingListOperation(false);
        }
    }

    // Function to handle opening the dialog
    const handleListDeleteCloseDialog = () => {
        setOpenDeleteListDialog(false);
        setSelectedForDelete(null);
    }
    // Function to handle closing the dialog
    const handleOpenDeleteListDialog = (event, listId) => {
        event.stopPropagation();
        setOpenDeleteListDialog(true);
        setSelectedForDelete(listId);
    }
    const handleDeleteList = async (event) => {
        event.stopPropagation();
        console.log("Delete list with id: ", seletedForDelete);
        setLoadingListOperation(true);
        // call backend to delete list, get updated lists and set it 
        const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/delete-category`;
        const categoryDTO = {
            categoryid: seletedForDelete
        }
        try {
            const result = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(categoryDTO)
            });
            let parsedRes;
            if (!result.ok) {
                if (result.statusText)
                    throw new Error(result.statusText);
                parsedRes = await result.json();
                throw new Error(parsedRes.error.message);
            }
            // Success
            parsedRes = await result.json();
            // If the selected list was deleted, select the first available list
            if (selectedList && selectedList.categoryid === seletedForDelete) {
                setSelectedListProblems([]);
                setSelectedList(null);
                setOpenIndex(null);
            }
            // Update lists state
            setProblemLists(parsedRes);
            setOpenDeleteListDialog(false);
            setSelectedForDelete(null);
            setLoadingListOperation(false);
        } catch (error) {
            // Error
            setOpenDeleteListDialog(false);
            setSelectedForDelete(null);
            setLoadingListOperation(false);
        }
    };

    const handleListSelect = async (list) => {
        setSelectedList(list);
        setLoadingProblems(true);
        // Get problems for the selected list from backend 
        const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/get-problems-from-category?categoryid=${list.categoryid}`;
        console.log(url);
        try {
            const res = await fetch(url,
                {   method: 'GET',
                    headers: { 'Authorization': `Bearer ${authToken}`}
                }
            );
            if (!res.ok) {
                throw new Error('Something went wrong during problem fetch!');
            }
            const parsedRes = await res.json();
            console.log(parsedRes);
            setSelectedListProblems(parsedRes);
            setOpenIndex(null);
            setLoadingProblems(false);
            // setSearchError(null);
            // setSearchLoading(false);
        } catch (error) {
            // setSearchError(error.message);
            setLoadingProblems(false);
        }
    };

    const handleCardExpand = (index, problem) => {
        setOpenIndex(ind => ind === index ? null : index);
        setOpenProblemDetails(problem);
        // setDisableSaveProblemOption(true);
    }

    // Handle search query
    useEffect(() => {
        const fetchCategories = async () => {
            const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/get-categories`;
            try {
                // Checking number of time it gets called: Just testing things 
                // console.log("query for problem by name");
                const res = await fetch(url,{
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${authToken}`}
                });
                if (!res.ok) {
                    throw new Error('Something went wrong during category fetch!');
                }
                const parsedRes = await res.json();
                setProblemLists(parsedRes);
                setLoadingProblemLists(false);
            } catch (error) {
                // setSearchError(error.message);
                setLoadingProblemLists(false);
            }
        }
        fetchCategories();
    }, []);

    return (
        <Container maxWidth="xl" sx={{ height: '100vh', py: 3 }}>

            <Grid container spacing={2} sx={{ height: '100%' }}>

                {/* Main Content Area (70%) */}
                <Grid size={{ xs: 12, md: 9 }} >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom>
                            Problems
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        {
                            loadingProblems ?
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CircularProgress sx={{ marginTop: 2 }} />
                                </Box> :
                                <ProblemDetailsList
                                    openIndex={openIndex}
                                    handleCardExpand={handleCardExpand}
                                    problemList={selectedListProblems}
                                    categoriesOfOpenProblem={[selectedList]}
                                    disableSaveProblemOption={false}
                                    handleOpenDialog={handleProblemRemovalOpenDialog}
                                />
                        }
                    </Paper>
                </Grid>


                {/* Lists Sidebar (30%) */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >

                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" >

                            <Typography variant="h5" component="h2" gutterBottom>
                                Your Lists
                            </Typography>
                            <IconButton
                                edge="end"
                                aria-label="add"
                                onClick={(event) => handleOpenDialog(event)}
                            >
                                <AddIcon />
                            </IconButton>

                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {
                            loadingProblemLists ?
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CircularProgress sx={{ marginTop: 2 }} />
                                </Box> :
                                <List sx={{ flexGrow: 1 }}>
                                    {problemLists.map((list) => (
                                        <ListItem
                                            button
                                            key={list.categoryid}
                                            selected={!selectedList ? false : (selectedList.categoryid === list.categoryid)}
                                            onClick={() => handleListSelect(list)}
                                            sx={{
                                                mb: 1,
                                                bgcolor: !selectedList ? 'background.paper' : (selectedList.categoryid === list.categoryid ? 'primary.light' : 'background.paper'),
                                                borderRadius: 1,
                                                '&:hover': {
                                                    bgcolor: !selectedList ? 'action.hover' : (selectedList.categoryid === list.categoryid ? 'primary.light' : 'action.hover'),
                                                    cursor: 'pointer',
                                                }
                                            }}
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={(event) => handleOpenDeleteListDialog(event, list.categoryid)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={list.categorytitle}
                                                // secondary={`${1} items`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                        }

                    </Paper>
                </Grid>

            </Grid>



            {/* Dialog for adding problem list  */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Enter List Name</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={inputListName}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} 
                            color="primary" 
                            startIcon={loadingListOperation ? <CircularProgress size={20} /> : null}
                            disabled={inputListName.trim() === "" || loadingListOperation}>
                        {loadingListOperation ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for deleting problem lists  */}
            <Dialog open={openDeleteListDialog} onClose={handleListDeleteCloseDialog}  >
                <DialogTitle>
                    Warning
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deletion of this list will also delete all the problems. Do you really want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteList} 
                            color= "primary"  
                            startIcon={loadingListOperation ? <CircularProgress size={20} /> : null} 
                            disable = {loadingListOperation}
                            >
                        {loadingListOperation ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button onClick={handleListDeleteCloseDialog} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for removing problem from category  */}
            <Dialog open={openRemoveProblemDialog} onClose={handleProblemRemovalCloseDialog} >
                <DialogTitle>Warning</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to remove this problem from this list?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleProblemRemovalSubmit} 
                        color="primary" 
                        startIcon={deleteActionLoading ? <CircularProgress size={20} /> : null} 
                        >
                        {deleteActionLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button onClick={handleProblemRemovalCloseDialog} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    Problem removed.
                </Alert>
            </Snackbar>

        </Container>
    )
}

export default ProblemLists;