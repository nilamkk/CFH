
import {useState} from 'react'
import { Fragment } from 'react'

import '../addProblem/addProblem.css'
import Tag from './tags'
import Button from '../../Buttons/Button'
import Modal from '../../Modal/Modal'
import AddProblemModal from '../../Modal/ModalContent/addProblemModal'
import Success from '../../Modal/ModalContent/success'

const Problem=({item,nonZeroCategories,categories,setCategoryOfAddedProblem})=>{

    const [clicked,setClicked]=useState(false)
    const [showModal,setShowModal]=useState(false)
    const [isProblemAdded,setIsProblemAdded]=useState(false)

    const onCLickHandler=()=>{
        setClicked(state=>!state)
    }
    const saveProblemHandler=(e)=>{
        // bring the modal
        setShowModal(state=>true)
        e.stopPropagation();
    }
    const removeModal=()=>{
        setShowModal(state=>false)
    }

    let ModalContent= <Success removeModal={removeModal}/>

    if( !isProblemAdded ){
        ModalContent= <AddProblemModal  
                        problemName={(item.index? (item.index+". "):"")+item.name}
                        categories={categories}
                        problemId={item._id}
                        setCategoryOfAddedProblem={setCategoryOfAddedProblem}
                        setIsProblemAdded={setIsProblemAdded}/>
    }


    // https://codeforces.com/contest/1540/problem/A 
    let linkOfProblem=`https://codeforces.com/contest/${item.contestId}/problem/${item.index}`

    return (

        <Fragment>
            {showModal? <Modal show={showModal} 
                                modelRemoved={removeModal}> {ModalContent} </Modal>  :null}

            <div className="just-for-timepass" onClick={onCLickHandler}>
                
                <p >{item.index? (item.index+". ") :null  }{item.name}</p>
                
                {clicked? <p>{linkOfProblem}</p> :null}
                
                {clicked?  <p>{item.points}</p> :null}
                
                {clicked?  (item.category? (<p>{item.category}</p>) :  <Button 
                                                                        type="button" 
                                                                        clickHandler={saveProblemHandler}
                                                                        disable={nonZeroCategories===false}>
                                                                            Save problem
                                                                        </Button>)  :  null  }
                {clicked?  <Tag tags={item.tags}/> :null}
                
                {/* {clicked? <p>{item.index}</p> :null} */}
            </div>
        </Fragment>
    )


}

export default Problem