
let customPieColors = {
    "FAILED": "#a30716",
    "OK": "#1db81d",
    "PARTIAL": "#f7dd16",
    "COMPILATION_ERROR": "#7a5b5e",
    "RUNTIME_ERROR": "#f53016",
    "WRONG_ANSWER": "#cf0808",
    "PRESENTATION_ERROR": "#959e51",
    "TIME_LIMIT_EXCEEDED": "#8669b5",
    "MEMORY_LIMIT_EXCEEDED": "#56348c",
    "IDLENESS_LIMIT_EXCEEDED": "#390e7d",
    "SECURITY_VIOLATED": "#907eab",
    "CRASHED": "#554f5e",
    "INPUT_PREPARATION_CRASHED": "#853bf5",
    "CHALLENGED": "#452c6b",
    "SKIPPED": "#f70213",
    "TESTING": "#65ebe2",
    "REJECTED": "#80a6a3",
    "unknown": "#060a0a" //Can_be_absent
}

// Define a custom error class
export class ValidationError extends Error {
    constructor(error) {
      super(error.message);
      this.fieldErrors = error.fieldErrors;
    }
}

export const handleError = async (result) => { // JS response object
    if (result.statusText)
        throw new Error(result.statusText); // fetch error
    const parsedData = await result.json();
    throw new Error(parsedData.comment); // CF error
}


//////////////////// Errors? ////////////////////
// {
//     "timestamp": "2025-03-22T19:37:09.455+00:00",
//     "status": 409,
//     "error": "RUNTIME_ERROR",
//     "message": "Email already exists",
//     "path": "uri=/signup"
// }
// {
//     "timestamp": "2025-03-22T19:37:56.571+00:00",
//     "status": 400,
//     "error": "VALIDATION_ERROR",
//     "message": "There were validation errors in your request.",
//     "path": "uri=/signup",
//     "fieldErrors": {
//         "password": "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character"
//     }
// }
/////////////////////////////////////////////////
export const handleBackendError = async (response)=>{ // JS response object
    // throw exception from here
    if (!response.ok) {
        const error = await response.json();
        if( error.fieldErrors ){
            throw new ValidationError(error);
        }
        throw new Error(error.message);
    }
}

export const getDataPoints = (objData, isColorNeeded) => {
    let dataPoints = [];
    for (let prop in objData) {
        if (parseInt(objData[prop]) === 0)
            continue;

        const oDataPoint = isColorNeeded ? {
            value: parseInt(objData[prop]),
            label: prop,
            color: customPieColors[prop]
        } : {
            value: parseInt(objData[prop]),
            label: prop
        };

        dataPoints.push(oDataPoint);
    }
    return dataPoints;
}

export const getProblemId = (problem) => {
    // contestId_index_nameFirstLetters_typeFirstLetter_points_rating   
    let problemId = ""
    if (problem.contestId) {
        problemId += problem.contestId + "-"
    }
    problemId += problem.index + "-"
    problem.name.split(" ").forEach((word) => {
        problemId += word[0]
    })
    problemId += problem.type[0]
    if (problem.points) {
        problemId += "-" + problem.points
    }
    if (problem.rating) {
        problemId += "-" + problem.rating
    }
    return problemId
}

export const getRequiredDataPoints = (result) => {
    const verdictOk = new Set();
    const mapProgLang = new Map();
    const mapSubmStatus = new Map();
    const mapProblemRatingCnt = {
        "0-499": 0,   //"0-499"
        "500-999": 0, //"500-999":0,
        "1000-1499": 0, //"1000-1499":0,
        "1500-1999": 0, //"1500-1999":0,
        "2000-2499": 0,
        "2500-2999": 0,
        "3000-3499": 0,
        ">3500": 0,
        "unrated": 0
    }

    result.forEach((item) => {

        // Submission Status Computations
        if (!mapSubmStatus[item.verdict])
            mapSubmStatus[item.verdict] = 1
        else
            mapSubmStatus[item.verdict] += 1

        // Programming language calculations
        if (!mapProgLang[item.programmingLanguage])
            mapProgLang[item.programmingLanguage] = 1
        else
            mapProgLang[item.programmingLanguage] += 1

        // Problem Rating Computations
        if (item.verdict === "OK") {

            const problemId = getProblemId(item.problem)

            if (verdictOk.has(problemId) === false) {
                if (item.problem.rating < 500) {
                    mapProblemRatingCnt["0-499"]++;
                } else if (item.problem.rating <= 999) {
                    mapProblemRatingCnt["500-999"]++;
                } else if (item.problem.rating <= 1499) {
                    mapProblemRatingCnt["1000-1499"]++;
                } else if (item.problem.rating <= 1999) {
                    mapProblemRatingCnt["1500-1999"]++;
                } else if (item.problem.rating <= 2499) {
                    mapProblemRatingCnt["2000-2499"]++;
                } else if (item.problem.rating <= 2999) {
                    mapProblemRatingCnt["2500-2999"]++;
                } else if (item.problem.rating <= 3499) {
                    mapProblemRatingCnt["3000-3499"]++;
                } else if (3500 <= item.problem.rating) {
                    mapProblemRatingCnt[">3500"]++;
                } else {
                    mapProblemRatingCnt["unrated"]++;
                }
                verdictOk.add(problemId);
            }
        }
    })

    // Convert mapProgLang => Map into Object
    let objJSONProgLang = JSON.stringify(mapProgLang);
    let objProgLang = JSON.parse(objJSONProgLang);
    const aProgrammingLanguageDataPoints = getDataPoints(objProgLang, false);
    // Convert mapSubmStatus => Map into Object
    let objJSONSubmStatus = JSON.stringify(mapSubmStatus);
    let objSubmStatus = JSON.parse(objJSONSubmStatus);
    const aSubmissionStatusDataPoints = getDataPoints(objSubmStatus, true);
    // mapProblemRatingCnt --> Object
    const aProblemRatingDataPoints = getDataPoints(mapProblemRatingCnt, false);

    return { aProblemRatingDataPoints, aSubmissionStatusDataPoints, aProgrammingLanguageDataPoints };
}