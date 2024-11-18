import { useEffect, useRef, useState } from "react";
import {BehaviorSubject,of,merge,iif} from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap,map,catchError } from "rxjs/operators";

import Input from "../../Inputs/Input";
import Resultsfetched from "./results";
import Spinner from "../../Spinner/Spinner";

const AddProblem=props=>{

    const [state,setState]= useState({
        data:[],
        loading:false,
        error:null,
        noResult:false
    })
    const [subject,setSubject]= useState(null)

    const problemRef=useRef(null)

    const setCategoryOfAddedProblem=(problemId,categoryToAdd)=>{
        let newData=[...state.data]
        for(let i=0;i<newData.length;i++){
            if(newData[i]._id===problemId){
                newData[i].category=categoryToAdd
            }
        }
        setState({
            data:newData,
            loading:false,
            error:null,
            noResult:false
        })
    }

    useEffect(()=>{
        if(subject===null){
            const newSubject=new BehaviorSubject('') 
            setSubject(newSubject)
        }else{
            const observable=subject.pipe(
                map(term=>term.trim()),
                // filter(term=>term.length>=2),
                debounceTime(1000),
                distinctUntilChanged(),
                switchMap(
                    term=>
                    iif( ()=>term.length>1 ,
                    merge(
                        of({loading:true,error:null,noResult:false}),
                        fetch('https://code-buddy-2-0.onrender.com/get-problem-by-name?name='+term+'&LocalId='+props.LocalId)
                        .then((res)=>{
                            console.log("the term is here: ",term)
                            if(res.ok){
                                return res
                                        .json()
                                        .then(data=>({
                                            data,
                                            loading:false,
                                            noResult:data.length===0,
                                            error:null
                                        }))
                            }

                            return res
                                    .json()
                                    .then(data=>({
                                        data:[],
                                        loading:false,
                                        error:data   // no use
                                    }))
                        })
                    ),
                    of({loading:false,error:null,noResult:false,data:[]})
                    )
                ),
                catchError(e=>of({
                    loading:false,
                    error:"Something went wrong!!!",
                    noResult:false,
                    data:[]
                }))
            ).subscribe(newState=>{
                console.log(newState)
                setState(s=>Object.assign({},s,newState))
            })

            return ()=>{
                observable.unsubscribe()
                subject.unsubscribe()
            }
        }
    },[subject,props.LocalId])

    const onChnageHandler=(e)=>{
        if(subject){
            return subject.next(e.target.value)
        }
    }

    let Results=<Spinner/>
    if(state.error){
        Results=<p>{state.error}</p>
    }else if(state.noResult){
        Results=<p>No results to show</p>
    }else if(!state.loading && state.data.length!==0){
        Results=<Resultsfetched 
                    data={state.data}
                    setCategoryOfAddedProblem={setCategoryOfAddedProblem}
                    nonZeroCategories={props.nonZeroCategories}
                    categories={props.categories}/>
    }else if(!state.loading){
        Results=null
    }

    return(
        <div className="add-problem-container-div">
            <div className="add-pro-input-container">
                <Input 
                    type="text" 
                    htmlFor="add-problem" 
                    placeHolder="Search a problem"
                    refer={problemRef}
                    onChnageHandler={onChnageHandler}/>
            </div>


            {Results}
            
        </div>
    )


}


export default AddProblem;