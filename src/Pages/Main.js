import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './Login'
import AdminIndex from './AdminIndex'
import Test from './test'

function Main(){
    return (
        <Router>
            <Route path="/login" exact component={Login} />
            <Route path="/" exact component={Login} />
            <Route path="/index" component={AdminIndex} />
            <Route path="/test" component={Test} />
        </Router>
    )
}

export default Main