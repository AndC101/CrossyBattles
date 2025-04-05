import './App.css';
import {TextField, Button} from '@mui/material';
import {useEffect, useState} from "react";


const MainMenu = (setGameID) => {


    const createGame = () => {
        const randomID = Math.floor(Math.random() * 10000)
        setGameID(randomID);
    }

    const joinGame = () => {

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
                        onClick={createGame}>
                        Create Game
                    </Button>
                </div>

                <div className="join-game">
                    <TextField id="join-game" label="Game ID" variant="standard" onChange={setGameID}/>
                    <Button className="join-game-button"
                        onClick={joinGame}>
                        Join Game
                    </Button>
                </div>

            </div>


        </div>
    );
}

export default MainMenu;
