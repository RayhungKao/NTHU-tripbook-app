import React, { useState, useEffect, useContext } from "react";
import queryString from 'query-string'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    useHistory,
    Link
} from "react-router-dom";
import { Button, Alert, Nav, Form, Col, InputGroup, Row, FormControl, Container, Table } from 'react-bootstrap'
import { baseUrl } from '../config'
import { AuthContext } from "../contexts";

function Home(props) {
    const { search } = useLocation()
    const urlparams = queryString.parse(search)
    const history = useHistory();
    const [init, setinit] = useState(false)
    const [query, setQuery] = useState("")
    const { user, setUser } = useContext(AuthContext);

    function toLoginPage(){
        if(user === null){
            props.alertSuccessFunction("let's login")
            setTimeout(() => {
                history.push('/login')
            }, 3000)
        }
        else{
            props.alertSuccessFunction("enjoy your tripbook")
            setTimeout(() => {
                history.push('/poi')
            }, 3000)
        }
    }

    return (
        <>

            <div className="App">
                {
                    (user)?<h1>Hello, {user}</h1>:<h1>Welcome, nthu noobs</h1>
                }
            </div>
            <br />
            <Container>
                <Row>
                    <Col></Col>
                    <Col>
                        <Button className="w-100" variant="info" onClick={() => toLoginPage()}>
                            click to start
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

        </>
    );
}

export default Home;
