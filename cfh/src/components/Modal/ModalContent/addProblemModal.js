import { useState,useContext } from "react";

import AuthContext from "../../../store/auth-context";
import Button from "../../Buttons/Button";
import Select from "../../Select/Select"; 

const AddProblemModal=(props)=>{

    const [selectedCat,setSelectedCat]=useState(null)

    const authCntx=useContext(AuthContext)

    const submitHnadler= async (e)=>{
        e.preventDefault()
        // add prob to cat NEED: problemId in props, title=selectedCat, LocalId=authCntx.localId (post)
        try{
            const result=await fetch('/add-problems-to-category',{
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
    
            const parsedResult=await result.json()
            if(!result.ok){
                throw new Error(parsedResult.error.message)
            }
            
            props.setIsProblemAdded(true)
            props.setCategoryOfAddedProblem(props.problemId,selectedCat)
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div>
            <form onSubmit={submitHnadler}>
                <p>Problem Name: {props.problemName}</p>
                <Select categories={props.categories} 
                        state={selectedCat}
                        setState={setSelectedCat}/>
                <Button type="submit">ADD</Button>
            </form>
        </div>
    )
}

export default AddProblemModal;