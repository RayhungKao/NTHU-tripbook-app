import React, { useState, useEffect } from "react";
import { AuthContext } from "./contexts";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import { Alert, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import logo from './logo2.png';
import Home from './pages/Home'
import Login from './pages/Login'
import Account from './pages/Account'
import RegisterAccount from './pages/Register'
import PoI from './pages/PoI'
import { baseUrl } from './config'
import './App.css';

function App() {
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [user, setUser] = useState("");
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    if (!user) account()
    if (!userInfo) accountInfo()

  }, [user, userInfo]);

  async function account() {
    if (user) {
      return
    }
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };
    fetch(`${baseUrl}/api/v1/account`, requestOptions)
      .then(async response => {
        let result = await response.json()
        if (response.status == 200) {
          setUser(result.username)
        }
      })
      .catch(error => {
        // props.alertFunction("unknown error")
      })
  }

  async function accountInfo() {
    if (user == "") {
      return
    }
    console.log(user)
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    };
    fetch(baseUrl + `/api/v1/account/${user}`, requestOptions)
      .then(async response => {
        let result = await response.json()
        if (response.status === 200) {
          setUserInfo(result)
          console.log("fetch account info")
        }
        else {
          console.log(`${result.message}`)
        }
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  function logout() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    };
    fetch(baseUrl + '/api/v1/auth/logout', requestOptions)
      .then(async response => {
        let result = await response.json()
        if (response.status == 200) {
          alertSuccessFunction(`log out successfully`)
          setUser(null)
          setTimeout(() => {
            window.location.replace("/login");
          }, 3000)
        }
        else {
          alertFunction(`${result.message}`)
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        }
      })
      .catch(error => {
        alertFunction("unknown error")
      })
  }

  function alertFunction(data) {
    setAlertMessage(data)
    setTimeout(() => {
      setAlertMessage(null)
    }, 3000)
  }
  function alertSuccessFunction(data) {
    setSuccessMessage(data)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }
  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous" />
      <AuthContext.Provider value={{ user, setUser, userInfo, setUserInfo }}>
        <Router>
          <div style={{ height: "100vh" }}>
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="/">
                <img
                  alt=""
                  src={logo}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{' '}
                Tripbook
              </Navbar.Brand>
              <Nav className="container-fluid">
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  {
                    (user) ? <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item> : <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                  }
                  {
                    (user) ? <NavDropdown.Item href="/account">setting</NavDropdown.Item> : <NavDropdown.Item href="/register">Create Account</NavDropdown.Item>
                  }

                </NavDropdown>
                <Nav.Item className="ml-auto">
                  {
                    (user) ? <Nav.Link>Hi, {user}</Nav.Link> : ""
                  }
                </Nav.Item>
              </Nav>
            </Navbar>
            {alertMessage ?
              <Alert variant={'danger'} style={{ marginLeft: "20%", marginRight: "20%" }}>
                {alertMessage}
              </Alert>
              : ""
            }
            {successMessage ?
              <Alert variant={'info'} style={{ marginLeft: "20%", marginRight: "20%" }}>
                {successMessage}
              </Alert>
              : ""
            }

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/poi">
                <PoI setLoading={setLoading} alertFunction={alertFunction} alertSuccessFunction={alertSuccessFunction} />
              </Route>
              <Route path="/register">
                <RegisterAccount setLoading={setLoading} alertFunction={alertFunction} alertSuccessFunction={alertSuccessFunction} />
              </Route>
              <Route path="/account">
                <Account setLoading={setLoading} alertFunction={alertFunction} alertSuccessFunction={alertSuccessFunction} />
              </Route>
              <Route path="/login">
                <Login setLoading={setLoading} alertFunction={alertFunction} alertSuccessFunction={alertSuccessFunction} />
              </Route>
              <Route path="/">
                <Home setLoading={setLoading} alertFunction={alertFunction} alertSuccessFunction={alertSuccessFunction} />
              </Route>
            </Switch>
          </div>
        </Router >

      </AuthContext.Provider >
    </>
  );
}

export default App;
