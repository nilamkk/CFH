import { Fragment,useState } from "react"

import MainNavigation from "../Navigation/MainNavigation"
import '../../App.css'
import './Layout.css'

const Layout=(props)=>{

    const [slideBarExpanded,setSlideBarExpanded]= useState(false)

    const toggleSlideBarHandler=()=>{
        setSlideBarExpanded(state=>!state)
    }

    return (
        <Fragment>

                <div className={"main-container"}>
                    {/* Have to make this slideBar like modal */}
                    <MainNavigation slideBarExpanded={slideBarExpanded}  />

                    {/* <!-- main content starts here --> */}
                    <div className={slideBarExpanded===false?"main-contents-expand":"main-contents"}>
                        {/* header here */}

                        <header className="main-header">
                            {/* <!-- This should be horizontal for mobile devices --> */}
                            <span className="slide-bar-toggler" onClick={toggleSlideBarHandler} >
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>

                            <div className="title-container">
                                <h1>CODE BUDDY</h1>
                            </div> 
                            {/* <!-- <div class="slide-bar-toggler">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div> --> */}

                        </header>
                        {props.children}
                    </div>
                    {/* <!-- main content finishes here --> */}
                    

                </div>
        </Fragment>
    )
}

export default Layout;

