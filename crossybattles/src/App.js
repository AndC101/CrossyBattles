import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chicken from './components/sprites/chicken';
import MainMenu from './MainMenu';
import {useEffect, useState, useRef} from "react";
const URL_WEB_SOCKET = 'ws://localhost:8089';

export default function App() {

    const ws = useRef(null);
    const [channelName, setChannelName] = useState(0);
    const [userId, setUserId] = useState(Math.floor(Math.random() * 1000000));

    useEffect(() => {
        connect();
    }, []);

    const connect = () => {
        const wsClient = new WebSocket(URL_WEB_SOCKET);
        wsClient.onopen = () => {
            console.log('ws opened');
            ws.current = wsClient;
        };

        wsClient.onclose = function(e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function() {
                connect();
            }, 1000);
        };
        wsClient.onmessage = (message) => {
            console.log('ws message received', message.data);
            const parsedMessage = JSON.parse(message.data);
            switch (parsedMessage.type) {
                case 'joined': {
                    const body = parsedMessage.body;
                    console.log('users in this channel', body);
                    break;
                }
                case 'game_start' : {
                    break;
                }
                case 'chicken_position_update': {
                    break;
                }
                case 'offer_sdp_received': {
                    const offer = parsedMessage.body;
                    onAnswer(offer);
                    break;
                }
                case 'answer_sdp_received': {
                    gotRemoteDescription(parsedMessage.body);
                    break;
                }
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
        log.debug('sendWsMessage invoked', type, body);
        ws.current.send(JSON.stringify({
            type,
            body,
        }));
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/chicken" element={<Chicken />} />
                <Route path="/" element={<MainMenu />}/>
            </Routes>
        </BrowserRouter>
    );
}