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
import { baseUrl, demoMode } from '../config'
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

    const [submitting, setSubmitting] = useState(false)
    const [loginError, setLoginError] = useState("")

    function login(event) {
        // todo:  call login api
        event.preventDefault()
        setSubmitting(true)
        setLoginError("")
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
                        autoClose: 3500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                    });
                    // console.log(result.account.username)
                    setUser(result.account.username)
                    sessionStorage.setItem("user", result.account.username)
                    // go straight to the map; the welcome toast shows there
                    history.push('/poi')
                }
                else {
                    // show the error next to the form and keep what was typed
                    setLoginError(`${result.message}`)
                    setSubmitting(false)
                }
            })
            .catch(error => {
                setLoginError("unknown error")
                setSubmitting(false)
            })
    }

    function handleShow(){

    }
    
    return (
        <div className="page">
            <h1 className="page-title">Login</h1>
            <p className="page-subtitle">ready to explore?</p>
            {demoMode && <div className="demo-hint">Demo 帳號：<code>demo</code>　密碼：<code>tripbook-demo</code></div>}
            <Container className="surface">
                <Row>
                    <Col>
                        <Form onSubmit={(e) => { login(e) }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username (e.g. 109062584)</Form.Label>
                                <Form.Control type="text" value={account} onChange={(e) => { setAccount(e.target.value); setLoginError("") }} placeholder="Enter your student Id" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password (e.g. 109062584)</Form.Label>
                                <Form.Control type="password" value={password} onChange={(e) => { setPassword(e.target.value); setLoginError("") }} placeholder="Enter your student Id" />
                            </Form.Group>
                            <div align="center">
                                {loginError && <div className="form-error" role="alert">{loginError}</div>}
                                <Button className="btn-tb w-100" type="submit" disabled={submitting}>
                                    {submitting ? "Logging in…" : "Submit"}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
