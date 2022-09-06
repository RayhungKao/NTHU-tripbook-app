import React, { useState, useEffect } from "react";
import { AuthContext } from "./contexts";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import { Alert, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap'
import logo from './images/others/tripbook-logo.png';
import Home from './pages/Home'
import Login from './pages/Login'
import Account from './pages/Account'
import RegisterAccount from './pages/Register'
import PoI from './pages/PoI'
import { baseUrl } from './config'
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [user, setUser] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [googleMapApiKey, setGoogleMapApiKey] = useState("");

  useEffect(() => {
    if (!googleMapApiKey) get_google_map_api_key();
    return () => {
      // console.log('fetch google map api key');
    }
  }, [googleMapApiKey])
  
  useEffect(() => {
    if (!user) account()
    if (!userInfo) accountInfo()

  }, [user, userInfo]);


  async function get_google_map_api_key() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };
    fetch(`${baseUrl}/api/v1/google`, requestOptions)
      .then(async response => {
        let result = await response.json()
        if (response.status == 200) {
          setGoogleMapApiKey(result.message)
        }
      })
      .catch(error => {
        // props.alertFunction("unknown error")
      })
  }

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
    // console.log(user)
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
          // console.log("fetch account info")
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
          toast.success("Log out successfully", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          setUser(null)
          setTimeout(() => {
            window.location.replace("/login");
          }, 3000)
        }
        else {
          toast.warn(`${result.message}`, {
            position: "top-right",
            autoClose: 3000,
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

  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous" />
      <AuthContext.Provider value={{ user, setUser, userInfo, setUserInfo, googleMapApiKey, setGoogleMapApiKey}}>
        <div>
          <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover/>
        </div>
        <Router>
          <div style={{ height: "100vh" }}>
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="/">
                <Image alt="" variant="top" src={logo} style={{ height:"30px", width:"30px"}}/>{' '}
                Tripbook
              </Navbar.Brand>
              <Nav className="container-fluid">
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  {
                    (user) ? <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item> : <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                  }
                  {
                    (user) ? "" : <NavDropdown.Item href="/register">Create Account</NavDropdown.Item>
                  }

                </NavDropdown>
                <Nav.Item className="ml-auto">
                  {
                    (user) ? <Nav.Link>Hi, {user}</Nav.Link> : <Nav.Link>please login</Nav.Link>
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
                <PoI setLoading={setLoading} />
              </Route>
              <Route path="/register">
                <RegisterAccount setLoading={setLoading} />
              </Route>
              <Route path="/account">
                <Account setLoading={setLoading} />
              </Route>
              <Route path="/login">
                <Login setLoading={setLoading} />
              </Route>
              <Route path="/">
                <Home setLoading={setLoading} />
              </Route>
            </Switch>
          </div>
        </Router >

      </AuthContext.Provider >
    </>
  );
}

export default App;
