import './App.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";
import {Button, Container, FormControlLabel, Paper, Stack, Switch, TextField, Typography} from "@mui/material";

const MainMenu = ({chickenState, full, channelID, setPlayerType, setUserId, setGameID, userList}) => {
    const [tempID, setTempID] = useState("");
    const [isChicken, setChicken] = useState(true);

    const createGame = () => {
        const randomID = Math.floor(Math.random() * 10000)
        setGameID(randomID.toString());
    }

    const joinGame = () => {
        console.log(tempID);
        setGameID(tempID);
    }

    const startGame = () => {
        setPlayerType(isChicken);
    }

    return (
        <div className="App">
            <Container maxWidth="md">
                <Typography className="title" variant="h1" gutterBottom={true}>Crossy Battle</Typography>

                {userList.length === 0 && <div className="buttons">
                    <Stack spacing={2}>
                        <Stack direction="row">
                            <Typography variant="h3">NAME: </Typography>
                            <TextField id="setName" label="Set Your Name" variant="outlined"
                                       onChange={(e) => setUserId(e.target.value)}/>
                        </Stack>
                        <div className="create-game">
                            <Button
                                className="create-game-button"
                                variant="contained"
                                onClick={createGame}>
                                Create Game
                            </Button>
                        </div>
                        <Stack className="join-game" spacing={2}>
                            <TextField id="join-game" label="Game ID" variant="outlined"
                                       onChange={(e) => setTempID(e.target.value)}/>
                            <Button
                                className="join-game-button"
                                variant="contained"
                                onClick={joinGame}>
                                Join Game
                            </Button>
                        </Stack>
                        {full && <Paper elevation={4} sx={{p: 2}}>
                            <Typography variant="body">That game is already full!</Typography>
                        </Paper>}
                    </Stack>
                </div>}
                {userList.length !== 0 &&
                    <Stack spacing={2} direction="column">
                        <Typography variant="h2">PLAYERS:</Typography>
                        <Typography variant="body">{JSON.stringify(userList)}</Typography>
                        <Typography variant="h3">Game ID: {channelID}</Typography>
                        <FormControlLabel
                            control={<Switch checked={isChicken}
                                             onChange={(e) => setChicken(e.target.checked)}/>}
                            label="Chicken"/>
                        <Button disabled={chickenState === 1} variant="outlined" onClick={startGame}>Start Game</Button>
                        {chickenState === -1 && <Paper elevation={4} sx={{p: 2}}>
                            <Typography variant="body">Both Players Cannot Select Chicken</Typography>
                        </Paper>}
                        {chickenState === -2 && <Paper elevation={4} sx={{p: 2}}>
                            <Typography variant="body">One Player Must Select Chicken</Typography>
                        </Paper>}
                    </Stack>
                }
                {chickenState === 2 && <Navigate to="/chicken" />}
                {chickenState === 3 && <Navigate to="/driver" />}
            </Container>
        </div>
    );
}

export default MainMenu;
