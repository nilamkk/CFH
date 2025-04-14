import { Alert, Backdrop, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, List, MenuItem, Paper, Select, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import ProblemDetailsList from "../../components/Cards/ProblemDetailsList";
import useDebounceQueryHook from "../../components/CustomHooks/DebounceQueryHook";

import { useAuth } from '../../components/AuthProvider/AuthProvider';

// const dummyProblemList = [{
//     contestId: 1,
//     index: 'A',
//     name: 'Problem A',
//     type: 'PROGRAMMING',
//     points: 1000,
//     tags: ['implementation', 'math'],
// }, {
//     contestId: 1,
//     index: 'A',
//     name: 'Problem A',
//     type: 'PROGRAMMING',
//     points: 1000,
//     tags: ['implementation', 'math'],
// }, {
//     contestId: 1,
//     index: 'A',
//     name: 'Problem A',
//     type: 'PROGRAMMING',
//     points: 1000,
//     tags: ['implementation', 'math'],
// }];

export default function SearchProblems() {

    const { token: authToken } = useAuth();

    const [userCategories, setUserCategories] = useState([]);

    // State for search input and filtered results
    const [searchTerm, setSearchTerm] = useState("");
    const [resultProblems, setResultProbelms] = useState([]);

    const [openIndex, setOpenIndex] = useState(null);
    const [openProblemDetails, setOpenProblemDetails] = useState(null);
    const [categoriesOfOpenProblem, setCategoriesOfOpenProblem] = useState([]);
    const [disableSaveProblemOption, setDisableSaveProblemOption] = useState(true);
    const [isSaveActionClicked, setIsSaveActionClicked] = useState(false);
    const [isRemoveActionClicked, setIsRemoveActionClicked] = useState(false);

    const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility
    const [selectedProblemListForAddition, setSelectedProblemListForAddition] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState('');
    const [saveActionLoading, setSaveActionLoading] = useState(false);

    const [searchError, setSearchError] = useState(null);

    const { debouncedQuery, loading: searchLoading, setLoading: setSearchLoading } = useDebounceQueryHook(searchTerm, 1500);

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbarOpen('');
    };
    // Function to handle closing the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsSaveActionClicked(false);
        setIsRemoveActionClicked(false);
        setSelectedProblemListForAddition(null);
    };
    // Function to handle opening the dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    }
    const handleSelectPorbListForAddition = (event) => {
        const problemList = event.target.value;
        setSelectedProblemListForAddition(problemList);
        console.log(problemList);
    }
    const handleProblemRemoval = async () => { /////////////////////////////////////////////////////////////////
        // categoriesOfOpenProblem
        // openProblemDetails
        const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/delete-problem-for-user`;
        const problemDTO = {
            problemid: openProblemDetails.problemid
        }
        try {
            const result = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(problemDTO)
            });
            if (!result.ok) {
                if (result.statusText)
                    throw new Error(result.statusText);
                parsedRes = await result.json();
                throw new Error(parsedRes.error.message);
            }
            // Success
            handleCloseDialog();
            setCategoriesOfOpenProblem([]);
            setSnackbarOpen('Problem removed.');
            setSaveActionLoading(false);
        } catch (error) {
            // Error
            handleCloseDialog();
            setSaveActionLoading(false);
        }

    }
    const handleProblemAddition = async () => { ///////////////////////////////////////////////////////////////
        // Add the problem to the list in backend 
        const problemDTO = {
            problemid: openProblemDetails.problemid,
            problemname: openProblemDetails.name,
            categoryid: selectedProblemListForAddition.categoryid
        }
        const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/add-problem-to-category`;
        try {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(problemDTO)
            });
            if (!result.ok) {
                if (result.statusText)
                    throw new Error(result.statusText);
                parsedRes = await result.json();
                throw new Error(parsedRes.error.message);
            }
            // Success
            handleCloseDialog();
            setCategoriesOfOpenProblem([selectedProblemListForAddition]);
            setSnackbarOpen('Problem saved.');
            setSaveActionLoading(false);
        } catch (error) {
            // Error
            setSaveActionLoading(false);
            handleCloseDialog();
        }
    }
    // Function to handle form submission
    const handleSubmit = async () => {
        if (categoriesOfOpenProblem.length > 0) {
            setSaveActionLoading(true);
            await handleProblemRemoval();
        } else {
            if (!selectedProblemListForAddition) return;
            setSaveActionLoading(true);
            await handleProblemAddition();
        }
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
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    }
                );
                if (!res.ok) {
                    throw new Error('Something went wrong during category fetch!');
                }
                const parsedRes = await res.json();
                setUserCategories(parsedRes);
            } catch (error) {
                setSearchError(error.message);
            }
        }
        fetchCategories();
    }, []);

    // Handle search query
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (debouncedQuery.trim().length === 0) return;
            const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/get-problem-by-name?name=${debouncedQuery}`;
            try {
                // Checking number of time it gets called: Just testing things 
                // console.log("query for problem by name");
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!res.ok) {
                    throw new Error('Something went wrong during search!');
                }
                const parsedRes = await res.json();
                setOpenIndex(null);
                setResultProbelms(parsedRes);
                setSearchError(null);
                setSearchLoading(false);
            } catch (error) {
                setSearchError(error.message);
                setOpenIndex(null);
                setSearchLoading(false);
            }
        }
        fetchUserInfo();
    }, [debouncedQuery]);

    // when openIndex changes then check if that problem exists for this user
    useEffect(() => {
        console.log(openProblemDetails)
        if (openIndex === null || openProblemDetails === null) return;
        const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/get-category-of-problem?problemid=${openProblemDetails.problemid}`;
        const fetchProblemCategories = async () => {
            try {
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!res.ok) {
                    throw new Error('Something went wrong during problem status fetching!');
                }
                const parsedRes = await res.json();
                setCategoriesOfOpenProblem(parsedRes);
                setDisableSaveProblemOption(false);
            } catch (error) {
                setCategoriesOfOpenProblem([]);
                setDisableSaveProblemOption(true);
            }
        }
        fetchProblemCategories();
    }, [openIndex]);

    const handleCardExpand = (index, problem) => {
        setOpenIndex(ind => ind === index ? null : index);
        setOpenProblemDetails(problem);
        setDisableSaveProblemOption(true);
        setCategoriesOfOpenProblem([]);
    }

    // Handle search input change
    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
    };

    const ProblemList = () => (
        <Box>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="item-select-label">Select List</InputLabel>
                <Select
                    labelId="item-select-label"
                    id="item-select"
                    value={selectedProblemListForAddition ? selectedProblemListForAddition : ''}
                    label="Item"
                    onChange={handleSelectPorbListForAddition}
                >
                    {userCategories.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            {item.categorytitle}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ height: '100vh', py: 3 }}>

            <Stack spacing={2} justifyContent="space-between" sx={{ height: '100%' }}>

                <TextField
                    fullWidth
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Type to search..."
                />

                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >

                    {
                        searchLoading ?
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CircularProgress sx={{ marginTop: 2 }} />
                            </Box> :
                            searchError ? <Typography>{searchError}</Typography> :
                                (searchTerm && resultProblems.length === 0) ? <Typography>No results found</Typography> :
                                    <ProblemDetailsList
                                        openIndex={openIndex}
                                        handleCardExpand={handleCardExpand}
                                        problemList={resultProblems}
                                        categoriesOfOpenProblem={categoriesOfOpenProblem}
                                        disableSaveProblemOption={disableSaveProblemOption}
                                        handleOpenDialog={handleOpenDialog}
                                        setIsRemoveActionClicked={setIsRemoveActionClicked}
                                        setIsSaveActionClicked={setIsSaveActionClicked}
                                    />
                    }

                </Paper>

            </Stack>

            {/* Dialog for adding/removing problem to category  */}
            {
                openDialog ?

                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>{isRemoveActionClicked ? 'Warning' : isSaveActionClicked ? 'Select List' : ''}</DialogTitle>
                        <DialogContent>
                            {
                                isRemoveActionClicked ?
                                    <Box>
                                        <Typography>Do you want to remove this problem from the following categories?</Typography>
                                        <Typography>{categoriesOfOpenProblem.map((item, index) =>
                                            (index < categoriesOfOpenProblem.length - 1 ? `${item.categorytitle}, ` : `${item.categorytitle}`)
                                        )}
                                        </Typography>
                                    </Box> :
                                    isSaveActionClicked ? <ProblemList /> : null
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSubmit} color="primary" startIcon={saveActionLoading ? <CircularProgress size={20} /> : null} >
                                {saveActionLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                            <Button onClick={handleCloseDialog} color="secondary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    : null
            }

            <Snackbar
                open={snackbarOpen !== ''}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    {snackbarOpen}
                </Alert>
            </Snackbar>

        </Container>
    )
}
