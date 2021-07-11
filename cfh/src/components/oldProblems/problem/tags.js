
import '../addProblem/addProblem.css'

const Tag=({tags})=>{

    return (
        <div >
            {tags.map(
                tag=><span className="tag" 
                            key={tag}>{tag}</span>
            )}            
        </div>
    )


}


export default Tag