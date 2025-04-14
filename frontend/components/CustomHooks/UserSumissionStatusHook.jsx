import { useEffect, useState } from 'react';
import { handleError, getRequiredDataPoints } from '../../src/utils/UtilityFunctions'

export default function UserSumissionStatusHook(cfhandle) {

    const [problemRatingDataPoints, setProblemRatingDataPoints] = useState(null);
    const [submissionStatusDataPoints, setSubmissionStatusDataPoints] = useState(null);
    const [programmingLanguageDataPoints, setProgrammingLanguageDataPoints] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const url = `${import.meta.env.VITE_URI_CF_BASE_API}/user.status?handle=${cfhandle}`;
            try {
                // Checking number of time it gets called: Just testing things 
                // console.log("fetchUserInfo");

                const res = await fetch(url);
                if (!res.ok) handleError(res);
                const parsedRes = await res.json()

                // From this parsed result make three things - problem rating data points,
                // submission status data points and programming language data points
                const { aProblemRatingDataPoints,
                    aSubmissionStatusDataPoints,
                    aProgrammingLanguageDataPoints
                } = getRequiredDataPoints(parsedRes.result);

                // set the states - success
                setProblemRatingDataPoints(aProblemRatingDataPoints);
                setSubmissionStatusDataPoints(aSubmissionStatusDataPoints);
                setProgrammingLanguageDataPoints(aProgrammingLanguageDataPoints);
                setLoading(false);
                setError(null);
            } catch (error) {
                // set the states - error
                setProblemRatingDataPoints(null);
                setSubmissionStatusDataPoints(null);
                setProgrammingLanguageDataPoints(null);
                setLoading(false);
                setError(error.message);
            }
        }
        fetchData();
    }, [cfhandle]);

    return { problemRatingDataPoints, submissionStatusDataPoints, programmingLanguageDataPoints, loading, error };
}
