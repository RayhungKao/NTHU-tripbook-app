import React, { useState, useEffect, useContext } from "react";
import queryString from 'query-string'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    useHistory
} from "react-router-dom";
import { Button, Form, Col, InputGroup, Row, FormControl, Container, Table } from 'react-bootstrap'
import { baseUrl } from '../config'
import { AuthContext } from "../contexts";
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
                    props.alertSuccessFunction(`Welcome, ${result.account.username}`)
                    console.log(result.account.username)
                    // const account = {username: result.account.username, email:result.account.email}
                    setUser(result.account.username)
                    setTimeout(() => {
                        history.push('/poi')
                    }, 3000)
                }
                else {
                    props.alertFunction(`${result.message}`)
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000)
                }
            })
            .catch(error => {
                props.alertFunction("unknown error")
            })
    }

    function oauth2SignIn() {
        console.log("oauthSignIn");
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {
            'client_id': '45920062800-kpq0r0q0djo2de0ic0960ail28dj0jdg.apps.googleusercontent.com',
            'redirect_uri': `${baseUrl}/api/v1/auth/sso_callback`,
            'response_type': 'code',
            'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly',
            'include_granted_scopes': 'true',
            'prompt': 'consent'
            // 'access_type': 'offline'
            //   'state': 'pass-through value'
        };

        // Add form parameters as hidden input values.
        for (var p in params) {
            var input = document.createElement('input');
              input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
    }

    return (
        <>

            <div className="App">
                <h1>Tripbook</h1>
            </div>
            <br />
            <Container>
                <Row className="pb-2">
                    <Col></Col>
                    <Col>
                        <Form onSubmit={(e) => { login(e) }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Account (Enter your student ID, e.g. 109062584)</Form.Label>
                                <Form.Control type="text" value={account} onChange={(e) => { setAccount(e.target.value) }} placeholder="student ID" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password (Enter your birthday, e.g. 20010717)</Form.Label>
                                <Form.Control type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="birthday" />
                            </Form.Group>
                            <div align="center">
                                <Button className="w-100" variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <Button className="w-100" variant="info" onClick={() => oauth2SignIn()}>
                            Login with Google
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

        </>
    );
}

export default Login;
