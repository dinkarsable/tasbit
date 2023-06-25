import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Tasks() {
    const [task, setTask] = useState('');
    const [taskItems, setTaskItems] = useState([]);

    const [sound, setSound] = useState();

    useEffect(() => {
        // Load saved tasks from AsyncStorage on component mount
        loadTasks();
    }, []);

    useEffect(() => {
        // Save tasks to AsyncStorage whenever taskItems state changes
        saveTasks();
    }, [taskItems]);

    async function playDoneSound() {
        const { sound } = await Audio.Sound.createAsync(require('../sound/done.wav'));
        setSound(sound);
        await sound.playAsync();
    }

    const completeTask = (index) => {
        let itemsCopy = [...taskItems];
        itemsCopy.splice(index, 1);
        setTaskItems(itemsCopy);
        playDoneSound();
    };

    const handleAddTask = (priority) => {
        if (task.trim() !== '') {
            const newTask = { task, priority };
            setTaskItems([...taskItems, newTask]);
            setTask('');
        }
    };

    const getPriorityColor = (priority) => {
        if (priority === 'high') return '#FF5252';
        if (priority === 'medium') return '#FFC107';
        if (priority === 'low') return '#4CAF50';
        return '#FFFFFF';
    };

    const saveTasks = async () => {
        try {
            const jsonValue = JSON.stringify(taskItems);
            await AsyncStorage.setItem('tasks', jsonValue);
        } catch (error) {
            console.log('Error saving tasks:', error);
        }
    };

    const loadTasks = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('tasks');
            const savedTasks = JSON.parse(jsonValue);
            if (savedTasks) {
                setTaskItems(savedTasks);
            }
        } catch (error) {
            console.log('Error loading tasks:', error);
        }
    };

    return (
        <View style={styles.MainTaskContainer}>
            <Text style={styles.mainTitle}>Tasks</Text>
            <ScrollView style={styles.taskCont}>
                {taskItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => completeTask(index)}
                        style={[styles.task, {
                            backgroundColor: getPriorityColor(item.priority) + '20',
                            borderColor: getPriorityColor(item.priority),
                        }]}
                    >
                        {item.priority === 'high' && (
                            <FontAwesome name="check-circle" style={[styles.icon, { color: '#FF5252' },]} />
                        )}
                        {item.priority === 'medium' && (
                            <FontAwesome name="check-circle" style={[styles.icon, { color: '#FFC107' }]} />
                        )}
                        {item.priority === 'low' && (
                            <FontAwesome name="check-circle" style={[styles.icon, { color: '#4CAF50' }]} />
                        )}
                        <Text style={styles.taskText}>{item.task}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.inputCont}>
                <TextInput
                    style={styles.inputField}
                    placeholder="New Task...😎"
                    placeholderTextColor={'gray'}
                    value={task}
                    onChangeText={(text) => setTask(text)}
                    maxLength={40}
                />
                <View style={styles.selectors}>
                    <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#FF5252' }]} onPress={() => handleAddTask('high')}>
                        <FontAwesome name="check-circle" style={[styles.icon]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#FFC107' }]} onPress={() => handleAddTask('medium')}>
                        <FontAwesome name="check-circle" style={[styles.icon]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#4CAF50' }]} onPress={() => handleAddTask('low')}>
                        <FontAwesome name="check-circle" style={[styles.icon]} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    MainTaskContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        paddingTop: 50,
    },
    mainTitle: {
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: '700',
        color: 'white',

    },
    taskCont: {
        width: '100%',
        padding: 20,
        flex: 0.8,
    },
    task: {
        backgroundColor: '#191919',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 7,
        marginTop: 8,
        width: '100%',
        fontSize: 15,
        borderRadius: 10,
        borderWidth: 1,
    },
    taskText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
    },
    inputCont: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    inputField: {
        backgroundColor: '#191919',
        color: 'white',
        width: '60%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    priorityButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
        paddingVertical: 1,
        borderRadius: 50,
    },
    icon: {
        fontSize: 29,
        color: 'black',
    },
    selectors: {
        gap: 5,
        flexDirection: 'row',
    },
});
