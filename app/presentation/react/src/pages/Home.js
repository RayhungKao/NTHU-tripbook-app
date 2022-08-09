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
import { Button, Alert, Nav, Form, Col, InputGroup, Row, FormControl, Container, Table, Image, Card } from 'react-bootstrap'
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
        if(user === ""){
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
            <br></br>
            <div className="App">
                {
                    (user)?<h4>Welcome back!, {user}</h4>:<h4>Welcome to NTHU campus</h4>
                }
            </div>
            <h6 className="App">ready to explore?</h6>
            <br></br>
            <Container>
                <Row>
                    <Col></Col>
                    <Col>
                        <Button className="w-100" 
                            style={{backgroundColor:'transparent', borderColor:'transparent'}}
                            onClick={() => toLoginPage()}
                        >
                            <Image variant="top" src={require(`../images/uis/main_button.png`)} style={{ height:"100%", width:"100%"}}/>
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

        </>
    );
}

export default Home;
