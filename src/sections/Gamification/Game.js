import { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import ProgressCircle from 'react-native-progress/Circle';
// @react-navigation
import { useNavigation } from '@react-navigation/native';
// hooks
import { getUsers } from '../../hooks/getUsers';
// firebase
import { firestore } from '../../utils/firebase';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// components
import Toast from 'react-native-toast-message';
import palette from '../../theme/palette';
import ScoreDisplay from './ScoreDisplay';

// ----------------------------------------------------------------------

const WASTE_DATA = [
    { item: 'Banana Peel', type: 'Organic' },
    { item: 'Plastic Bottle', type: 'Plastic' },
    { item: 'Newspaper', type: 'Paper' },
    { item: 'Aluminum Can', type: 'Metal' },
    { item: 'Glass Jar', type: 'Glass' },
    { item: 'Pizza Box (Greasy)', type: 'General' }, // Cannot be recycled due to grease
    { item: 'Milk Carton (Wax Coated)', type: 'General' }, // Often not recyclable due to coating
    { item: 'Used Tissue Paper', type: 'General' }, // Not recyclable when soiled
    { item: 'Plastic Bag', type: 'Plastic' }, // Should not go into curbside bin
    { item: 'Broken Mirror', type: 'Hazardous' }, // Can be dangerous and not recyclable
    { item: 'Fluorescent Light Bulb', type: 'Hazardous' }, // Contains mercury
    { item: 'Used Battery', type: 'Hazardous' },
    { item: 'Paint Can (With Paint)', type: 'Chemical' },
    { item: 'Empty Pesticide Bottle', type: 'Chemical' },
    { item: 'Cooking Oil', type: 'Organic' }, // Can be composted in some facilities
    { item: 'Food Scraps', type: 'Organic' },
    { item: 'Soda Can', type: 'Metal' },
    { item: 'Shampoo Bottle', type: 'Plastic' },
    { item: 'Cardboard Box', type: 'Paper' },
    { item: 'Magazine', type: 'Paper' },
    { item: 'Window Glass (Broken)', type: 'Hazardous' },
    { item: 'Ceramic Plate', type: 'General' },
    { item: 'Plastic Toy', type: 'General' }, // Often mixed plastic, non-recyclable
    { item: 'Disposable Diaper', type: 'General' }, // Non-recyclable due to human waste
    { item: 'Nail Polish Remover Bottle', type: 'Chemical' },
    { item: 'Aerosol Can (Full)', type: 'Hazardous' },
    { item: 'Receipts (Thermal Paper)', type: 'General' }, // Often coated and not recyclable
    { item: 'Chewing Gum', type: 'General' }, // Not compostable or recyclable
    { item: 'Toothpaste Tube', type: 'General' }, // Mixed materials
    { item: 'Plastic Straw', type: 'Plastic' },
    { item: 'Cigarette Butt', type: 'Hazardous' }, // Contains toxic residue
    { item: 'Expired Medicine', type: 'Chemical' },
    { item: 'Rusty Nail', type: 'Metal' },
    { item: 'Cooking Pan', type: 'Metal' },
    { item: 'Glass Light Bulb (Incandescent)', type: 'Hazardous' },
    { item: 'Envelope with Plastic Window', type: 'General' }, // Mixed material
    { item: 'Foil Wrapper (Chocolate)', type: 'General' },
    { item: 'Styrofoam Cup', type: 'Plastic' }, // Non-recyclable in most places
    { item: 'Tea Bag (With Staple)', type: 'General' },
    { item: 'Broken Thermometer (Mercury)', type: 'Hazardous' }
];

const ALL_TYPES = ['Plastic', 'Paper', 'Organic', 'Metal', 'Glass', 'Hazardous', 'Chemical', 'General'];

const SCREEN_WIDTH = Dimensions.get('window').width;

const GRID_POSITIONS = [
    { top: 150, left: SCREEN_WIDTH * 0.05 },
    { top: 150, left: SCREEN_WIDTH * 0.35 },
    { top: 150, left: SCREEN_WIDTH * 0.65 },
    { top: 300, left: SCREEN_WIDTH * 0.05 },
    { top: 300, left: SCREEN_WIDTH * 0.35 },
    { top: 300, left: SCREEN_WIDTH * 0.65 },
];

// ----------------------------------------------------------------------

export default function Game() {
    const { userData } = getUsers();
    const navigation = useNavigation();
    const [score, setScore] = useState(0);
    const [visibleTypes, setVisibleTypes] = useState([]);
    const [wrongCount, setWrongCount] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState({});
    const [currentWasteIndex, setCurrentWasteIndex] = useState(0);
    const [shuffledWasteData, setShuffledWasteData] = useState([]);

    const timeoutsRef = useRef([]);
    const intervalsRef = useRef([]);
    const currentWasteRef = useRef([]);

    useEffect(() => {
        currentWasteRef.current = shuffledWasteData[currentWasteIndex % shuffledWasteData.length] || {};
    }, [currentWasteIndex, shuffledWasteData]);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    useEffect(() => {
        setShuffledWasteData(shuffleArray(WASTE_DATA));
    }, []);

    const getVisibleDuration = (score) => {
        if (score >= 40) return 2;
        if (score >= 25) return 3;
        if (score >= 10) return 4;
        return 5;
    };

    const currentWaste = shuffledWasteData[currentWasteIndex % shuffledWasteData.length] || {};

    useEffect(() => {
        if (showResult) return;

        const interval = setInterval(() => {
            const randomType = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];

            setVisibleTypes((prevVisibleTypes) => {
                if (prevVisibleTypes.find((item) => item.type === randomType)) {
                    return prevVisibleTypes;
                }

                const occupiedIndices = prevVisibleTypes.map((item) =>
                    GRID_POSITIONS.findIndex(
                        (pos) => pos.top === item.position.top && pos.left === item.position.left
                    )
                );

                const availableIndices = GRID_POSITIONS
                    .map((_, idx) => idx)
                    .filter((i) => !occupiedIndices.includes(i));

                if (availableIndices.length === 0) return prevVisibleTypes;

                const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                const position = GRID_POSITIONS[randomIdx];
                const id = `${randomType}-${Date.now()}`;
                const visibleDuration = getVisibleDuration(score);

                const removeTimeout = setTimeout(() => {
                    setVisibleTypes((prev) => prev.filter((t) => t.id !== id));
                    setTimer((prev) => {
                        const updated = { ...prev };
                        delete updated[randomType];
                        return updated;
                    });

                    if (randomType === currentWasteRef.current.type) {
                        setWrongCount((prevWrong) => {
                            const newWrongCount = prevWrong + 1;

                            if (newWrongCount >= 3) {
                                setShowResult(true);
                                saveHighestScore(score);
                            }

                            return newWrongCount;
                        });
                    }
                }, visibleDuration * 1000);

                timeoutsRef.current.push(removeTimeout);

                let timeLeft = visibleDuration;
                setTimer((prev) => ({ ...prev, [randomType]: timeLeft }));
                const countdown = setInterval(() => {
                    timeLeft--;
                    setTimer((prev) => ({ ...prev, [randomType]: timeLeft }));
                    if (timeLeft <= 0) clearInterval(countdown);
                }, 1000);
                intervalsRef.current.push(countdown);

                return [...prevVisibleTypes, { id, type: randomType, position }];
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, [score, showResult]);

    const saveHighestScore = async (newScore) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const userRef = doc(firestore, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const existingScore = userSnap.data().totalScore || 0;
                if (newScore > existingScore) {
                    await setDoc(userRef, { totalScore: newScore }, { merge: true });
                }
            } else {
                await setDoc(userRef, { totalScore: newScore });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to save score. Please try again later.', text2: error.message });
        }
    };

    const handleMatch = (clickedType) => {
        const isCorrect = clickedType === currentWaste.type;
        const nextScore = isCorrect ? score + 1 : score;
        const nextWrongCount = isCorrect ? wrongCount : wrongCount + 1;

        if (nextWrongCount >= 3) {
            setShowResult(true);
            saveHighestScore(nextScore);
        }

        if (isCorrect) {
            setScore((prev) => prev + 1);
        } else {
            setWrongCount((prev) => prev + 1);
        }

        timeoutsRef.current.forEach(clearTimeout);
        intervalsRef.current.forEach(clearInterval);
        timeoutsRef.current = [];
        intervalsRef.current = [];

        setVisibleTypes([]);
        setTimer({});
        setCurrentWasteIndex((prev) => prev + 1);
    };

    const resetGame = () => {
        setScore(0);
        setWrongCount(0);
        setCurrentWasteIndex(0);
        setVisibleTypes([]);
        setShowResult(false);
        setTimer({});
        setShuffledWasteData(shuffleArray(WASTE_DATA));
        timeoutsRef.current = [];
        intervalsRef.current = [];
    };

    if (shuffledWasteData.length === 0) return null;

    return (
        <ImageBackground
            source={require('../../../assets/background-game.webp')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            resizeMode="cover"
        >
            {!showResult ? (
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <ScoreDisplay score={score} wrongCount={wrongCount} />

                    <View
                        style={{
                            width: SCREEN_WIDTH,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            padding: 15,
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ fontSize: 18 }}>Tap the correct waste type for 👆</Text>
                        <Text style={{ fontSize: 22, fontWeight: 700 }}>{currentWaste.item}</Text>
                    </View>

                    <View style={{ width: SCREEN_WIDTH }}>
                        {visibleTypes.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleMatch(item.type)}
                                style={[
                                    {
                                        position: 'absolute',
                                        width: 110,
                                        height: 110,
                                        borderRadius: 55,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: palette.primary.light,
                                        margin: 10,
                                    },
                                    { top: item.position.top, left: item.position.left },
                                ]}
                            >
                                <ProgressCircle
                                    size={110}
                                    progress={(timer[item.type] || 0) / getVisibleDuration(score)}
                                    color={palette.primary.main}
                                    unfilledColor="#e0e0e0"
                                    borderWidth={0}
                                    thickness={6}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    }}
                                />

                                <Text style={{ fontSize: 16, zIndex: 1 }}>{item.type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View >
            ) : (
                <View style={{
                    backgroundColor: '#fff',
                    width: SCREEN_WIDTH,
                    padding: 60,
                    alignItems: 'center',
                    borderTopWidth: 20,
                    borderBottomWidth: 20,
                }}>
                    <Text style={{ fontSize: 30, fontWeight: 700, marginBottom: 20 }}>
                        GAME OVER!
                    </Text>
                    <Text style={{ fontSize: 16 }}>Highest score: {userData?.totalScore}</Text>
                    <Text style={{ fontSize: 16 }}>Your score: {score}</Text>
                    <TouchableOpacity
                        onPress={resetGame}
                        style={{ backgroundColor: palette.primary.main, padding: 20, borderRadius: 50, marginVertical: 20 }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 700 }}>Play Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "ActivitiesStack", params: { screen: "Activities" } })}>
                        <Text style={{ color: palette.primary.main, fontWeight: 700 }}>Return</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ImageBackground>
    );
}