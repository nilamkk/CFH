import { useEffect, useRef, useState } from "react";
import {BehaviorSubject,of,merge,iif} from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap,map,catchError } from "rxjs/operators";

import Input from "../../Inputs/Input";
import Resultsfetched from "./results";


const AddProblem=props=>{

    const [state,setState]= useState({
        data:[],
        loading:false,
        error:null,
        noResult:false
    })
    const [subject,setSubject]= useState(null)

    const problemRef=useRef(null)

    ////////////////////////////////////////////////////////////////////
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
        if(subject==null){
            const newSubject=new BehaviorSubject('')////////////////
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
                        fetch('/get-problem-by-name?name='+term+'&LocalId='+props.LocalId)
                        .then((res)=>{
                            console.log("the term is: ",term)
                            if(res.ok){
                                return res
                                        .json()
                                        .then(data=>({
                                            data,
                                            loading:false,
                                            noResult:data.length===0
                                        }))
                            }

                            return res
                                    .json()
                                    .then(data=>({
                                        data:[],
                                        loading:false,
                                        error:data ////////////////////////////////////
                                    }))
                        })
                    ),
                    of({loading:false,error:null,noResult:false,data:[]})
                    )
                ),
                catchError(e=>({
                    loading:false,
                    error:'Error occured!!!'
                }))
            ).subscribe(newState=>{
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

    let Results=<p>LOADING...</p>
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
        <div>
            <Input 
                type="text" 
                htmlFor="add-problem" 
                placeHolder="Search a problem"
                refer={problemRef}
                onChnageHandler={onChnageHandler}/>

            {Results}
            
        </div>
    )


}


export default AddProblem;