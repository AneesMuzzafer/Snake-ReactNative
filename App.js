import React from "react"
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const directions = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    UP: "UP",
    DOWN: "DOWN"
};

const stages = {
    STARTMENU: "START",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    GAMEOVER: "GAMEOVER"
};

let cd = null;
var previousHead;
var previousItem = { x: null, y: null };
var temp = { x: null, y: null };
var sb;
var cheadpos;
var cfoodpos;

const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

export default function App() {

    const [gameStage, setGameStage] = React.useState(stages.STARTMENU);
    const [snakeBody, setSnakeBody] = React.useState([]);
    const [currentHeadPosition, setCurrentHeadPosition] = React.useState({ x: windowWidth / 2, y: windowHeight / 2 });
    const [currentFoodPosition, setCurrentFoodPosition] = React.useState({ x: Math.floor(Math.random() * (windowWidth - 80)) + 40, y: Math.floor(Math.random() * (windowHeight - 120)) + 60 });
    const [currentDirection, setCurrentDirection] = React.useState(directions.LEFT);


    const [score, setScore] = React.useState(0);



    React.useEffect(() => {

        let interval;
        if (gameStage === stages.PLAYING) {
            setSnakeBody([...snakeBody, { x: currentHeadPosition.x + 20, y: currentHeadPosition.y }, { x: currentHeadPosition.x + 40, y: currentHeadPosition.y }, { x: currentHeadPosition.x + 60, y: currentHeadPosition.y }, { x: currentHeadPosition.x + 80, y: currentHeadPosition.y }]);
            interval = setInterval(() => {
                updateFrame();
            }, 50);
        }
        return () => clearInterval(interval);
    }, [gameStage])


    const updateFrame = () => {
        setCurrentDirection((c) => {
            cd = c;
            return c
        });



        if (cd === directions.RIGHT) {
            setCurrentHeadPosition((prev) => {
                if (prev.x > windowWidth - 40) {
                    return { x: 20, y: prev.y }
                }
                return { x: prev.x + 20, y: prev.y }
            });
        } else if (cd === directions.LEFT) {
            setCurrentHeadPosition((prev) => {
                if (prev.x < 40) {
                    return { x: windowWidth - 20, y: prev.y }
                }
                return { x: prev.x - 20, y: prev.y }
            });
        } else if (cd === directions.UP) {
            setCurrentHeadPosition((prev) => {
                if (prev.y < 60) {
                    return { x: prev.x, y: windowHeight - 20 }
                }
                return { x: prev.x, y: prev.y - 20 }
            });
        } else if (cd === directions.DOWN) {
            setCurrentHeadPosition((prev) => {
                if (prev.y > windowHeight - 20) {
                    return { x: prev.x, y: 60 }
                }
                return { x: prev.x, y: prev.y + 20 }
            });
        }
        if (cd !== directions.PAUSE) {
            setSnakeBody((sbs) => {
                sb = sbs;
                return sbs;
            });


            sb.forEach((bodyItem, index) => {
                temp.x = bodyItem.x;
                temp.y = bodyItem.y;

                if (index === 0) {

                    setCurrentHeadPosition((previ) => {
                        bodyItem.x = previ.x;
                        bodyItem.y = previ.y;
                        return previ;
                    });


                } else {

                    bodyItem.x = previousItem.x;
                    bodyItem.y = previousItem.y;
                }
                previousItem.x = temp.x;
                previousItem.y = temp.y;
            });

            setSnakeBody(sb);
        }

        // xHeadLow = currentHeadPosition.x - 10;
        // xHeadHigh = currentHeadPosition.x + 10;

        // xFoodLow = currentFoodPosition.x - 5;
        // xFoodHigh = currentFoodPosition.x + 5;

        setCurrentHeadPosition((chp) => {
            cheadpos = chp;
            return chp;
        });
        setCurrentFoodPosition((cfp) => {
            cfoodpos = cfp;
            return cfp;
        });


        if (intersectRect(cheadpos, cfoodpos)) {


            console.log("yekia")

            setCurrentFoodPosition({ x: Math.floor(Math.random() * (windowWidth - 80)) + 40, y: Math.floor(Math.random() * (windowHeight - 120)) + 60 });
            addBody();
            addBody();
            setScore(prev => prev + 100);
        }

        //commit

        sb.forEach((item, index) => {
            // console.log("item", i, "----- cheadpos", cheadpos)
            if (index > 0) {
                if (intersectRect2(cheadpos, item)) {
                    console.log("makliov", cheadpos, item);
                    setGameStage(stages.GAMEOVER);
                    setCurrentHeadPosition({ x: windowWidth / 2, y: windowHeight / 2 });
                    setTimeout(() => {
                        setSnakeBody([]);
                        setCurrentFoodPosition({ x: Math.floor(Math.random() * windowWidth), y: Math.floor(Math.random() * windowHeight) });
                        setCurrentDirection(directions.LEFT);
                    }, 10);

                    // setCurrentDirection(directions.PAUSE);
                }
            }

        })



    }


    const intersectRect = (r1, r2) => {

        // console.log("head",r1);
        // console.log("food",r2);


        return !(r2.x - 5 > r1.x + 10 ||
            r2.x + 5 < r1.x - 10 ||
            r2.y - 5 > r1.y + 10 ||
            r2.y + 5 < r1.y - 10);
    }

    const intersectRect2 = (r1, r2) => {

        // console.log("head",r1);
        // console.log("food",r2);


        return !(r2.x - 9 > r1.x + 9 ||
            r2.x + 9 < r1.x - 9 ||
            r2.y - 9 > r1.y + 9 ||
            r2.y + 9 < r1.y - 9);
    }

    const addBody = () => {
        setSnakeBody((prev) => {
            return [...prev, { x: prev[prev.length - 1].x, y: prev[prev.length - 1].y }]
            X
        });
    }


    const onSwipe = (gestureName) => {

        console.log(gestureName);
        // const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        // this.setState({ gestureName: gestureName });
        switch (gestureName) {
            case SWIPE_UP:
                if (currentDirection != directions.DOWN) {
                    setCurrentDirection(directions.UP)
                }
                break;
            case SWIPE_DOWN:
                if (currentDirection != directions.UP) {
                    setCurrentDirection(directions.DOWN)
                } break;
            case SWIPE_LEFT:
                if (currentDirection != directions.RIGHT) {
                    setCurrentDirection(directions.LEFT)
                }
                break;
            case SWIPE_RIGHT:
                if (currentDirection != directions.LEFT) {
                    setCurrentDirection(directions.RIGHT)
                }
                break;
        }
    }


    const renderSnake = () => {


        return (
            <>
                <View style={{ position: "absolute", left: currentHeadPosition.x ? currentHeadPosition.x : 0, top: currentHeadPosition.y ? currentHeadPosition.y : 0, width: 0, height: 0, }}>
                    <View style={{ position: "absolute", width: 20, height: 20, top: -10, left: -10, backgroundColor: "blue", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "white" }}>H</Text>
                    </View>
                </View>
                {
                    snakeBody.map((bodyPart, i) => {
                        return (
                            <View key={i} style={{ position: "absolute", left: bodyPart ? bodyPart.x : 0, top: bodyPart ? bodyPart.y : 0, width: 0, height: 0, }}>
                                <View style={{ position: "absolute", width: 20, height: 20, top: -10, left: -10, backgroundColor: "blue", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "white" }}>{i}</Text>
                                </View>
                            </View>
                        );
                    })
                }
            </>
        )
    };

    const renderFood = () => {
        return (
            <View style={{ position: "absolute", left: currentFoodPosition.x ? currentFoodPosition.x : 0, top: currentFoodPosition.y ? currentFoodPosition.y : 0, width: 0, height: 0 }}>
                <View style={{ width: 10, height: 10, top: -5, left: -5, backgroundColor: "red", justifyContent: "center", alignItems: "center" }}>
                    <Text>0</Text>
                </View>
            </View>
        );
    }


    return (
        <View style={{ flex: 1 }}>
            {gameStage === stages.STARTMENU &&
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => setGameStage(stages.PLAYING)} style={styles.button}><Text>START</Text></TouchableOpacity>
                </View>
            }
            {gameStage === stages.PLAYING &&
                <GestureRecognizer
                    config={{
                        velocityThreshold: 0.3,
                        directionalOffsetThreshold: 80
                    }}
                    onSwipe={(direction) => onSwipe(direction)}
                    style={styles.container}>
                    {renderSnake()}
                    {renderFood()}
                    {/* <View style={{ position: "absolute", bottom: 0, width: 200, height: 200, left: windowWidth / 2 - 100, backgroundColor: "grey", alignItems: "center" }}>
                        <Text style={{ color: "white" }}>{score}</Text>
                        <TouchableOpacity onPress={() => setCurrentDirection(directions.UP)} style={styles.button}><Text>UP</Text></TouchableOpacity>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={() => setCurrentDirection(directions.LEFT)} style={styles.button}><Text>LEFT</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setCurrentDirection(directions.PAUSE)} style={styles.button}><Text>PAUSE</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => addBody()} style={styles.button}><Text>ADD</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setCurrentDirection(directions.RIGHT)} style={styles.button}><Text>RIGHT</Text></TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setCurrentDirection(directions.DOWN)} style={styles.button}><Text>DOWN</Text></TouchableOpacity>

                    </View> */}
                </GestureRecognizer>
            }
            {gameStage === stages.GAMEOVER &&
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Game Over!</Text>
                    <TouchableOpacity onPress={() => setGameStage(stages.STARTMENU)} style={styles.button}><Text>PLAY AGAIN</Text></TouchableOpacity>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 50,
        height: 50,
        backgroundColor: "green",
        margin: 10,
        marginHorizontal: 0,
        justifyContent: "center",
        alignItems: "center"
    }
});
