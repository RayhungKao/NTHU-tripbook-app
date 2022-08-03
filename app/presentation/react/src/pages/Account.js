import React, { useState, useEffect, useContext } from "react";
import queryString from 'query-string'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    useHistory
} from "react-router-dom";
import { Button, Form, Modal, Container, Table, Row, Col } from 'react-bootstrap'
import { baseUrl } from '../config'
import { AuthContext } from "../contexts";

function Account(props) {
    const { search } = useLocation()
    const urlparams = queryString.parse(search)
    const history = useHistory();
    const [init, setinit] = useState(false)
    const { user, setUser } = useContext(AuthContext);
    const { userInfo, setUserInfo } = useContext(AuthContext);

    return (
        <>
            <div className="App">
                <br></br>
                <h5>Account Info</h5>
                <br />
                <Row className="justify-content-center">
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th> username</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{(user)?"guest calendar":"my calendar"}</td>
                            <td>{(user)?"guest calendar":"my calendar"}</td>
                            <td>{(user)?"guest calendar":"my calendar"}</td>
                        </tr>
                    </tbody>
                </Table>
                </Row>
                
            </div>
        </>
    );
}

export default Account;
