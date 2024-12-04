import React, { useState, useEffect, useContext } from 'react';
import { Image, View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, onValue, push, set, off } from 'firebase/database';
import { getApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig'; // 경로를 확인하세요
import { NotificationContext } from './notofications/noticeContext';

// Firebase 초기화
const app = getApp(firebaseConfig);
const database = getDatabase(app);

export default function Main({ navigation, route }) {
  const [rooms, setRooms] = useState([]);
  const [originalRooms, setOriginalRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('createdAt');
  const [sortValue, setSortValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

   // 알림 상태 가져오기
   const { unreadCount } = useContext(NotificationContext);

  useEffect(() => {
    const roomsRef = ref(database, 'rooms');
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const roomsList = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        .filter((room) => room.status !== 'inactive') // 비활성화된 방 제외
        : [];
      setRooms(roomsList);
      setOriginalRooms(roomsList);
    });

    // Cleanup on unmount
    return () => off(roomsRef, 'value', unsubscribe);
  }, []);

  const addRoom = (roomDetails) => {
    const newRoomRef = push(ref(database, 'rooms'));
    const newRoom = { ...roomDetails, id: newRoomRef.key };
    set(newRoomRef, newRoom);
    setRooms((prevRooms) => [...prevRooms, newRoom]);
    setOriginalRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  useEffect(() => {
    // Route에서 비활성화된 방 처리
    if (route.params?.updatedRoom) {
      const updatedRoom = route.params.updatedRoom;
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === updatedRoom.id ? { ...room, status: updatedRoom.status } : room
        )
      );
    }
  }, [route.params?.updatedRoom]);
  const handleSearchAndSort = () => {
    let filteredRooms = [...originalRooms];

    // 검색 적용
    if (searchQuery.trim() !== '') {
      filteredRooms = filteredRooms.filter((room) =>
        room.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬 적용
    if (sortCriteria === 'createdAt') {
      filteredRooms.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortCriteria === 'people') {
      filteredRooms.sort((a, b) => (a.people || 0) - (b.people || 0));
    } else if (sortCriteria === 'menuCategory') {
      filteredRooms.sort((a, b) => (a.menuCategory || '').localeCompare(b.menuCategory || ''));
    } else if (sortCriteria === 'location') {
      filteredRooms.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
    }

    // 필터링 값 적용
    if (sortValue.trim() !== '') {
      filteredRooms = filteredRooms.filter((room) =>
        (room[sortCriteria] || '').toString().includes(sortValue)
      );
    }

    setRooms(filteredRooms);
  };

  // 자동으로 검색 및 정렬 적용
  useEffect(() => {
    handleSearchAndSort();
  }, [searchQuery, sortCriteria, sortValue, originalRooms]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createRoomButton}
          onPress={() => navigation.navigate('CreateRoom', { addRoom })}
        >
          <Text style={styles.buttonText}>방 만들기</Text>
        </TouchableOpacity>

        <View style={styles.notificationIconContainer}>
          <TouchableOpacity
            style={{ width: 30, height: 30 }}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Image
              source={require('../assets/notification.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.myPageButton} onPress={() => navigation.navigate('MyPage')}>
          <Text style={styles.buttonText}>마이페이지</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="방 이름 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearchAndSort}>
          <Ionicons name="search" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>정렬 기준:</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.pickerText}>{sortCriteria}</Text>
          <Ionicons name="chevron-down" size={20} color="black" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="값 입력"
          value={sortValue}
          onChangeText={setSortValue}
        />
        <TouchableOpacity style={styles.sortButton} onPress={handleSearchAndSort}>
          <Text style={styles.buttonText}>정렬</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>방 목록</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('RoomDetail', { room: item })}>
            <View style={styles.roomContainer}>
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.roomDetails}>인원: {item.people || 0}명</Text>
              <Text style={styles.roomDetails}>장소: {item.location}</Text>
              <Text style={styles.roomDetails}>메뉴: {item.menuCategory} - {item.specificMenu}</Text>
              <Text style={styles.roomDetails}>약속 시간: {item.meetingTime}</Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {['createdAt', 'people', 'menuCategory', 'location'].map((criteria) => (
              <TouchableOpacity
                key={criteria}
                style={styles.modalItem}
                onPress={() => {
                  setSortCriteria(criteria);
                  setModalVisible(false);
                }}
              >
                <Text>{criteria}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  createRoomButton: {
    backgroundColor: '#ffaa00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  myPageButton: {
    backgroundColor: '#ffaa00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    marginTop: 15,
    textAlign: 'center',
  },
  roomContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomDetails: {
    fontSize: 13,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  sortLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    height: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: 120, // 크기를 줄였음
  },
  pickerText: {
    fontSize: 14,
    color: 'black',
    marginRight: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    width: 100,
    marginLeft: 8,
  },
  sortButton: {
    backgroundColor: '#ffaa00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginLeft: 10, // 버튼 간격을 위해 추가
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: 250,
    borderRadius: 5,
    paddingVertical: 20,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  notificationIconContainer: { position: 'relative', marginRight: 16 },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
});


