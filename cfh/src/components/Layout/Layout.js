import { Fragment } from "react"

import MainNavigation from "../Navigation/MainNavigation"
import '../../App.css'

const Layout=(props)=>{
    return (
        <Fragment>
            
            <MainNavigation/>
            <hr/>
            <main>
                {props.children}
            </main>

        </Fragment>
    )
}

export default Layout;

