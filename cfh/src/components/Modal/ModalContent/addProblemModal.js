import { useState,useContext } from "react";

import AuthContext from "../../../store/auth-context";
import Button from "../../Buttons/Button";
import Select from "../../Select/Select"; 
import OpenSpinner from '../../Spinner/OpenSpinner'

const AddProblemModal=(props)=>{

    const [selectedCat,setSelectedCat]=useState(null)
    const [loading,setLoading]=useState(false)

    const authCntx=useContext(AuthContext)

    const submitHnadler= async (e)=>{
        e.preventDefault()
        // add prob to cat NEED: problemId in props, title=selectedCat, LocalId=authCntx.localId (post)
        try{
            setLoading(true)
            props.setProblemAddStatus("addingProblem")
            const result=await fetch('https://code-buddy-cfh.herokuapp.com/add-problems-to-category',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    LocalId:authCntx.localId,
                    title:selectedCat,
                    problemId:props.problemId
                })
            })

            let parsedResult
            if(!result.ok){
                if(result.statusText)
                    throw new Error(result.statusText)
                parsedResult=await result.json()
                throw new Error(parsedResult.error.message)
            }
            parsedResult=await result.json()

            setLoading(false)
            props.setProblemAddStatus("Successfully added !!!")
            props.setCategoryOfAddedProblem(props.problemId,selectedCat) 
        }catch(error){
            props.setProblemAddStatus("Failed to add !!!")
            setLoading(false)
        }
    }

    return(
        <div>
            {loading?<OpenSpinner/>:null}
            <form onSubmit={submitHnadler}>
                <p>Problem Name: {props.problemName}</p>
                <Select categories={props.categories} 
                        state={selectedCat}
                        setState={setSelectedCat}/>
                <Button type="submit" colorName={"Blue"}>ADD</Button>
            </form>
        </div>
    )
}

export default AddProblemModal;