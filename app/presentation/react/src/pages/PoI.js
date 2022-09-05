import React, {useState, useEffect, useContext} from "react";
import "rc-tabs/assets/index.css";
import "leaflet/dist/leaflet.css";
import "../styles.css";

import { baseUrl } from '../config'
import { AuthContext } from "../contexts";

import Tabs, { TabPane } from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";
import { Container, Row, Col, Button, Card, CardGroup, Carousel, Table, Modal, Image} from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, Rectangle } from 'react-leaflet'
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { toast } from 'react-toastify';

function PoI(props) {
  var callback = function(key) {};
  const { user, setUser } = useContext(AuthContext);
  const { googleMapApiKey, setGoogleMapApiKey } = useContext(AuthContext);

  const [userLocation, setUserLocation] = useState({latitude: 0, longitude: 0});
  const [userInsidePoI, setUserInsidePoI] = useState({inside: false, PoI: 0});
  const [map, setMap] = useState();
  const [geoinfo, setGeoinfo] = useState();
  const [geoinfoAmount, setGeoinfoAmount] = useState();

  const [cards, setCards] = useState();
  const [cardsAmount, setCardsAmount] = useState();
  
  const [showCard, setShowCard] = useState(false);
  const [show, setShow] = useState(false);
  const [cardCode, setCardCode] = useState();

  const [drawCardFlag, setDrawCardFlag] = useState(true);

  const handleCloseCard = () => setShowCard(false);
  function handleShowCard (card_code){
    setShowCard(true);
    setCardCode(card_code);
  }

  const handleClose = () => setShow(false);
  function handleShow () {
    if (drawCardFlag === true)
      setShow(true);
  }

  function handleDrawCard (){
    setDrawCardFlag(false)
    drawCard();
  }


  const [poi1State, setPoi1State] = useState(false);
  const [poi2State, setPoi2State] = useState(false);
  const [poi3State, setPoi3State] = useState(false);
  const [poi4State, setPoi4State] = useState(false);
  const [poi5State, setPoi5State] = useState(false);
  const [poi6State, setPoi6State] = useState(false);
  const [poi7State, setPoi7State] = useState(false);
  const [poi8State, setPoi8State] = useState(false);

  const [poi1_timeState, setPoi1_timeState] = useState();
  const [poi2_timeState, setPoi2_timeState] = useState();
  const [poi3_timeState, setPoi3_timeState] = useState();
  const [poi4_timeState, setPoi4_timeState] = useState();
  const [poi5_timeState, setPoi5_timeState] = useState();
  const [poi6_timeState, setPoi6_timeState] = useState();
  const [poi7_timeState, setPoi7_timeState] = useState();
  const [poi8_timeState, setPoi8_timeState] = useState();

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
            toast.warn(`${result.message}`, {
              position: "top-right",
              autoClose: 5000,
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
        toast.warn("unknown error", {
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
          if (i === 1 && !poi1State) 
            {
              toast.info('Congratulations, you reached: ' + target[i].name + '. Check your NEW QUOTA for cards!', {
                position: "top-center",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
          if (i === 2 && !poi2State) 
            {
              toast.info('Congratulations, you reached: ' + target[i].name + '. Check your NEW QUOTA for cards!', {
                position: "top-center",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
          if (i === 3 && !poi3State)
            {
              toast.info('Congratulations, you reached: ' + target[i].name + '. Check your NEW QUOTA for cards!', {
                position: "top-center",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
          if (i === 4 && !poi4State)
            {
              toast.info('Congratulations, you reached: ' + target[i].name + '. Check your NEW QUOTA for cards!', {
                position: "top-center",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
          if (i === 5 && !poi5State)
            {
              toast.info('Congratulations, you reached: ' + target[i].name + '. Check your NEW QUOTA for cards!', {
                position: "top-center",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
          if (i === 6 && !poi6State)
            {
              toast.info('Congratulations, you reached: ' + target[i].name + '. Check your NEW QUOTA for cards!', {
                position: "top-center",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
          if (i === 7 && !poi7State)
            {
              toast.info('Congratulations, you reached: ' + target[i].name + '. Check your NEW QUOTA for cards!', {
                position: "top-center",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
          if (i === 8 && !poi8State)
            {
              toast.info('Congratulations, you reached: ' + target[i].name + '. Check your NEW QUOTA for cards!', {
                position: "top-center",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
          console.log('進入i=' + i + ', ' + target[i].name )
          setUserInsidePoI( {inside: true, PoI: i} );
          postGeoinfo(true, i);
        }
      }
      else {
        if (userInsidePoI.inside && userInsidePoI.PoI === i) {
          // props.alertSuccessFunction('you left: ' + target[i].name + '. Go explore other spots~');
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
    3: {latitude: 24.794339028676507, longitude: 120.99331733144486, name: "綜合二館"}, 
    4: {latitude: 24.79811232481267, longitude: 120.9910483527293, name: "清華會館"},  
    5: {latitude: 24.792459765107758, longitude: 120.99004427985564, name: "梅園"}, 
    6: {latitude: 24.78792834315937, longitude: 120.99083261427393, name: "奕園"},  
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
          setGeoinfoAmount(result.geoinfo_list.length)
          let geoinfo_list = result.geoinfo_list

          for(var i=0; i < geoinfo_list.length; i++){
            if(geoinfo_list[i].attributes.entered === true){
              switch (geoinfo_list[i].attributes.poiId){
                case '1':
                  setPoi1State(true)
                  setPoi1_timeState(geoinfo_list[i].attributes.entryTime)
                  // console.log("set poi 1 state true")
                  break;  
                case '2':
                  setPoi2State(true)
                  setPoi2_timeState(geoinfo_list[i].attributes.entryTime)
                  // console.log("set poi 2 state true")
                  break;
                case '3':
                  setPoi3State(true)
                  setPoi3_timeState(geoinfo_list[i].attributes.entryTime)
                  // console.log("set poi 3 state true")
                  break;
                case '4':
                  setPoi4State(true)
                  setPoi4_timeState(geoinfo_list[i].attributes.entryTime)
                  // console.log("set poi 4 state true")
                  break;
                case '5':
                  setPoi5State(true)
                  setPoi5_timeState(geoinfo_list[i].attributes.entryTime)
                  // console.log("set poi 5 state true")
                  break;
                case '6':
                  setPoi6State(true)
                  setPoi6_timeState(geoinfo_list[i].attributes.entryTime)
                  // console.log("set poi 6 state true")
                  break;
                case '7':
                  setPoi7State(true)
                  setPoi7_timeState(geoinfo_list[i].attributes.entryTime)
                  // console.log("set poi 7 state true")
                  break;
                case '8':
                  setPoi8State(true)
                  setPoi8_timeState(geoinfo_list[i].attributes.entryTime)
                  // console.log("set poi 8 state true")
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
            toast.warn(`${result.message}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }
    })
    .catch(error =>{
      toast.warn("unknown error to get geoinfo", {
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

  //post location and timestamp info to backend db storage for user entering or exiting some PoI's geofence
  function postGeoinfo(inside, PoI){
    if (inside === false) return
    if (!user) return
    console.log(PoI)
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
            toast.warn(`${result.message}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }
    })
    .catch(error =>{
      toast.warn("unknown error to post geoinfo", {
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
          setCardsAmount(result.card_list.length)
          setDrawCardFlag(true)
          // props.alertSuccessFunction(`${result.message}`)
        }
        else{
            toast.warn(`${result.message}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
            setTimeout(()=>{
                window.location.reload()
            },3000)
        }
    })
    .catch(error =>{
      toast.warn("unknown error to get cards", {
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

  function card_code_random_generator(){
    let numberB = 8;  //perserved cards
    let numberA = 2;
    let numberCS = 43;
    let numberG = 12;
    let numberL = 19;

    let numberTotal = numberA + numberCS + numberG + numberL;
    let id;
    let new_card_code;

    if(cardsAmount < numberB){
      id = 1 + Math.floor(Math.random() * numberB)
      new_card_code = "B" + id
    }
    else{
      id = 1 + Math.floor(Math.random() * numberTotal)

      if (id <= numberA)
        new_card_code = "A" + id
      else if (numberA < id && id <= (numberA + numberCS))
        new_card_code = "CS" + (id - numberA)
      else if ((numberA + numberCS) < id && id <= (numberA + numberCS + numberG))
        new_card_code = "G" + (id - (numberA + numberCS))
      else if ((numberA + numberCS + numberG) < id && id <= (numberA + numberCS + numberG + numberL))
        new_card_code = "L" + (id - (numberA + numberCS + numberG))
    }
    
    cards.map((card, id) => {
      let c = card.data.attributes
      if (new_card_code === c.card_code){
        new_card_code = ""
      }
    })

    return new_card_code
  }

  function card_code_generator(){
    let new_card_code = card_code_random_generator()
    while(new_card_code === ""){
      new_card_code = card_code_random_generator()
    }
    return new_card_code
  }

  //draw a card
  function drawCard(){
    if (drawCardFlag === false) {
      toast.warn("Error! Please wait for seconds!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      }); 
      handleClose()
      setDrawCardFlag(true)
      return
    }
    if (!user) {
      toast.warn("Error! Please login!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      }); 
      handleClose()
      setDrawCardFlag(true)
      return
    }
    if ( (3 * geoinfoAmount) - cardsAmount <= 0 ) {
      toast.warn("Error! No quota for cards!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      }); 
      handleClose()
      setDrawCardFlag(true)
      return
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ "card_code": card_code_generator()})
    };
    fetch(baseUrl+`/api/v1/cards/${user}`, requestOptions)
    .then(async response =>{
        let result = await response.json()
        if (response.status === 200){
          // console.log(result)
          toast.success("Successfully draw a new card", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          toast.info("Loading new card...", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        }
        else{
          toast.warn(`${result.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        }
    })
    .then(function(){
      getCards();
    })
    .then(function(){
      handleClose()
    })
    .catch(error =>{
        toast.warn("unknown error to draw card", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }); 
        handleClose()
    })
  }

  const color_blue = { fillColor: '#0093FF', color: '#0093FF'}
  const color_red = { fillColor: '#F75E5E', color: '#F75E5E'}
  const radius = 50


  return (
    <>
      <Tabs
        style={{ height:"94vh", width:"100vw", backgroundColor: "white"}}
        defaultActiveKey="1"
        onChange={callback}
        renderTabBar={() => <ScrollableInkTabBar />}
        renderTabContent={() => <TabContent />}
      >
        <TabPane tab="清華八景" key="1">
          <div style={{position:"fixed", zIndex:2}} className="fixed-content">
            { (!poi1State || !poi2State || !poi3State || !poi4State || !poi5State || !poi6State || !poi7State || !poi8State)?
              <Container style={{ color:"white", textAlign:"center", height:"15vh", width:"30vw" }} >未走地點
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
              : ""
            }
          </div>
          <div style={{position:"relative", zIndex:1}} >
            <MapContainer class="map" selected="selected" center={[24.794543367966625, 120.99341255578466]} zoom={11} attributionControl={false} style={{ height:"89.5vh", width:"100vw"}} >
              <ReactLeafletGoogleLayer apiKey={googleMapApiKey} minZoom={14} maxZoom={19} />
              {
                (userLocation.latitude)?
                  <Marker id="user" position={[userLocation.latitude, userLocation.longitude]} icon={new Icon({iconUrl: require('../images/markers/user.png'), iconSize: [30, 30], iconAnchor: [12, 41]})}>
                    <Popup>用戶現在位置.</Popup>
                  </Marker>
                :""
              }
              <Circle center={[target[1].latitude, target[1].longitude]} pathOptions={ poi1State === true ? color_blue : color_red} radius={radius} />
              <Marker id="1" position={[target[1].latitude, target[1].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                <Popup>
                  <Card >
                    <Card.Img variant="top" className="photo" src={(poi1State)?require('../images/pois/delta-building.png'):require('../images/pois/greyscale-delta-building.png')} />
                    <Card.Body>
                      <Card.Title>{target[1].name}</Card.Title>
                      <Card.Text style={{ height:"8vh", width:"45vw", overflow:"scroll"}}>
                        {(poi1State)?`資工、電機、材料三個系所共同的系館。資工教室多在一樓。電機多在二樓，五樓出電梯右轉則有資工系辦，大學部的系辦負責姊姊是小靜姐呦～如果不知道進系辦時要找誰，可詢問坐在系辦入口的工讀生。`:"？？？？？？"}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{(poi1_timeState)?`抵達時間:${poi1_timeState}`:"尚未抵達，無法查看"}</small>
                    </Card.Footer>
                  </Card>
                </Popup>
              </Marker>
              <Circle center={[target[2].latitude, target[2].longitude]} pathOptions={ poi2State === true ? color_blue : color_red} radius={radius} />
              <Marker id="2" position={[target[2].latitude, target[2].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                <Popup>
                  <Card>
                    <Card.Img variant="top" className="photo" src={(poi2State)?require('../images/pois/library.jpg'):require('../images/pois/greyscale-library.jpg')} />
                    <Card.Body>
                      <Card.Title>{target[2].name}</Card.Title>
                      <Card.Text style={{ height:"8vh", width:"45vw", overflow:"scroll"}}>
                        {(poi2State)?`旺宏館是清大圖書館本館，除此之外，人社院也有自己的圖書館，那裡有非常多的文史資料，值得有空去晃晃。旺宏館有夜讀區跟討論室可申請，需上網預約，遲到或沒到會被記違規。`:"？？？？？？"}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{(poi2_timeState)?`抵達時間:${poi2_timeState}`:"尚未抵達，無法查看"}</small>
                    </Card.Footer>
                  </Card>
                </Popup>
              </Marker>
              <Circle center={[target[3].latitude, target[3].longitude]} pathOptions={ poi3State === true ? color_blue : color_red} radius={radius} />
              <Marker id="3" position={[target[3].latitude, target[3].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                <Popup>
                  <Card>
                    <Card.Img variant="top" className="photo" src={(poi3State)?require('../images/pois/general-buildingII.jpeg'):require('../images/pois/greyscale-general-buildingII.jpg')} />
                    <Card.Body>
                      <Card.Title>{target[3].name}</Card.Title>
                      <Card.Text style={{ height:"8vh", width:"45vw", overflow:"scroll"}}>
                        {(poi3State)?`前有校內巴士停靠站，後有鴿子廣場。鴿子廣場上有一些小方格，上頭有時會有塗鴉，那些方格真的是設計來給人畫畫的，下雨就會洗掉了。系上有些實驗室會在這棟樓。`:"？？？？？？"}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{(poi3_timeState)?`抵達時間:${poi3_timeState}`:"尚未抵達，無法查看"}</small>
                    </Card.Footer>
                  </Card>
                </Popup>
              </Marker>
              <Circle center={[target[4].latitude, target[4].longitude]} pathOptions={ poi4State === true ? color_blue : color_red} radius={radius} />
              <Marker id="4" position={[target[4].latitude, target[4].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                <Popup>
                  <Card>
                    <Card.Img variant="top" className="photo" src={(poi4State)?require('../images/pois/guest-house.jpg'):require('../images/pois/greyscale-guest-house.jpg')} />
                    <Card.Body>
                      <Card.Title>{target[4].name}</Card.Title>
                      <Card.Text style={{ height:"8vh", width:"45vw", overflow:"scroll"}}>
                        {(poi4State)?`校內提供短期住宿的地方，有些貴賓會來住這，僅提供在校學生家長、校友或相關學者申請。門口有一個公共藝術裝置「候鳥歸巢」，意味提供各界學者一個溫暖親切的棲息地。`:"？？？？？？"}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{(poi4_timeState)?`抵達時間:${poi4_timeState}`:"尚未抵達，無法查看"}</small>
                    </Card.Footer>
                  </Card>
                </Popup>
              </Marker>
              <Circle center={[target[5].latitude, target[5].longitude]} pathOptions={ poi5State === true ? color_blue : color_red} radius={radius} />
              <Marker id="5" position={[target[5].latitude, target[5].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                <Popup>
                  <Card>
                    <Card.Img variant="top" className="photo" src={(poi5State)?require('../images/pois/plum-park.jpg'):require('../images/pois/greyscale-plum-park.jpg')} />
                    <Card.Body>
                      <Card.Title>{target[5].name}</Card.Title>
                      <Card.Text style={{ height:"8vh", width:"45vw", overflow:"scroll"}}>
                        {(poi5State)?`每年開花時很漂亮，學校會把梅子摘下來釀。上頭有梅校長的墓，校長是真的葬在這，有什麼心事可以找校長談談心，說不定隔天他老人家能保佑你解決煩惱。`:"？？？？？？"}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{(poi5_timeState)?`抵達時間:${poi5_timeState}`:"尚未抵達，無法查看"}</small>
                    </Card.Footer>
                  </Card>
                </Popup>
              </Marker>
              <Circle center={[target[6].latitude, target[6].longitude]} pathOptions={ poi6State === true ? color_blue : color_red} radius={radius} />
              <Marker id="6" position={[target[6].latitude, target[6].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                <Popup>
                  <Card>
                    <Card.Img variant="top" className="photo" src={(poi6State)?require('../images/pois/go-park.jpg'):require('../images/pois/greyscale-go-park.jpg')} />
                    <Card.Body>
                      <Card.Title>{target[6].name}</Card.Title>
                      <Card.Text style={{ height:"8vh", width:"45vw", overflow:"scroll"}}>
                        {(poi6State)?`鄰近清大土地公，附近有停車場。為沈君山校長因為愛棋所贈，裏頭有座奕亭，上頭奕亭兩字是沈校長手書，門口的奕園兩字則是金庸先生親手提寫的。`:"？？？？？？"}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{(poi6_timeState)?`抵達時間:${poi6_timeState}`:"尚未抵達，無法查看"}</small>
                    </Card.Footer>
                  </Card>
                </Popup>
              </Marker>
              <Circle center={[target[7].latitude, target[7].longitude]} pathOptions={ poi7State === true ? color_blue : color_red} radius={radius} />
              <Marker id="7" position={[target[7].latitude, target[7].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                <Popup>
                  <Card>
                    <Card.Img variant="top" className="photo" src={(poi7State)?require('../images/pois/chengkung-lake.jpg'):require('../images/pois/greyscale-chengkung-lake.jpg')} />
                    <Card.Body>
                      <Card.Title>{target[7].name}</Card.Title>
                      <Card.Text style={{ height:"8vh", width:"45vw", overflow:"scroll"}}>
                        {(poi7State)?`滿載清大各種傳奇故事的地方，但最近要清湖底淤泥，所以水被抽光了。聽說修整後的成功湖會有環湖步道，以前是沒辦法走完整圈的，期待一下吧？`:"？？？？？？"}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{(poi7_timeState)?`抵達時間:${poi7_timeState}`:"尚未抵達，無法查看"}</small>
                    </Card.Footer>
                  </Card>
                </Popup>
              </Marker>
              <Circle center={[target[8].latitude, target[8].longitude]} pathOptions={ poi8State === true ? color_blue : color_red} radius={radius} />
              <Marker id="8" position={[target[8].latitude, target[8].longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                <Popup>
                  <Card>
                    <Card.Img variant="top" className="photo" src={(poi8State)?require('../images/pois/nthu-nctu-route.jpg'):require('../images/pois/greyscale-nthu-nctu-route.jpg')} />
                    <Card.Body>
                      <Card.Title>{target[8].name}</Card.Title>
                      <Card.Text style={{ height:"8vh", width:"45vw", overflow:"scroll"}}>
                        {(poi8State)?`連接清大和交大的一條小徑，以前還有出過小徑T-shirt。要去交大吃飯或是運動的話可以走這條，清大都稱清交小徑，交大都稱交清小徑。咦？那陽明呢？`:"？？？？？？"}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{(poi8_timeState)?`抵達時間:${poi8_timeState}`:"尚未抵達，無法查看"}</small>
                    </Card.Footer>
                  </Card>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </TabPane>
        <TabPane tab="卡片倉庫" key="2">
          <Container style={{ height:"87vh", width:"100vw"}} >
            <br></br>
            <h6 className="App">卡池有84張卡片，和朋友們分享自己的卡片吧！</h6>
            <div className="App">可抽卡次數:{`${ (3 * geoinfoAmount) - cardsAmount} `}
              <Button variant="dark" onClick={handleShow} >
                點擊抽卡
              </Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>抽卡提醒</Modal.Title>
                </Modal.Header>
                <Modal.Body>卡片出現機率:亂數，確定使用？</Modal.Body>
                <Modal.Footer>
                  <Button variant="dark" onClick={handleDrawCard}>
                    Yes
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <br></br>
            {
              (cards) ?
                  <>
                    <Row xs={3} md={3} className="g-4">
                    {(geoinfoAmount >= 8)?
                    <Col>
                      <Button variant="outline-light" onClick={() => handleShowCard('golden-card')}>
                        <Card>
                          <Card.Img variant="top" src={require(`../images/cards/golden-card.png`)} style={{ height:"100%", width:"100%"}}/>
                        </Card>
                      </Button>
                    </Col>
                    :<Col>
                      <Button variant="outline-light" onClick={() => handleShowCard('graysacle-golden-card')}>
                        <Card>
                        <Card.Img variant="top" src={require(`../images/cards/graysacle-golden-card.png`)} style={{ height:"100%", width:"100%"}}/>
                        </Card>
                      </Button>
                    </Col>
                    }
                    {cards.map((card, id) => {
                        let c = card.data.attributes
                        return (
                              <Col>
                                <Button variant="outline-light" onClick={() => handleShowCard(c.card_code)}>
                                  <Card>
                                    <Card.Img variant="top" src={require(`../images/cards/${c.card_code}.png`)} style={{ height:"100%", width:"100%"}}/>
                                  </Card>
                                </Button>
                              </Col>
                          )
                    })}
                    {
                    (cardCode)?
                      <Modal 
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        style={{ marginLeft: "7%", marginRight: "7%", height:"100%", width:"86%"}}
                        show={showCard} 
                        onHide={handleCloseCard}
                      >
                        <Modal.Header closeButton> 點擊x或點擊外側關閉
                        </Modal.Header>
                        <Card.Img variant="top" src={require(`../images/cards/${cardCode}.png`)} style={{ height:"100%", width:"100%"}}/>
                      </Modal>
                      :""
                    }
                    </Row>
                  </>
                : "尚未取得卡片"
            }
          </Container>
        </TabPane>
        <TabPane tab="幕後介紹" key="3">
          <Carousel>
            <Carousel.Item>
              <br></br>
              <Card.Text className="App" >Hi there!</Card.Text>
              <Card className="card">
                <Card.Body>
                  <Row>
                    <Col className="App">
                      <br></br>
                      <br></br>
                      <a href="https://forms.gle/kFFMLyLrDugha1Fr5">評分表單在此</a>
                    </Col>
                    <Col>
                      <Card.Img variant="top" src={require(`../images/others/nthu-mascot.png`)} />
                    </Col>
                    <Col className="App">
                      <br></br>
                      <br></br>
                      <a href="https://forms.gle/eH6QpDkTKaGoxyS49">問題回報在此</a>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Disclaimer: This web app is designed non-profit and for education-purpose.<br></br><br></br>
                  All rights reserved. Last updated 2022.09.01.<br></br>contact us: rayhungkao@gmail.com</small>
                </Card.Footer>
              </Card> 
            </Carousel.Item>
            <Carousel.Item>
              <br></br>
              <Card.Text className="App" >Sponsorship</Card.Text>
              <Card className="card">
                <Card.Body>
                  <Row>
                    <Card.Img variant="top" src={require(`../images/others/nthu-cs.png`)} />
                  </Row>
                </Card.Body>
                <Card.Text className="App" >{"系辦想跟大家說的話><"}</Card.Text>
                <Card.Footer style={{ height:"55vh", width:"100vw", overflow:"scroll"}}>
                  <small className="text-muted">歡迎各位大一新鮮人加入清華大學資工系這個大家庭，大學生涯四年說長不長，說短也不短，期許各位同學好好把握當下並學習運用與規劃自己的時間，盡情體驗與豐富你的大學生活。<br></br><br></br>
                  系上自上個學期，開始進行企業導師計畫，由資工系、資應所多位在業界都非常有經驗的系友，來擔任業師，希望藉由業師豐富的社會實戰經驗讓本系(含資應所及資安所)學生得以宏觀的視野來進行職涯規劃與畢業後發展的參考，進而提升自我競爭力。<br></br><br></br>
                  這個APP是由其中一位業師及其導生所開發出來的，希望同學們透過這個APP，可以多一個認識校園與本系的管道。當然，有任何課業學習上的問題，我們還是希望同學們能主動並直接與系上的老師們、系辦的同仁們詢問。希望同學們都能有個充實愉快且難忘的大學生活。歡迎各位大一新鮮人加入清華大學資工系這個大家庭，大學生涯四年說長不長，說短也不短，期許各位同學好好把握當下並學習運用與規劃自己的時間，盡情體驗與豐富你的大學生活。</small>
                </Card.Footer>
              </Card>
            </Carousel.Item>
            <Carousel.Item>
              <br></br>
              <Card.Text className="App" >常見問題</Card.Text>
              <Card className="card">
                <Card.Body>
                  <Row>
                      <Col>
                      </Col>
                      <Col>
                        <Card.Img variant="top" src={require(`../images/others/qa.png`)} />
                      </Col>
                      <Col>
                      </Col>
                  </Row>
                </Card.Body>
                <Card.Footer style={{ height:"55vh", width:"100vw", overflow:"scroll"}}>
                  <small className="text-muted">
                    Q1: 地圖出現 For development purposes only 的字樣怎麼辦？<br></br>
                    A1: 請點擊畫面左上角 Tripbook 字樣，回到首頁，接著點擊 NEXT 重新載入清華八景，即可解決。<br></br><br></br>
                    Q2: 無法正確進入圈住的景點怎麼辦？<br></br>
                    A2: 請確認有開啟定位系統，若仍無法順利進入景點，請回到首頁，點擊 NEXT 重新載入清華八景。程式有時處於閒置狀態所以沒偵測到使用者位置，若有其他狀況，可通過問題回報表單聯繫我們！<br></br><br></br>
                    Q3: 完成八個點的服學時數及小禮物如何領取？<br></br>
                    A3: 請確認卡片倉庫第一張卡片是成功解鎖的紀念章圖樣，並且填寫完畢評分表單，即可到系辦登記與領取獎勵。<br></br><br></br>
                    ＊小提醒：重整頁面會造成程式錯誤，若無法成功載入已獲得卡片、已抵達地點等等資訊，請回到首頁，點擊 NEXT 重新載入清華八景，即可解決。</small>
                </Card.Footer>
              </Card>
            </Carousel.Item>
          </Carousel>
        </TabPane>
      </Tabs>
    </>
  );
}

export default PoI;
