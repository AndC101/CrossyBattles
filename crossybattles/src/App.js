import {BrowserRouter, Route, Routes } from "react-router-dom";
import MainMenu from './MainMenu';
import {useEffect, useRef, useState} from "react";
import Chicken from "./components/players/chicken.js";
import Driver from "./components/players/Driver.js";

const URL_WEB_SOCKET = 'ws://localhost:4000';

export default function App() {

    const ws = useRef(null);
    const [channelName, setChannelName] = useState(0);
    const [userId, setUserId] = useState(Math.floor(Math.random() * 1000000));
    const [users, setUsers] = useState([]);
    const isChicken = useRef(false);
    const [chickenError, setChickenError] = useState(0);
    const [full, setFull] = useState(false);

    useEffect(() => {
        connect();
    }, []);

    const connect = () => {
        const wsClient = new WebSocket(URL_WEB_SOCKET);
        wsClient.onopen = () => {
            console.log('ws opened');
            ws.current = wsClient;
        };

        wsClient.onclose = function (e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function () {
                connect();
            }, 1000);
        };
        wsClient.onmessage = (message) => {
            console.log('ws message received', message.data);
            const parsedMessage = JSON.parse(message.data);
            switch (parsedMessage.type) {
                case 'joined': {
                    const body = parsedMessage.body;
                    console.log("Join Response: " + JSON.stringify(body));
                    if (body[0] === "ERROR") {
                        console.log("MAX GAME, CANNOT JOIN")
                        setFull(true);
                    } else {
                        console.log('users in this channel', body);
                        setUsers(body);
                    }
                    break;
                }
                case 'game_start' : {
                    const body = parsedMessage.body;
                    console.log("Start Response: " + JSON.stringify(body));
                    if (body[0] === "ERROR") {
                        console.log("roles not set");
                        if (body[1]) setChickenError(-1);
                        else setChickenError(-2);
                    } else if (!body[0]) {
                        setChickenError(1);
                    }
                    else {
                        console.log("Starting Game... State: " + JSON.stringify(isChicken.current));
                        if (isChicken.current) setChickenError(2);
                        else setChickenError(3);
                    }
                    break;
                }
                case 'chicken_position_update': {

                    break;
                }
                // case 'offer_sdp_received': {
                //     const offer = parsedMessage.body;
                //     onAnswer(offer);
                //     break;
                // }
                // case 'answer_sdp_received': {
                //     gotRemoteDescription(parsedMessage.body);
                //     break;
                // }
                case 'quit': {
                    break;
                }
                default:
                    break;
            }
        };
        return () => {
            wsClient.close();
        };
    }

    const sendWsMessage = (type, body) => {
        if (ws.current) {
            console.log('sendWsMessage invoked', type, body);
            ws.current.send(JSON.stringify({
                type,
                body,
            }));
        }
    };

    const join = (gameID) => {
        setChannelName(gameID);
        console.log('join invoked by: ' + userId);

        if (!gameID) {
            console.log('channelName is empty');
            alert('channelName is empty');
            return;
        }

        if (!userId) {
            console.log('userId is empty');
            alert('userId is empty');
            return;
        }

        sendWsMessage('join', {
            gameID,
            userId,
        });
    };

    const startGame = (playerType) => {
        isChicken.current = playerType
        const gameID = channelName;
        console.log('startGame invoked by: ' + userId);

        sendWsMessage('start', {
            gameID,
            userId,
            playerType
        });
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"
                       element={<MainMenu full={full}
                                          chickenState={chickenError}
                                          setUserId={setUserId}
                                          channelID={channelName}
                                          setPlayerType={startGame}
                                          userList={users}
                                          setGameID={join}/>}/>
                <Route path="/chicken" element={<Chicken/>}/>
                <Route path="/driver" element={<Driver />} />
            </Routes>
        </BrowserRouter>
    );
}