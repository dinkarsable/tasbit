import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Habit() {
    const [habits, setHabits] = useState([]);
    const [habitName, setHabitName] = useState('');
    const [habitCount, setHabitCount] = useState('');
    const [sound, setSound] = useState();

    useEffect(() => {
        loadHabits();
    }, []);

    useEffect(() => {
        saveHabits();
    }, [habits]);
    async function playDoneSound() {
        const { sound } = await Audio.Sound.createAsync(require('../sound/done.wav'));
        setSound(sound);
        await sound.playAsync();
    }

    const addHabit = () => {
        if (habitName.trim() !== '' && habitCount.trim() !== '' && !isNaN(habitCount)) {
            const newHabit = {
                id: Date.now().toString(),
                name: habitName,
                count: parseInt(habitCount),
                defaultCount: parseInt(habitCount), // Set defaultCount to initial count
            };

            setHabits((prevHabits) => [...prevHabits, newHabit]);
            setHabitName('');
            setHabitCount('');
        }
    };

    const resetAllHabitCounts = () => {
        Alert.alert(
            'Reset',
            'Wanna Start New Day..?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        const updatedHabits = habits.map((habit) => ({
                            ...habit,
                            count: habit.defaultCount, // Reset count to default value
                        }));

                        setHabits(updatedHabits);
                        saveHabits(updatedHabits);
                    },
                },
            ],
            { cancelable: true }
        );
    };


    const deleteHabit = (habitId) => {
        const updatedHabits = habits.filter((habit) => habit.id !== habitId);
        setHabits(updatedHabits);
        saveHabits(updatedHabits);
    };

    const decreaseHabitCount = (habitId) => {
        const updatedHabits = habits.map((habit) => {
            if (habit.id === habitId && habit.count > 0) {
                return {
                    ...habit,
                    count: habit.count - 1,
                };
            }
            return habit;
        });
        setHabits(updatedHabits);
        saveHabits(updatedHabits);
        playDoneSound();
    };

    const loadHabits = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('habits');
            const savedHabits = JSON.parse(jsonValue);
            if (savedHabits) {
                setHabits(savedHabits);
            }
        } catch (error) {
            console.log('Error loading habits:', error);
        }
    };

    const saveHabits = async (habitsToSave) => {
        try {
            await AsyncStorage.setItem('habits', JSON.stringify(habitsToSave || habits));
        } catch (error) {
            console.log('Error saving habits:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Habits</Text>
            <TouchableOpacity onPress={resetAllHabitCounts} style={styles.resetButton}>
                <Text style={styles.buttonText}><FontAwesome name="rotate-right" style={{ fontSize: 30, }} /></Text>
            </TouchableOpacity>
            <ScrollView style={styles.habitList}>
                {habits.map((habit) => (
                    <TouchableOpacity key={habit.id} style={styles.habitItem} onPress={() => decreaseHabitCount(habit.id)}>
                        <FontAwesome name="check-circle" style={{ fontSize: 25, color: '#4CAF50' }} />
                        <View style={styles.habitInfo}>
                            <Text style={styles.habitName}>{habit.name}</Text>
                            <Text style={styles.habitCount}>{habit.count}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteHabit(habit.id)} style={styles.deleteButton}>
                            <FontAwesome name="trash" style={styles.icon} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputField}
                    placeholder="Habit Name"
                    placeholderTextColor={'gray'}
                    value={habitName}
                    onChangeText={(text) => setHabitName(text)}
                />
                <TextInput
                    style={styles.inputFieldCount}
                    placeholder="Count"
                    placeholderTextColor={'gray'}
                    value={habitCount}
                    onChangeText={(text) => setHabitCount(text)}
                    keyboardType="numeric"
                />
                <TouchableOpacity onPress={addHabit} style={styles.addButton}>
                    <FontAwesome name="check-square" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        paddingTop: 50,
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: '700',
        color: 'white',
    },
    habitList: {
        flex: 1,
        width: '100%',
        marginBottom: 1,
        paddingHorizontal: 15
    },
    habitItem: {
        backgroundColor: '#4CAF5030',

        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 7,
        marginTop: 8,
        width: '100%',
        fontSize: 15,
        borderRadius: 10,
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    habitInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    habitName: {
        flex: 1,
        marginRight: 10,
        color: 'white',
        fontSize: 18,
    },
    habitCount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
        color: 'white',
    },
    deleteButton: {
        marginLeft: 10,
    },
    resetButton: {
        borderRadius: 50,
        padding: 6,
        marginBottom: 10,
        backgroundColor: '#191919',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    icon: {
        fontSize: 25,
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 5,
        paddingHorizontal: 15
    },
    inputField: {
        backgroundColor: '#191919',
        color: 'white',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    inputFieldCount: {
        backgroundColor: '#191919',
        color: 'white',
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    addButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
    },
});
