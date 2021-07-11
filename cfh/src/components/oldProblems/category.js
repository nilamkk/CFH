import { useState } from "react";

import Button from "../Buttons/Button";
import DeleteItem from "../Modal/ModalContent/deleteItem";
import Modal from "../Modal/Modal";

import './common.css'

const Category=(props)=>{

    const [showModal,setShowModal]=useState(false)

    const showModalHandler=()=>{
        setShowModal(state=>true)
    }
    const removeModal=()=>{
        setShowModal(state=>false)
    }
    const clickDeleteHandler=async ()=>{
        let url=`/delete-category`
        
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
            const parsedRes= await result.json()
            if(!result.ok){
                throw new Error(parsedRes.error.message)
            }
            props.setCategories(parsedRes)
            removeModal()
        }catch(error){
            console.log(error)
        }
    }
    const showProblemsHandler=async()=>{
        let url=`/get-problems-from-category?title=${props.category.title}&LocalId=${props.LocalId}&id=${props.category._id}`
        
        try{
            const result= await fetch(url)    
            const parsedRes= await result.json()
            if(!result.ok){
                throw new Error(parsedRes.error.message)
            }
            props.setSelectedCategory(parsedRes) 

        }catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            {showModal? <Modal show={showModal} 
                                modelRemoved={removeModal}> <DeleteItem clickDeleteHandler={clickDeleteHandler} /> </Modal>  :null}

            <p className={"pointer"} onClick={showProblemsHandler}>{props.category.title}</p>
            <Button  type="button" clickHandler={showModalHandler}>X</Button>
        </div>
    )
}

export default Category;