import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const WASTE_DATA = [
    { item: '🍌 Banana Peel', type: 'Organic' },
    { item: '🧴 Plastic Bottle', type: 'Plastic' },
    { item: '📰 Newspaper', type: 'Paper' },
    { item: '🥫 Aluminum Can', type: 'Metal' },
    { item: '🫙 Glass Jar', type: 'Glass' },
];

const ALL_TYPES = [
    'Plastic',
    'Paper',
    'Organic',
    'Metal',
    'Glass',
    'Wood',
    'Textile',
    'Electronic',
    'Hazardous',
    'Composite',
    'Food Waste',
];

const SCREEN_WIDTH = Dimensions.get('window').width;

const GRID_POSITIONS = [
    { top: 150, left: SCREEN_WIDTH * 0.15 },
    { top: 150, left: SCREEN_WIDTH * 0.45 },
    { top: 150, left: SCREEN_WIDTH * 0.75 },
    { top: 300, left: SCREEN_WIDTH * 0.15 },
    { top: 300, left: SCREEN_WIDTH * 0.45 },
    { top: 300, left: SCREEN_WIDTH * 0.75 },
];

const WasteSortingGameScreen = () => {
    const [score, setScore] = useState(0);
    const [visibleTypes, setVisibleTypes] = useState([]);
    const [usedGridIndices, setUsedGridIndices] = useState([]);
    const [currentWasteIndex, setCurrentWasteIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState({});
    const timeoutsRef = useRef([]);

    const currentWaste = WASTE_DATA[currentWasteIndex];

    useEffect(() => {
        if (currentWasteIndex >= WASTE_DATA.length) return;
    
        const interval = setInterval(() => {
            const randomType = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
    
            setVisibleTypes((prevVisibleTypes) => {
                if (prevVisibleTypes.find((item) => item.type === randomType)) {
                    return prevVisibleTypes;
                }
    
                // Get available grid positions (excluding used ones)
                const availableIndices = GRID_POSITIONS.map((_, idx) => idx).filter(i => !usedGridIndices.includes(i));
    
                if (availableIndices.length === 0) return prevVisibleTypes;  // No available positions left
    
                const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                const position = GRID_POSITIONS[randomIdx];
                setUsedGridIndices(prev => [...prev, randomIdx]); // Mark position as used
    
                const timeout = setTimeout(() => {
                    setVisibleTypes(prev => prev.filter(t => t.type !== randomType)); // Remove the type after 5 seconds
                    setUsedGridIndices(prev => prev.filter(i => i !== randomIdx)); // Free up the position
                    setTimer((prev) => ({ ...prev, [randomType]: 0 })); // Clear timer
                }, 5000);
    
                timeoutsRef.current.push(timeout);
    
                setTimer((prev) => ({ ...prev, [randomType]: 5 }));
    
                const countdownInterval = setInterval(() => {
                    setTimer((prev) => {
                        const newTime = prev[randomType] - 1;
                        if (newTime <= 0) {
                            clearInterval(countdownInterval);
                        }
                        return { ...prev, [randomType]: newTime };
                    });
                }, 1000);
    
                return [...prevVisibleTypes, { type: randomType, position }];
            });
        }, 1000);
    
        return () => {
            clearInterval(interval);
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, [currentWasteIndex]);
    

    const handleMatch = (clickedType) => {
        if (clickedType === currentWaste.type) {
            setScore(score + 1);
            Alert.alert('✅ Correct!', `${currentWaste.item} goes in ${currentWaste.type}`);
        } else {
            Alert.alert('❌ Incorrect', `You clicked on ${clickedType}. Try again!`);
        }

        timeoutsRef.current.forEach(clearTimeout);
        setVisibleTypes([]);
        setUsedGridIndices([]);

        const nextIndex = currentWasteIndex + 1;
        if (nextIndex < WASTE_DATA.length) {
            setCurrentWasteIndex(nextIndex);
        } else {
            setShowResult(true);
        }
    };

    const resetGame = () => {
        setScore(0);
        setCurrentWasteIndex(0);
        setVisibleTypes([]);
        setUsedGridIndices([]);
        setShowResult(false);
        setTimer({});
        timeoutsRef.current = [];
    };

    if (showResult) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>🎉 Game Over!</Text>
                <Text style={styles.score}>Your score: {score} / {WASTE_DATA.length}</Text>
                <TouchableOpacity style={styles.button} onPress={resetGame}>
                    <Text style={styles.buttonText}>🔁 Play Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>♻️ Waste Sorting Reflex Game</Text>
            <Text style={styles.instruction}>Tap the correct type when it appears!</Text>
            <Text style={styles.item}>{currentWaste.item}</Text>

            {visibleTypes.map((item, index) => (
                <TouchableOpacity
                    key={`${item.type}-${index}`}
                    onPress={() => handleMatch(item.type)}
                    style={[styles.typeContainer, { top: item.position.top, left: item.position.left }]}
                >
                    <Text style={styles.typeText}>{item.type}</Text>
                    {/* Progress Bar for Timer */}
                    <ProgressBar
                        progress={timer[item.type] / 5} // Calculate the progress
                        width={100}
                        height={10}
                        color="#4CAF50"
                        borderWidth={0}
                        style={styles.progressBar}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8f5',
        paddingTop: 60,
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    instruction: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    item: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#22c55e',
        marginBottom: 20,
    },
    typeContainer: {
        position: 'absolute',
        backgroundColor: '#dbeafe',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    typeText: {
        fontSize: 18,
    },
    progressBar: {
        marginTop: 8,
    },
    button: {
        backgroundColor: '#10b981',
        padding: 14,
        borderRadius: 10,
        position: 'absolute',
        bottom: 40,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    score: {
        fontSize: 20,
        marginVertical: 20,
    },
});

export default WasteSortingGameScreen;
