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
        // navigate right away: the next page is the feedback ("user" is "" before login and null after logout)
        history.push(user ? '/poi' : '/login')
    }

    return (
        <div className="page">
            <div className="home-hero">
                <img src={'/assets/others/nthu-gate.webp'} alt="國立清華大學校門" />
                <div className="home-hero-text">
                    <span className="eyebrow">Tripbook@NTHU</span>
                    <h1>{(user) ? `Welcome back! ${user}` : '歡迎使用清華八景導覽程式！'}</h1>
                    <p>ready to explore?</p>
                </div>
            </div>
            <ol className="home-steps">
                <li>
                    <span className="step-num">1</span>
                    <div>
                        <strong>走訪清華八景</strong>
                        <span>總共有八個景點可以抵達，每到一個新的景點會獲得相應抽卡點數。</span>
                    </div>
                </li>
                <li>
                    <span className="step-num">2</span>
                    <div>
                        <strong>抽卡收藏</strong>
                        <span>卡片內容為學長姐獨家的修課心得、系上活動及實驗室介紹，來跟同學聊聊你都抽了哪些卡吧～</span>
                    </div>
                </li>
                <li>
                    <span className="step-num">3</span>
                    <div>
                        <strong>完成拿服學時數</strong>
                        <span>全部完成後還能獲得服學時數哦！</span>
                    </div>
                </li>
            </ol>
            <Button className="btn-tb w-100 home-cta" onClick={() => toLoginPage()}>
                NEXT →
            </Button>
        </div>
    );
}

export default Home;
