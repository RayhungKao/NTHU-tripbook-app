import React, { useState, useEffect, useContext } from "react";
import queryString from 'query-string'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Link
} from "react-router-dom";
import { Button, Alert, Nav, Form, Col, InputGroup, Row, FormControl, Container, Table } from 'react-bootstrap'
import { baseUrl } from '../config'
import { AuthContext } from "../contexts";

function Home(props) {
    const { search } = useLocation()
    const urlparams = queryString.parse(search)
    const [init, setinit] = useState(false)
    const [query, setQuery] = useState("")
    const { user, setUser } = useContext(AuthContext);

    return (
        <>

            <div className="App">
                {
                    (user)?<h1>Hello, {user}</h1>:<h1>Please log in</h1>
                }
            </div>
            <br />
            <Container>
                <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
            </Container>

        </>
    );
}

export default Home;
