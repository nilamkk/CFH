import { useEffect, useState } from "react";

export default function useDebounceQueryHook( query, delay ) {
  
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handler = setTimeout(()=>{
            if( query.trim() === "" ) return;
            setLoading(true);
            setDebouncedQuery(query);
        }, delay);
        return () => clearTimeout(handler);
    }, [query, delay]);

    return {debouncedQuery, loading, setLoading};
}
