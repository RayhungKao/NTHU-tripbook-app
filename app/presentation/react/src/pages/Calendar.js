import React, { useState, useEffect, useContext, useRef } from "react";
import queryString from 'query-string'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Link
} from "react-router-dom";
import { Button, Tooltip, Table, Form, Col, Modal, Row, OverlayTrigger, Container, CloseButton } from 'react-bootstrap'
import { baseUrl } from '../config'
import { AuthContext } from "../contexts";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
function CalendarView(props) {
    const { search } = useLocation()
    const localizer = momentLocalizer(moment)
    const urlparams = queryString.parse(search)
    const [init, setinit] = useState(false)
    const [query, setQuery] = useState("")
    const [myEventsList, setMyEventsList] = useState([])
    const { user, setUser } = useContext(AuthContext);
    const { userInfo, setUserInfo } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const { calendars, setCalendars } = useContext(AuthContext)
    const handleClose = () => setShow(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [stime, setstime] = useState("");
    const [etime, setetime] = useState("");
    const [selected, setSelected] = useState([])
    const [curTitle, setCurTitle] = useState("")

    useEffect(() => {
        if(urlparams.cid && !init){
            if(urlparams.api_key){
                setMyEventsList([])
                if (myEventsList.length == 0) {
                    getCalendarWithKey(urlparams.cid, urlparams.api_key)
                    setinit(true)
                }
            }
            else if(user){
                setMyEventsList([])
                if (myEventsList.length == 0) {
                    getCalendar(urlparams.cid)
                    setinit(true)
                }
            }
        }
        
        if(init && calendars && urlparams.cid) getCurrentCalendar()
    }, [user, urlparams, init, myEventsList]);


    async function getCalendar(cid) {
        console.log(cid)
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        };
        let c = randomColor(cid)
        fetch(`${baseUrl}/api/v1/calendars/${cid}`, requestOptions)
            .then(async response => {
                let result = await response.json()
                if (response.status === 200) {
                    if (result.calendar) {
                        let events = result.calendar.events.map(e => ({
                            title: e.title,
                            id: e.id,
                            hexColor: c,
                            description: e.description,
                            start: new Date(parseInt(e.start_time)),
                            end: new Date(parseInt(e.end_time)),
                            delete: deleteEvent
                        }));
                        setMyEventsList([...myEventsList, ...events])
                    }
                }
                else {
                    props.alertFunction(`${result.message}`)
                }
            })
            .catch(error => {
                props.alertFunction(error.message)
            })
    }

    async function addEvent() {
        let start_time = moment(stime).toDate().getTime();
        let end_time = moment(etime).toDate().getTime()
        if (start_time > end_time) {
            window.alert("start time must be smaller than end time!")
            return
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "title": title,
                "start_time": start_time.toString(),
                "end_time": end_time.toString(),
                "description": description
            })
        };
        fetch(`${baseUrl}/api/v1/calendars/${urlparams.cid}/events?action=add`, requestOptions)
            .then(async response => {
                let result = await response.json()
                if (response.status === 200) {
                    props.alertSuccessFunction(result.message)
                }
                else {
                    props.alertFunction(`${result.message}`)
                }
            })
            .catch(error => {
                props.alertFunction(error.message)
            })
        setShow(false)
        setinit(false)
    }

    async function deleteEvent(event_id) {
        let userConfirm = window.confirm("are you sure to delete events?")
        if (!userConfirm) return
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "event_id": event_id
            })
        };
        fetch(`${baseUrl}/api/v1/calendars/${urlparams.cid}/events?action=remove`, requestOptions)
            .then(async response => {
                let result = await response.json()
                if (response.status === 200) {
                    props.alertSuccessFunction(result.message)
                    setinit(false)
                }
                else {
                    props.alertFunction(`${result.message}`)
                }
            })
            .catch(error => {
                props.alertFunction(error.message)
            })
        setShow(false)
    }

    async function getCalendarWithKey(cid, api_key) {
        const requestOptions = {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            credentials: 'include',
        };
        let c = randomColor(cid)
        fetch(`${baseUrl}/api/v1/calendars/${cid}`, requestOptions)
            .then(async response => {
                let result = await response.json()
                if (response.status === 200) {
                    if (result.calendar) {
                        setCurTitle(result.calendar.title + "@guest")
                        let events = result.calendar.events.map(e => ({
                            title: "busy",
                            id: e.id,
                            hexColor: c,
                            description: e.description,
                            start: new Date(parseInt(e.start_time)),
                            end: new Date(parseInt(e.end_time)),
                            delete: deleteEvent
                        }));
                        setMyEventsList([...myEventsList, ...events])
                    }
                }
                else {
                    props.alertFunction(`${result.message}`)
                }
            })
            .catch(error => {
                props.alertFunction(error.message)
            })
    }

    function selectCoordinate(op, cid) {
        let tmp = new Set(selected)
        if (op) { // select
            tmp.add(cid)
        }
        else { // unselect
            tmp.delete(cid)
        }
        setSelected([...tmp])
    }

    async function getCoordinate() {
        let tmp = new Set(selected)
        if (urlparams.cid && tmp.has(urlparams.cid)) {
            tmp.delete(parseInt(urlparams.cid))
        }
        tmp = [...tmp]

        try {
            const res = await Promise.all(tmp.map((cid) => {
                let match_cal = calendars.find((cal)=> { return cal.data.attributes.id == cid})
                match_cal = match_cal.data.attributes
                let requestOptions = ""
                let fetch_cid = ""
                if(match_cal.type == 1){
                    let api_key = match_cal.guesturl.split('api_key=')[1]
                    let qq = match_cal.guesturl.split('cid=')[1]
                    fetch_cid = qq.split('&')[0]

                    console.log(api_key)
                    requestOptions = {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${api_key}`
                        },
                        credentials: 'include'
                    };
                }else{
                    fetch_cid = cid
                    console.log(fetch_cid)
                    requestOptions = {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    };
                }
                return fetch(`${baseUrl}/api/v1/calendars/${fetch_cid}`, requestOptions)
            }));
            const data = await Promise.all(res.map(r => r.json()))
            console.log(data.flat());
            if (data.flat()) {
                let allevents = []
                data.flat().forEach(result => {
                    let c = randomColor(result.calendar.id)
                    let events = result.calendar.events.map(e => ({
                        title: (e.title)?e.title:"busy",
                        id: e.id,
                        hexColor: c,
                        description: e.description,
                        start: new Date(parseInt(e.start_time)),
                        end: new Date(parseInt(e.end_time)),
                        delete: deleteEvent
                    }));
                    allevents = [...allevents, ...events]
                });
                console.log(allevents)
                setMyEventsList([...myEventsList, ...allevents])
            }
        } catch(e) {
            console.log(e.message)
            throw Error("Promise failed");
        }
        setShow3(false)
    }

    function randomColor(seed) {
        let str = ""
        for (let i = 0; i < 3; i++) {
            let r = 1 - (Math.sin(seed++))
            // let r = Math.random()
            let temp = (100 + Math.floor(r * 40)).toString(16)
            str += temp
        }
        return str
    }

    function getCurrentCalendar(){
        let title = ""
        if(urlparams.cid && calendars){
            let match_cal = calendars.find((cal)=> { return cal.data.attributes.id == urlparams.cid})
            try{
                title = (match_cal.data.attributes.title)
            }catch(e){
                return
            }
        }
        if(urlparams.api_key){
            title += "@guest"
        }
        setCurTitle(title)
    }

    return (
        <>
            <div className="App">
                {
                    (user) ?
                        <>
                            <Row>
                                <Col xs={2}></Col>
                                <Col xs={6}>{<h2>calendar : {curTitle}</h2>}</Col>
                                <Col >
                                    <Button variant="success" onClick={() => { setShow3(true); setinit(false) }}>Coordinate</Button>{' '}
                                    <Modal
                                        show={show3}
                                        onHide={() => { setShow3(false) }}
                                        backdrop="static"
                                        keyboard={false}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Coordinate Calendar</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {(calendars && urlparams.cid) ?
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th># calendar title</th>
                                                            <th> type</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {calendars.map((cal, id) => {
                                                            let c = cal.data.attributes
                                                            let check = (new Set(selected)).has(c.id)
                                                            return (
                                                                <tr key={id}>
                                                                    <td>
                                                                        <Form.Check defaultChecked={check} disabled={(urlparams.cid == c.id)} label={c.title} onChange={(e) => { selectCoordinate(e.target.checked, c.id); }}></Form.Check>
                                                                    </td>
                                                                    <td>my calendar</td>

                                                                </tr>)
                                                        })}
                                                    </tbody>
                                                </Table>
                                                : ""
                                            }
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="primary" style={{ float: 'left' }} onClick={getCoordinate}>
                                                Add
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    <Button variant="secondary" onClick={() => { setShow(true) }}>add event</Button>{' '}
                                    <Modal
                                        show={show}
                                        onHide={handleClose}
                                        backdrop="static"
                                        keyboard={false}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Add Event</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                                    <Form.Label>Title</Form.Label>
                                                    <Form.Control type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} placeholder="title" />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control type="text" value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder="description" />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Start Date</Form.Label>
                                                    <Form.Control type="datetime-local" name="start time" onChange={(e) => { setstime(e.target.value) }} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>End Date</Form.Label>
                                                    <Form.Control type="datetime-local" name="end time" onChange={(e) => { setetime(e.target.value) }} />
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="primary" style={{ float: 'left' }} onClick={addEvent}>
                                                Add
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    <Button variant="info" onClick={() => { setShow2(true) }}>share calendar</Button>
                                    <Modal
                                        show={show2}
                                        onHide={() => { setShow2(false) }}
                                        backdrop="static"
                                        keyboard={false}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>share your calendar</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <a href={`/calendar?cid=${urlparams.cid}&api_key=${userInfo.auth_token}`}>guest's link below</a>
                                        </Modal.Body>
                                        <Modal.Footer>
                                        </Modal.Footer>
                                    </Modal>
                                </Col>
                            </Row>
                        </>
                        : <h1>Party time</h1>
                }
            </div>
            <br />
            <Container>
                <Row>
                    <Col>
                        <Calendar
                            defaultDate={new Date()}
                            localizer={localizer}
                            events={myEventsList}
                            style={{ height: 500 }}
                            components={{ event: Event }}
                            popup
                            eventPropGetter={(eventStyleGetter)}
                        />
                    </Col>
                </Row>
            </Container>

        </>
    );
}

function eventStyleGetter(event, start, end, isSelected) {
    var backgroundColor = (event.hexColor) ? '#' + event.hexColor : "";
    var style = {
        backgroundColor: backgroundColor,
        // borderRadius: '0px',
        // opacity: 0.8,
        // color: 'black',
        // border: '0px',
        // display: 'block'
    };
    return {
        style: style
    };
}

function Event(event) {
    const [content, _] = useState(event.event)
    return (
        <OverlayTrigger
            trigger={"click"}
            overlay={<Tooltip><>
                <div>detail:<CloseButton style={{ color: "white" }} onClick={() => { content.delete(content.id) }} /></div>
                <div>{content.description}</div>
                <div>from: {content.start.toLocaleTimeString()}</div>
                <div>until: {content.end.toLocaleTimeString()}</div>
                {/* <div><Button size="sm" variant="secondary">remove</Button></div> */}
            </></Tooltip>}
        >
            <span>{event.title}</span>
        </OverlayTrigger>
    );
}

export default CalendarView;
