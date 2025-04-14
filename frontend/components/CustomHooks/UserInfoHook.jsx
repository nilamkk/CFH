import { useEffect, useState } from 'react'

import { handleError } from '../../src/utils/UtilityFunctions'

export default function UserInfo(cfhandle) {

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( ()=>{
        const fetchUserInfo = async () => {
            const url = `${import.meta.env.VITE_URI_CF_BASE_API}/user.info?handles=${cfhandle}`;
            try{
                // Checking number of time it gets called: Just testing things 
                // console.log("fetchUserInfo");
        
                const res = await fetch(url);
                if(!res.ok) handleError(res);
                const parsedRes= await res.json()
                
                setUserInfo(parsedRes.result[0]);
                setLoading(false);
                setError(null);
    
            }catch(error){
                setUserInfo(null);
                setLoading(false);
                setError(error.message);
            }
        }
        fetchUserInfo();
    }, [cfhandle]);

  return { userInfo, loading, error };
}
