import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import "./component.css"


const Loading = () => {

    return (
            <div   className = "Loader" >
                <div className = "progress" >
                <CircularProgress />

                </div>
            </div>
    )
}

export default Loading