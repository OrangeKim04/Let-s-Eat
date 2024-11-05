import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebaseConfig'; // Firebase 설정 파일에서 db 가져오기
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function Main({ navigation }) {
  const [rooms, setRooms] = useState([]);

  // Firestore에서 방 목록 가져오기
  useEffect(() => {
    const fetchRooms = async () => {
      const roomsCollection = collection(db, 'rooms'); // 'rooms' 컬렉션 참조
      const roomSnapshot = await getDocs(roomsCollection);
      const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomList);
    };

    fetchRooms();
  }, []);

  // 방 추가 함수
  const addRoom = async (roomDetails) => {
    try {
      const docRef = await addDoc(collection(db, 'rooms'), roomDetails); // Firestore에 방 추가
      setRooms([{ ...roomDetails, id: docRef.id }, ...rooms]); // 상태 업데이트
    } catch (error) {
      Alert.alert('오류', '방 추가에 실패했습니다.');
    }
  };

  // 방 상세 페이지로 이동하는 함수
  const goToRoomDetail = (room) => {
    navigation.navigate('RoomDetail', { room });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateRoom', { addRoom })}>
        <Text style={styles.buttonText}>방 만들기</Text>
      </TouchableOpacity>

      <Text style={styles.title}>방 목록</Text>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToRoomDetail(item)}>
            <View style={styles.roomContainer}>
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.roomDetails}>생성 시간: {item.createdAt}</Text>
              <Text style={styles.roomDetails}>인원: {item.people}</Text>
              <Text style={styles.roomDetails}>장소: {item.location}</Text>
              <Text style={styles.roomDetails}>메뉴: {item.menu}</Text>
              <Text style={styles.roomDetails}>약속 시간: {item.meetingTime}</Text>
            </View>
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
  button: {
    width: 80,
    backgroundColor: '#ffaa00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
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
