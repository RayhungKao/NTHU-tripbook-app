import React, { useState, useEffect, useContext } from "react";
import queryString from 'query-string'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    useHistory
} from "react-router-dom";
import { Button, Form, Col, InputGroup, Row, FormControl, Container, Table, Image, Card } from 'react-bootstrap'
import { baseUrl } from '../config'
import { AuthContext } from "../contexts";
import { toast } from 'react-toastify';

function Login(props) {
    const { search } = useLocation()
    const urlparams = queryString.parse(search)
    const history = useHistory();
    // const [init, setinit] = useState(false)
    const [account, setAccount] = useState("")
    const [password, setPassword] = useState("")
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {

    }, []);

    function login(event) {
        // todo:  call login api
        event.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: account, password: password }),
            credentials: 'include'
        };
        fetch(baseUrl + '/api/v1/auth/login', requestOptions)
            .then(async response => {
                let result = await response.json()
                if (response.status == 200) {
                    toast.success(`Log in successfully. Welcome, ${result.account.username}`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                    });
                    // console.log(result.account.username)
                    setUser(result.account.username)
                    setTimeout(() => {
                        history.push('/poi')
                    }, 3000)
                }
                else {
                    toast.warn(`${result.message}`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                    });
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000)
                }
            })
            .catch(error => {
                toast.error("unknown error", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                });
            })
    }

    function handleShow(){

    }
    
    return (
        <>
            <br></br>
            <div className="App">
                <h4>Login</h4>
            </div>
            <br />
            <Container>
                <Row className="pb-2">
                    <Col>
                        <Form onSubmit={(e) => { login(e) }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username (e.g. 109062584)</Form.Label>
                                <Form.Control type="text" value={account} onChange={(e) => { setAccount(e.target.value) }} placeholder="Enter username" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password (e.g. 109062584)</Form.Label>
                                <Form.Control type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Enter password" />
                            </Form.Group>
                            <div align="center">
                                <Button className="w-100" variant="dark" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </>
    );
}

export default Login;
