import Problem from '../oldProblems/problem/problem'


const ShowProblems=props=>{
    // props.selectedCategory
    let allProblems=<p>No problems yet</p>

    if(props.selectedCategory && props.selectedCategory.problems.length>0){
        allProblems= props.selectedCategory.problems.map(
            item=> {
                let obj={
                    ...item,
                    category:props.selectedCategory.title
                }
                return <Problem 
                            key={item._id}
                            item={obj}
                            nonZeroCategories={true}
                            categories={[]}
                            setCategoryOfAddedProblem={()=>{}}/>
            }
        )
    }

    return(
        <div>
            {/* <h3>{props.selectedCategory.title}</h3> */}
            {allProblems}
        </div>
    )
}


export default ShowProblems



