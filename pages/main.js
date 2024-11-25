import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, push, set, off } from 'firebase/database';
import { getApp } from 'firebase/app';  // Firebase app 가져오기
import { firebaseConfig } from '../firebaseConfig';  // 경로를 조정하세요


// Firebase 초기화
const app = getApp(firebaseConfig);
const database = getDatabase(app);

export default function Main({ navigation }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const roomsRef = ref(database, 'rooms');
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const roomsList = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setRooms(roomsList);
    });

    // Cleanup on unmount
    return () => off(roomsRef, 'value', unsubscribe);
  }, []);

  const addRoom = (roomDetails) => {
    const newRoomRef = push(ref(database, 'rooms'));
    set(newRoomRef, { ...roomDetails, id: newRoomRef.key });
  };

  const goToRoomDetail = (room) => {
    navigation.navigate('RoomDetail', { room });
  };

  return (
    <View style={styles.container}>
      <Button title="방 만들기" onPress={() => navigation.navigate('CreateRoom', { addRoom })} />
      <Text style={styles.title}>방 목록</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToRoomDetail(item)} style={styles.roomContainer}>
            <Text style={styles.roomName}>{item.name}</Text>
            <Text style={styles.roomDetails}>생성 시간: {item.createdAt}</Text>
            <Text style={styles.roomDetails}>인원: {item.people}명</Text>
            <Text style={styles.roomDetails}>장소: {item.location}</Text>
            <Text style={styles.roomDetails}>메뉴: {item.menu}</Text>
            <Text style={styles.roomDetails}>약속 시간: {item.meetingTime}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  roomContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    height: 125,
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomDetails: {
    fontSize: 14,
    color: '#888',
  },
  list: {
    flex: 1,
    padding: 10,
  },
});
