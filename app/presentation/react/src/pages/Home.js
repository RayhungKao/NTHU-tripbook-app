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
            <br></br>
            <div className="App" style={{ height:"10%", width:"100%"}}>
                {
                    (user)?<h4>Welcome back! {user}</h4>:<h4>Welcome to Tripbook!</h4>
                }
                <h6 className="App">ready to explore?</h6>
                <br></br>
            </div>
            <Card  style={{ borderColor:"white", opacity:"0.9"}}>
                <Card.Img variant="top" className="photo" src={require('https://nthu-tripbook-assets.s3.ap-northeast-1.amazonaws.com/others/nthu-gate.jpg')} style={{ height:"100%", width:"100%"}} />
                <Card.Body>
                    <Card.Text>
                        歡迎使用清華八景導覽程式！<br></br><br></br>
                        總共有八個景點可以抵達，每到一個新的景點會獲得相應抽卡點數。<br></br><br></br>
                        卡片內容為學長姐獨家的修課心得、系上活動及實驗室介紹，來跟同學聊聊你都抽了哪些卡吧～全部完成後還能獲得服學時數哦！
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
