import './addProblem.css'
import Problem from '../problem/problem'

const Results=props=>{

    return (
        <div >
            {props.data.map((item)=>{
                return (
                    <Problem 
                        key={item._id} 
                        item={item}
                        nonZeroCategories={props.nonZeroCategories}
                        categories={props.categories}
                        setCategoryOfAddedProblem={props.setCategoryOfAddedProblem}/>
                )
            })}
        </div>
    )
}


export default Results