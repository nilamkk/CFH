import {useRef,useState,useContext,useEffect} from 'react'

import * as classes from './oldProblems.css'
import Input from '../../components/Inputs/Input'
import Button from '../../components/Buttons/Button'
import AuthContext from '../../store/auth-context'
import Categories from '../../components/oldProblems/categories'
import ShowProblems from '../../components/oldProblems/problems'
import AddProblem from '../../components/oldProblems/addProblem/addProblem'

const OldProblems=(props)=>{

    const [categories,setCategories] =useState(null)// categories is array of categories
    const [selectedCategory,setSelectedCategory]=useState(null)  //selectedCategory is an object

    const [disableAddCatBtn,setDisableAddCatBtn]=useState(false)

    const nonZeroCategories=(categories && categories.length>0)===true

    const authCntx=useContext(AuthContext)

    const titleRef=useRef(null)

    // to show the categories on loading
    useEffect(()=>{
        const fetchData=async()=>{                                  ////////////////**************** */
            let url=`/get-category?LocalId=${authCntx.localId}`
            try{
                const result= await fetch(url)
                const parsedResult=await result.json()
                if(!result.ok){
                    throw new Error(parsedResult.error.message)
                }
                console.log("get category is called")
                setCategories(parsedResult)
            }catch(error){
                console.log(error)
            }
        }
        fetchData()
    },[authCntx.localId])
    // to add new category
    const addFormSubmitHandler=async (event)=>{
        event.preventDefault()
        
        let titleOfTheCategory=titleRef.current.value.trim()
        titleOfTheCategory=titleOfTheCategory.trim().toUpperCase()

        try{
            const result= await fetch('/add-category',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    title:titleOfTheCategory,
                    LocalId:authCntx.localId
                })
            })

            const parsedRes= await result.json()
            if(!result.ok){
                throw new Error(parsedRes.error.message) //////////////////////
            }
            setCategories(parsedRes)

        }catch(error){
            console.log(error)
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


    let showAllCategories=<p>No Categories to show</p>

    if(categories && categories.length>0){
        showAllCategories=<Categories 
                            categories={categories} 
                            setCategories={setCategories} 
                            LocalId={authCntx.localId}
                            setSelectedCategory={setSelectedCategory}/>
    }

    let showSelectedCategoryProblems=<p>Not Selected Yet</p>

    if(selectedCategory ){
        showSelectedCategoryProblems=<ShowProblems selectedCategory={selectedCategory} />
    }


    return(
        <div className={classes.parentFlex}>
            Hello I am OldProblems
            
            <hr/>
            <h5>Add Category Form</h5>

            <form onSubmit={addFormSubmitHandler} > 
                <Input 
                    type="title" 
                    htmlFor="title-ip" 
                    Label="Title" 
                    refer={titleRef}
                    onChnageHandler={categoryDuplicateCheck}/>
                <Button type="submit" disable={disableAddCatBtn===true}>
                    Add Category    
                </Button>
            </form>


            <hr/>
            <h5>show categories</h5>
            {showAllCategories}


            <hr/>
            <h5>show problems</h5>  
            {showSelectedCategoryProblems}


            <hr/>
            <h5>add problems</h5>
            <AddProblem 
                LocalId={authCntx.localId} 
                nonZeroCategories={nonZeroCategories}
                categories={categories}/>

            <hr/>

        </div>
    )
}



export default OldProblems;