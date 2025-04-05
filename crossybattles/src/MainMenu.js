import './App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useState} from "react";

const MainMenu = ({setGameID}) => {
    const [tempID, setTempID] = useState("");

    const createGame = () => {
        const randomID = Math.floor(Math.random() * 10000)
        setGameID(randomID.toString());
    }

    const joinGame = () => {
        setGameID(tempID);
    }

    return (
        <div className="App">
            <div className="title">
                Crossy Battles
            </div>

            <div className="buttons">
                <div className="create-game">
                    <Button
                        className="create-game-button"
                        variant="contained"
                        onClick={createGame}>
                        Create Game
                    </Button>
                </div>

                <div className="join-game">
                    <TextField id="join-game" label="Game ID" variant="outlined" onChange={() => setTempID}/>
                    <Button
                        className="join-game-button"
                        variant="contained"
                        onClick={joinGame}>
                        Join Game
                    </Button>
                </div>

            </div>


        </div>
    );
}

export default MainMenu;
