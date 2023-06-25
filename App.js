import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import Tasks from './assets/pages/Tasks';
import Habits from './assets/pages/Habits';

<StatusBar style="auto" />;

export default function App() {
  const [selectedTab, setSelectedTab] = useState('Tasks');
  const contentOffset = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    animateContent(tab === 'Tasks' ? 0 : 1);
  };

  const animateContent = (index) => {
    Animated.spring(contentOffset, {
      toValue: index,
      useNativeDriver: true,
    }).start();
  };

  const getTabButtonStyle = (tab) =>
    selectedTab === tab ? styles.activeTabBarButton : styles.tabBarButton;
  const getTabIconColor = (tab) =>
    selectedTab === tab ? 'white' : '#505050';

  const { width } = Dimensions.get('window');

  const contentTranslateX = contentOffset.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1 * width],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.contentContainer,
          { transform: [{ translateX: contentTranslateX }] },
        ]}
      >
        <Tasks />
        <Habits />
      </Animated.View>

      <View style={styles.tabBar}>
        <TouchableWithoutFeedback onPress={() => handleTabPress('Tasks')}>
          <View style={getTabButtonStyle('Tasks')}>
            <FontAwesome
              name="check-square"
              size={30}
              color={getTabIconColor('Tasks')}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => handleTabPress('Habits')}>
          <View style={getTabButtonStyle('Habits')}>
            <FontAwesome
              name="h-square"
              size={30}
              color={getTabIconColor('Habits')}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 35,
  },
  contentContainer: {
    flexDirection: 'row',
    width: '200%',
    height: '100%',
    paddingBottom:30
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    backgroundColor: '#191919',
    marginHorizontal:140,
    borderRadius:50,

  },
  tabBarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingHorizontal:20,
    borderRadius:50,
  },
  activeTabBarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingHorizontal:20,
    backgroundColor:'#303030',
    borderRadius:50,
  },
});
