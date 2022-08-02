import React, {useState, useEffect, useContext} from "react";
import "rc-tabs/assets/index.css";
import "leaflet/dist/leaflet.css";
import "../styles.css";

import { baseUrl } from '../config'
import { AuthContext } from "../contexts";

import Tabs, { TabPane } from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";
// import { Map as LeafMap, TileLayer, Marker, Popup } from "react-leaflet";
import { Container, Row, Col, Button, Card, CardGroup, Carousel, Table, Modal} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet'
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"

function PoI(props) {
  var callback = function(key) {};

  const { user, setUser } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState({latitude: 0, longitude: 0});
  const [userInsidePoI, setUserInsidePoI] = useState({inside: false, PoI: 0});
  const [map, setMap] = useState();
  const [geoinfo, setGeoinfo] = useState();
  const [cards, setCards] = useState();
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [poi1State, setPoi1State] = useState();
  const [poi2State, setPoi2State] = useState();
  const [poi3State, setPoi3State] = useState();
  const [poi4State, setPoi4State] = useState();
  const [poi5State, setPoi5State] = useState();
  const [poi6State, setPoi6State] = useState();
  const [poi7State, setPoi7State] = useState();
  const [poi8State, setPoi8State] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setUserLocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
    });  
    let id = navigator.geolocation.watchPosition(success, error, options);
    // console.log("======================" + id + "=========================");
    
    return () => {
      navigator.geolocation.clearWatch(id);
      // console.log("====================== clear" + id + "=========================");
    }
  }, []);

  useEffect(() => {
    // console.log('userLocation: ' + userLocation.latitude + ', ' + userLocation.longitude); 
    geofence();
  }, [userLocation])

  useEffect(() => {
    // postGeoinfo(userInsidePoI.inside, userInsidePoI.PoI)
    return () => {
      // console.log('userInsidePoI.inside?: ' + userInsidePoI.inside + ', userInsidePoI.PoI: ' + userInsidePoI.PoI); 
    }
  }, [userInsidePoI])

  useEffect(() => {
    if(!map) getMap();
    return () => {
      // console.log("get map"); 
    }
  }, [map])

  useEffect(() => {
    if(!geoinfo) getGeoinfo();
    return () => {
      // console.log("get geoinfo"); 
    }
  }, [geoinfo])

  useEffect(() => {
    if(!cards) getCards();
    return () => {
      // console.log("get cards"); 
    }
  }, [cards])

  function getMap() {
    const requestOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'
    };
    fetch(baseUrl + '/api/v1/maps/1/pois', requestOptions)
    .then(async response => {
        let result = await response.json()
        if (response.status == 200) {
            // props.alertSuccessFunction(`Welcome, ${result.account.username}`)
            setMap(result.pois)
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

  function geofence() {
    var distance;
    for (var i=1; i<=8; i++){
      distance = getDistance([userLocation.latitude, userLocation.longitude], [target[i].latitude, target[i].longitude])
      // console.log('i=' + i + ': distance: ' + distance);

      if (distance < radius) {
        if (userInsidePoI.inside) {
          // console.log("++++++++inside+++++++");
          continue;
        }
        else {
          props.alertSuccessFunction('Congratulations, you reached one of the PoI: ' + target[i].name);
          setUserInsidePoI( {inside: true, PoI: i} );
          postGeoinfo(true, i);
        }
      }
      else {
        if (userInsidePoI.inside && userInsidePoI.PoI === i) {
          props.alertSuccessFunction('You are leaving one of the PoI: ' + target[i].name);
          setUserInsidePoI( {inside: false, PoI: 0} );
          postGeoinfo(false, i);
        }
        else {
          // console.log("-------outside---------");
          continue;
        }
      }
    }
  }

  //Calculate distance
  function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  }
  function toRadian(degree) {
      return degree*Math.PI/180;
  }

  // Get user's position
  var target, options;
  
  target = {
    1: {latitude: 24.795766621401005, longitude: 120.9919832462873, name: "台達館"},
    2: {latitude: 24.795332380711834, longitude: 120.99471792945154, name: "旺宏館"},
    3: {latitude: 24.794339028676507, longitude: 120.99331733144486, name: "綜二"}, 
    4: {latitude: 24.79811232481267, longitude: 120.9910483527293, name: "清華會館"},  
    5: {latitude: 24.792459765107758, longitude: 120.99004427985564, name: "梅園"}, 
    6: {latitude: 24.78792834315937, longitude: 120.99083261427393, name: "弈園"},  
    7: {latitude: 24.793869810505374, longitude: 120.99511878432668, name: "成功湖"},
    8: {latitude: 24.79066534952453, longitude: 120.99570350574783, name: "清交小徑"}, 
  };

  function success(pos) {
    var crd = pos.coords;

    // console.log(crd);
    setUserLocation({latitude: crd.latitude, longitude: crd.longitude});

    var convertedTime = new Date(pos.timestamp).toLocaleTimeString("en-US")
    // console.log('retrieval time: ' + convertedTime);
  }

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 1000
  };

  //get location and timestamp info from backend db storage for user entering or exiting some PoI's geofence
  function getGeoinfo(){
    if (!user) return

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    };
    fetch(baseUrl+`/api/v1/geoinfos/${user}`, requestOptions)
    .then(async response =>{
        let result = await response.json()
        if (response.status === 200){
          // console.log(result.geoinfo_list)
          setGeoinfo(result)
          let geoinfo_list = result.geoinfo_list

          for(var i=0; i < geoinfo_list.length; i++){
            if(geoinfo_list[i].attributes.entered === true){
              switch (geoinfo_list[i].attributes.poiId){
                case '1':
                  setPoi1State(true)
                  console.log("set poi 1 state true")
                  break;  
                case '2':
                  setPoi2State(true)
                  console.log("set poi 2 state true")
                  break;
                case '3':
                  setPoi3State(true)
                  console.log("set poi 3 state true")
                  break;
                case '4':
                  setPoi4State(true)
                  console.log("set poi 4 state true")
                  break;
                case '5':
                  setPoi5State(true)
                  console.log("set poi 5 state true")
                  break;
                case '6':
                  setPoi6State(true)
                  console.log("set poi 6 state true")
                  break;
                case '7':
                  setPoi7State(true)
                  console.log("set poi 7 state true")
                  break;
                case '8':
                  setPoi8State(true)
                  console.log("set poi 8 state true")
                  break;
                default:
                  console.log("error poi color setting")
              }
            }
          }

          // props.alertSuccessFunction(`${result.message}`)
          // result.geoinfo_list[0]['attributes']['poiId']
        }
        else{
            props.alertFunction(`${result.message}`)
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }
    })
    .catch(error =>{
        props.alertFunction("unknown error to get geoinfo")
    })
  }

  //post location and timestamp info to backend db storage for user entering or exiting some PoI's geofence
  function postGeoinfo(inside, PoI){
    if (inside == false) return
    if (!user) return

    const timestamp = new Date().toLocaleString('en-US', {hour12:false});
    console.log(timestamp);
    // const latitude  = userLocation.latitude.toString()
    // const longitude = userLocation.longitude.toString()
    const targetID  = PoI.toString()

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ "username": user, "poiId": targetID,  "entered": true, "entryTime": timestamp})
    };
    fetch(baseUrl+`/api/v1/geoinfos/${user}`, requestOptions)
    .then(async response =>{
        let result = await response.json()
        if (response.status === 200 || response.status === 201){
          console.log(result)
          getGeoinfo()
          // props.alertSuccessFunction(`${result.message}`)
        }
        else{
            props.alertFunction(`${result.message}`)
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }
    })
    .catch(error =>{
        props.alertFunction("unknown error to post geoinfo")
    })
  }

  //get cards
  function getCards(){
    if (!user) return

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    };
    fetch(baseUrl+`/api/v1/cards/${user}`, requestOptions)
    .then(async response =>{
        let result = await response.json()
        if (response.status === 200){
          // console.log(result.card_list)
          setCards(result.card_list)

          // props.alertSuccessFunction(`${result.message}`)
        }
        else{
            props.alertFunction(`${result.message}`)
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }
    })
    .catch(error =>{
        props.alertFunction("unknown error to get cards")
    })
  }

  //draw a card
  function drawCard(){
    if (!user) return

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ "card_code": "456789"})
    };
    fetch(baseUrl+`/api/v1/cards/${user}`, requestOptions)
    .then(async response =>{
        let result = await response.json()
        if (response.status === 200){
          console.log(result)
          getCards()
          // props.alertSuccessFunction(`${result.message}`)
        }
        else{
            props.alertFunction(`${result.message}`)
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }
    })
    .catch(error =>{
        props.alertFunction("unknown error to draw card")
    })
  }

  const color_blue = { fillColor: '#0093FF', color: '#0093FF'}
  const color_red = { fillColor: '#F75E5E', color: '#F75E5E'}
  const radius = 50

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        onChange={callback}
        renderTabBar={() => <ScrollableInkTabBar />}
        renderTabContent={() => <TabContent />}
      >
        <TabPane tab="清華八景" key="1">
          <MapContainer class="map" selected="selected" center={[24.794543367966625, 120.99341255578466]} zoom={11} style={{ height: "90vh" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {
              (userLocation.latitude)?<Marker id="user" position={[userLocation.latitude, userLocation.longitude]} icon={new Icon({iconUrl: require('../user.png'), iconSize: [30, 30], iconAnchor: [12, 41]})}><Popup>User現在位置. <br /> Easily customizable.</Popup></Marker>:""
            }
            <Circle center={[target[1].latitude, target[1].longitude]} pathOptions={ poi1State === true ? color_blue : color_red} radius={radius} />
            <Marker id="1" position={[target[1].latitude, target[1].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
                <Card>
                  <Card.Img variant="top" className="photo" src={require('../delta.png')} />
                  <Card.Body>
                    <Card.Title>{target[1].name}</Card.Title>
                    <Card.Text>
                      資工系館
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">進入時間:2022.07.19-12:35PM</small>
                  </Card.Footer>
                </Card>
              </Popup>
            </Marker>
            <Circle center={[target[2].latitude, target[2].longitude]} pathOptions={ poi2State === true ? color_blue : color_red} radius={radius} />
            <Marker id="2" position={[target[2].latitude, target[2].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
                <Card>
                  <Card.Img variant="top" className="photo" src={require('../giphy.gif')} />
                  <Card.Body>
                    <Card.Title>{target[2].name}</Card.Title>
                    <Card.Text>
                      圖書館
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">進入時間:2022.07.19-12:35PM</small>
                  </Card.Footer>
                </Card>
              </Popup>
            </Marker>
            <Circle center={[target[3].latitude, target[3].longitude]} pathOptions={ poi3State === true ? color_blue : color_red} radius={radius} />
            <Marker id="3" position={[target[3].latitude, target[3].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
                {target[3].name} <br /> Easily customizable.
              </Popup>
            </Marker>
            <Circle center={[target[4].latitude, target[4].longitude]} pathOptions={ poi4State === true ? color_blue : color_red} radius={radius} />
            <Marker id="4" position={[target[4].latitude, target[4].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
                {target[4].name} <br /> Easily customizable.
              </Popup>
            </Marker>
            <Circle center={[target[5].latitude, target[5].longitude]} pathOptions={ poi5State === true ? color_blue : color_red} radius={radius} />
            <Marker id="5" position={[target[5].latitude, target[5].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
                {target[5].name} <br /> Easily customizable.
              </Popup>
            </Marker>
            <Circle center={[target[6].latitude, target[6].longitude]} pathOptions={ poi6State === true ? color_blue : color_red} radius={radius} />
            <Marker id="6" position={[target[6].latitude, target[6].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
                {target[6].name} <br /> Easily customizable.
              </Popup>
            </Marker>
            <Circle center={[target[7].latitude, target[7].longitude]} pathOptions={ poi7State === true ? color_blue : color_red} radius={radius} />
            <Marker id="7" position={[target[7].latitude, target[7].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
                {target[7].name} <br /> Easily customizable.
              </Popup>
            </Marker>
            <Circle center={[target[8].latitude, target[8].longitude]} pathOptions={ poi8State === true ? color_blue : color_red} radius={radius} />
            <Marker id="8" position={[target[8].latitude, target[8].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
                {target[8].name} <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </TabPane>
        <TabPane tab="卡片倉庫" key="2">
          <>
            <Button variant="dark" onClick={handleShow} >
              點擊抽卡
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={drawCard}>
                  Yes
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
          <Container>
            {
              (cards) ?
                  <>
                    {cards.map((card, id) => {
                        let c = card.data.attributes
                        return (
                            <Row xs={1} md={3} className="g-4">
                              <Col>
                                <Card className="card">
                                  <Card.Body>
                                    <Card.Title>Card title</Card.Title>
                                    <Card.Text>
                                      course code: {(c.card_code)}
                                    </Card.Text>
                                    <Card.Img variant="top" src={require(`../${c.card_code}.png`)} />
                                  </Card.Body>
                                  <Card.Footer>
                                    <small className="text-muted">Last updated 3 mins ago</small>
                                  </Card.Footer>
                                </Card>
                              </Col>
                            </Row>
                            )
                    })}
                  </>
                : "empty cards"
            }
          </Container>
        </TabPane>
        <TabPane tab="操作介紹" key="3">
          <Carousel>
            {Array.from({ length: 8 }).map((_, idx) => (
              <Carousel.Item>
                <Card className="card">
                  <Card.Img variant="top" src={require('../sampleCard.png')} />
                  {/* <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                      This is a wider card with supporting text below as a natural lead-in
                      to additional content. This content is a little bit longer.
                    </Card.Text>
                  </Card.Body> */}
                  {/* <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </Card.Footer> */}
                </Card>
              </Carousel.Item>
            ))}
          </Carousel>
        </TabPane>
      </Tabs>
      <div className="fixed-content">
        <Container style={{color:"white", textAlign:"center"}} width="30" height="30">未走地點
          <Row xs={1} md={1}> 
            {
              (!poi1State)?<Col style={{color:"black", backgroundColor:"#b3b3b3", textAlign:"center", padding:"1%", borderRadius:"10%"}}>{ target[1].name}</Col> : ""
            }
            {
              (!poi2State)?<Col style={{color:"black", backgroundColor:"#b3b3b3", textAlign:"center", padding:"1%", borderRadius:"10%"}}>{ target[2].name}</Col> : ""
            }
            {
              (!poi3State)?<Col style={{color:"black", backgroundColor:"#b3b3b3", textAlign:"center", padding:"1%", borderRadius:"10%"}}>{ target[3].name}</Col> : ""
            }
            {
              (!poi4State)?<Col style={{color:"black", backgroundColor:"#b3b3b3", textAlign:"center", padding:"1%", borderRadius:"10%"}}>{ target[4].name}</Col> : ""
            }
            {
              (!poi5State)?<Col style={{color:"black", backgroundColor:"#b3b3b3", textAlign:"center", padding:"1%", borderRadius:"10%"}}>{ target[5].name}</Col> : ""
            }
            {
              (!poi6State)?<Col style={{color:"black", backgroundColor:"#b3b3b3", textAlign:"center", padding:"1%", borderRadius:"10%"}}>{ target[6].name}</Col> : ""
            }
            {
              (!poi7State)?<Col style={{color:"black", backgroundColor:"#b3b3b3", textAlign:"center", padding:"1%", borderRadius:"10%"}}>{ target[7].name}</Col> : ""
            }
            {
              (!poi8State)?<Col style={{color:"black", backgroundColor:"#b3b3b3", textAlign:"center", padding:"1%", borderRadius:"10%"}}>{ target[8].name}</Col> : ""
            }
          </Row>
        </Container>
      </div>
    </>
  );
}

export default PoI;
