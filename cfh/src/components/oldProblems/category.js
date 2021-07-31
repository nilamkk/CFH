import { useState } from "react";

import DeleteItem from "../Modal/ModalContent/deleteItem";
import Modal from "../Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ErrorHandler from "../ErrorHandler/ErrorHandler";
import OpenSpinner from "../Spinner/OpenSpinner";

import './common.css'

const Category=(props)=>{

    const [showModal,setShowModal]=useState(false)
    const [showProblemsError,setShowProblemsError]=useState(false) // error for show problems
    const [loading,setLoading]= useState(false)
    // const [deleteContentShow,setDeleteContentShow]=useState(false) // either attampt to delete or show problems

    const showModalHandler=()=>{
        setShowModal(state=>true)
    }
    const removeModal=()=>{
        setShowModal(state=>false)
    }
    const clickDeleteHandler=async ()=>{
        let url=`https://code-buddy-cfh.herokuapp.com/delete-category`
        removeModal()
        setLoading(true)
        try{
            const result= await fetch(url,{
                method:"DELETE",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    LocalId:props.LocalId,
                    title:props.category.title,
                    id:props.category._id
                })
            })    
            let parsedRes
            if(!result.ok){
                if(result.statusText)
                    throw new Error(result.statusText)
                parsedRes= await result.json()
                throw new Error(parsedRes.error.message)
            }
            parsedRes= await result.json()

            props.setSelectedCategory(null) 
            props.setCategories(parsedRes)
            setShowProblemsError(null)
            setLoading(false)
        }catch(error){
            setShowProblemsError(error.message)
            setLoading(false)
        }
    }
    const showProblemsHandler=async()=>{

        if(props.selectedCategory && props.selectedCategory.title===props.category.title){
            console.log("Same cat selected!!!")
            // remove the cat from the show list
            props.setSelectedCategory(null)
            return;
        }else{
            console.log("Different selected!!!")
        }
        setLoading(true)
        let url=`https://code-buddy-cfh.herokuapp.com/get-problems-from-category?title=${props.category.title}&LocalId=${props.LocalId}&id=${props.category._id}`
        
        try{
            const result= await fetch(url)                  ////////////////////////////////
            
            let parsedRes
            if(!result.ok){
                if(result.statusText)
                    throw new Error(result.statusText)
                parsedRes= await result.json()
                throw new Error(parsedRes.error.message)
            }
            parsedRes= await result.json()

            props.setSelectedCategory(parsedRes)
            setLoading(false) 
            setShowProblemsError(null)
        }catch(error){
            console.log(error)
            setLoading(false)
            setShowProblemsError(error.message)
        }
    }

    let category_calss="side-bar-category-element"
    if(props.selectedCategory && props.category.title===props.selectedCategory.title){
        category_calss+=" give-background-color"
    }

    return (
        <div className={category_calss}>

            {loading?<OpenSpinner/>:null}
            {showProblemsError?<ErrorHandler errorMessage={showProblemsError} modelRemovedHandler={()=>setShowProblemsError(null) }  />:null}

            {showModal? <Modal show={showModal} 
                                modelRemoved={removeModal}> <DeleteItem clickDeleteHandler={clickDeleteHandler} /> </Modal>  :null}

            <span className={"pointer"} onClick={showProblemsHandler}> {props.category.title} </span>
            <span className={"pointer second"} onClick={showModalHandler} > <FontAwesomeIcon icon={faTrash} /> </span>
        </div>
    )
}

export default Category;