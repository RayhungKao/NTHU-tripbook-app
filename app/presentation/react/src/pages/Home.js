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
import { toast } from 'react-toastify';

function Home(props) {
    const { search } = useLocation()
    const urlparams = queryString.parse(search)
    const history = useHistory();
    const [init, setinit] = useState(false)
    const [query, setQuery] = useState("")
    const { user, setUser } = useContext(AuthContext);

    function toLoginPage(){
        if(user === ""){
            toast("🦄 let's login!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            setTimeout(() => {
                history.push('/login')
            }, 3000)
        }
        else{
            toast("🦄 enjoy your tripbook!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            setTimeout(() => {
                history.push('/poi')
            }, 3000)
        }
    }

    return (
        <>
            {/* <Image className="bg-image" variant="top" src={require(`../images/others/nthu-campus.jpg`)} /> */}
            <br></br>
            <div className="App" style={{ height:"10%", width:"100%"}}>
                {
                    (user)?<h4>Welcome back! {user}</h4>:<h4>Welcome to Tripbook!</h4>
                }
                <h6 className="App">ready to explore?</h6>
                <br></br>
            </div>
            <Card  style={{ borderColor:"white", opacity:"0.9"}}>
                <Card.Img variant="top" className="photo" src={require('../images/others/nthu-gate.jpg')} style={{ height:"100%", width:"100%"}} />
                <Card.Body>
                    <Card.Text>
                        Several historic sites @nthu campus ...<br></br>
                        Navigate with map.<br></br>
                        Open cards everytime you get to these spots.
                    </Card.Text>
                </Card.Body>
            </Card>
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
