import Category from "./category";


const Categories=(props)=>{
        
        let allCategories=<p>Spinner</p>

        if( props.categories){
            allCategories= props.categories.map(
                item=><Category 
                            key={item._id} 
                            category={item} 
                            setCategories={props.setCategories}
                            LocalId={props.LocalId}
                            setSelectedCategory={props.setSelectedCategory}/>
                )
        }
    
        return(
            <div>
                {allCategories}
            </div>
        )
}

export default Categories;