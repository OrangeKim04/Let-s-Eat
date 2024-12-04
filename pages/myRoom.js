import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function MyRooms({ navigation }) {
  // 가상 데이터로 내가 만든 방 설정
  const [myRooms, setMyRooms] = useState([
    {
      id: 1,
      name: '테스트 방 1',
      createdAt: '2024-12-04 10:00',
      people: ['User1', 'User2'],
      maxCapacity: 5,
    },
    {
      id: 2,
      name: '테스트 방 2',
      createdAt: '2024-12-03 14:30',
      people: ['User3'],
      maxCapacity: 3,
    },
  ]);

  const handleRoomPress = (room) => {
    // RoomDetail 페이지로 이동
    navigation.navigate('RoomDetail', { room });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내가 만든 방</Text>
      <FlatList
        data={myRooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.roomItem}
            onPress={() => handleRoomPress(item)}
          >
            <Text style={styles.roomName}>{item.name}</Text>
            <Text style={styles.roomDetails}>
              인원: {item.people.length}/{item.maxCapacity}
            </Text>
            <Text style={styles.roomDetails}>생성 시간: {item.createdAt}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  roomItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roomName: { fontSize: 18, fontWeight: 'bold' },
  roomDetails: { fontSize: 14, color: '#555' },
});
