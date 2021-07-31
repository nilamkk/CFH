import {useRef,useState,useContext,useEffect} from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faMinus } from "@fortawesome/free-solid-svg-icons";

import './oldProblems.css'
import Input from '../../components/Inputs/Input'
import Button from '../../components/Buttons/Button'
import AuthContext from '../../store/auth-context'
import Categories from '../../components/oldProblems/categories'
import ShowProblems from '../../components/oldProblems/problems'
import AddProblem from '../../components/oldProblems/addProblem/addProblem'
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import OpenSpinner from '../../components/Spinner/OpenSpinner';

const OldProblems=(props)=>{

    const [categories,setCategories] =useState(null)             // categories is array of categories
    const [selectedCategory,setSelectedCategory]=useState(null)  //selectedCategory is an object
    const [showAddCatForm,setShowAddCatForm]= useState(false)   
    const [disableAddCatBtn,setDisableAddCatBtn]=useState(false) 
    const [oldError,setOldError ] =useState(null)
    const [loading,setLoading]= useState(false)

    const nonZeroCategories=(categories && categories.length>0)===true

    const authCntx=useContext(AuthContext)

    const titleRef=useRef(null)

    const modelReHandlerErr=(e)=>{
        e.stopPropagation()
        setOldError(false)                                                          //////////////// error is there but removed modal
    }

    // to show the categories on loading
    useEffect(()=>{
        const fetchData=async()=>{                                  
            let url=`https://code-buddy-cfh.herokuapp.com/get-category?LocalId=${authCntx.localId}`
            try{
                const result= await fetch(url)
                let parsedResult
                if(!result.ok){
                    if(result.statusText)
                        throw new Error(result.statusText)
                    parsedResult=await result.json()
                    throw new Error(parsedResult.error.message)
                }
                parsedResult=await result.json()

                setCategories(parsedResult)
            }catch(error){
                setOldError(error.message)
            }
        }
        fetchData()
    },[authCntx.localId])
    // to add new category
    const addFormSubmitHandler=async (event)=>{
        event.preventDefault()
        setLoading(true)
        // only valid titleOfTheCategory will come
        let titleOfTheCategory=titleRef.current.value.trim()
        titleOfTheCategory=titleOfTheCategory.trim().toUpperCase()

        try{
            const result= await fetch('https://code-buddy-cfh.herokuapp.com/add-category',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    title:titleOfTheCategory,
                    LocalId:authCntx.localId
                })
            })

            let parsedRes
            if(!result.ok){
                if(result.statusText)
                    throw new Error(result.statusText)
                parsedRes= await result.json()
                throw new Error(parsedRes.error.message) 
            }
            setLoading(false)
            parsedRes= await result.json()
            setCategories(parsedRes)
            titleRef.current.value=""
            setOldError(null)
        }catch(error){
            setLoading(false)
            console.log(error.message)                                  //////////////////////// to show & set error
            setOldError(error.message)
        }


    }
    // check if cat already exist
    const categoryDuplicateCheck=(e)=>{
        const cat=e.target.value.trim().toUpperCase()
        if(cat.length===0){
            setDisableAddCatBtn(true)
            return;
        }

        let Exist=false;

        for(let i=0;i<categories.length;i++){
            if(categories[i].title.toUpperCase()===cat){
                Exist=true;
                break;
            }
        }

        if(Exist){
            setDisableAddCatBtn(true)
        }else{
            setDisableAddCatBtn(false)
        }

    }

    const showAddCatFormHandler=(event)=>{
        event.stopPropagation()
        setShowAddCatForm(state=>!state)
    }

    let showAllCategories=<p>No Categories to show</p>

    if(categories && categories.length>0){     
        showAllCategories=<Categories 
                            categories={categories} 
                            setCategories={setCategories} 
                            LocalId={authCntx.localId}
                            setSelectedCategory={setSelectedCategory}
                            selectedCategory={selectedCategory}/>
    }

    let showSelectedCategoryProblems=<p>Not Selected Yet</p>

    if(selectedCategory ){
        // showSelectedCategoryProblems=<ShowProblems selectedCategory={selectedCategory} />
        showSelectedCategoryProblems=(
            <div className="OldProblems-left-side-contents">
                <p className="text-primary font-weight-bold" > {selectedCategory.title} </p>

                <ShowProblems selectedCategory={selectedCategory} /> 

            </div>
        ) 
    }


    return(

        <div className="OldProblems-container">

            {loading?<OpenSpinner/>:null}


            {oldError? <ErrorHandler errorMessage={oldError} modelRemovedHandler={modelReHandlerErr} />  : null }
            
            {/* left side contents part starts here */}

            {selectedCategory?showSelectedCategoryProblems:(
                <div className="OldProblems-left-side-contents">
                    <p className="text-primary font-weight-bold" > Add New Problem </p>

                    <AddProblem 
                        LocalId={authCntx.localId} 
                        nonZeroCategories={nonZeroCategories}
                        categories={categories}/>
                </div>

            )}



            {/* left side contents part finishes here */}


            <div className="OldProblems-right-side-categories text-primary">

                <div className="side-categories-header">
                    <span className="font-weight-bold font-increase-size">Your Categories</span>
                    <span className="spanaa" onClick={showAddCatFormHandler}> <FontAwesomeIcon icon={ showAddCatForm?  faMinus :faPlus      } /> </span>
                </div>

                {showAddCatForm?(
                
                <div className="side-categories-form">   
                    <form onSubmit={addFormSubmitHandler} > 
                        <Input 
                            type="title" 
                            htmlFor="title-ip" 
                            Label="Title" 
                            refer={titleRef}
                            onChnageHandler={categoryDuplicateCheck}/>
                        <Button type="submit" disable={disableAddCatBtn===true} colorName={"Blue"}>
                            Add Category    
                        </Button>
                    </form>
                </div>
                
                ):null}

                <div className="List-of-all-categories">
                    {showAllCategories}
                </div>

            </div>

        </div>
    )
}



export default OldProblems;