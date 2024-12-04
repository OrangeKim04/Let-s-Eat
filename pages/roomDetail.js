import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';

export default function RoomDetail({ route, navigation }) {
  const { room } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [isRequestPending, setRequestPending] = useState(false);
  const [meetingCompleted, setMeetingCompleted] = useState(false); // 만남 완료 여부

  const isHost = true; // 방장이면 true, 실제 조건은 서버에서 받아온 데이터를 기반으로 설정
  const currentTime = new Date(); // 현재 시간
  const meetingTime = new Date(room.meetingTime); // 약속 시간
  const handleJoinRequest = () => {
    // 지금은 1로 설정했지만 채팅룸에 몇명이 들어왔는지 서버에서 받아와서 설정해야함
    if(1 >= room.people){
      Alert.alert('입장 불가');
    }
    setModalVisible(true);
  }
  const sendRequestToHost = () => {
    setModalVisible(false);
    setRequestPending(true);
    // 여기에 방장에게 요청을 전송하는 로직 추가
    Alert.alert('요청 완료', '방장에게 입장 요청을 보냈습니다.');
  };

  const completeMeeting = () => {
    // 하드코딩된 참여자 목록 (테스트용)
    const mockParticipants = ['홍길동', '김철수', '박영희']; // 테스트 데이터
    const remainingParticipants = mockParticipants.filter((p) => p !== '홍길동'); // 본인 제외
  
    if (remainingParticipants.length === 0) {
      Alert.alert('리뷰 없음', '리뷰할 대상이 없습니다.');
      return;
    }
  
    // 리뷰 순차 처리 함수
    const handleReview = (index = 0) => {
      if (index >= remainingParticipants.length) {
        Alert.alert('리뷰 완료', '모든 사용자에 대한 리뷰가 제출되었습니다.');
        navigation.navigate('Main'); // 리뷰 완료 후 메인 화면으로 이동
        return;
      }
  
      // 리뷰 페이지로 이동
      navigation.navigate('Review', {
        participant: remainingParticipants[index],
        onCompleteReview: (keywords) => {
          console.log(`${remainingParticipants[index]}에 대한 리뷰:`, keywords);
          handleReview(index + 1); // 다음 참여자 리뷰로 이동
        },
      });
    };
  
    handleReview(); // 첫 번째 참여자 리뷰 시작
  };
  

  // 아직 잘 안돌아가서 나중에 구현해야 할듯
  //const isCompleteButtonEnabled = isHost && currentTime > new Date(meetingTime.getTime() + 60 * 60 * 1000);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{room.name}</Text>
      <Text style={styles.detail}>생성 시간: {room.createdAt}</Text>
      <Text style={styles.detail}>인원: {room.people}</Text>
      <Text style={styles.detail}>장소: {room.location}</Text>
      <Text style={styles.detail}>메뉴: {room.menu}</Text>
      <Text style={styles.detail}>약속 시간: {room.meetingTime}</Text>

      {/* <Text style={styles.detail}>
        채팅방 인원: {room.people}/{room.maxCapacity}
      </Text> */}
       <TouchableOpacity
        onPress={handleJoinRequest}
        style={styles.chatButton}
        disabled={isRequestPending}
      >
        <Text style={styles.chatButtonText}>
          {isRequestPending ? '요청 대기 중' : '채팅방 입장 요청'}
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => navigation.navigate('ChatRoom', { roomName: room.name })} style={styles.chatButton}>
        <Text style={styles.chatButtonText}>chat</Text>
      </TouchableOpacity> */}
      {/* 모달 창 */}
      {isHost && !meetingCompleted && (
        <TouchableOpacity
          onPress={completeMeeting}
          style={[
            styles.completeButton,
            { backgroundColor: '#4CAF50' },
          ]}
        >
          <Text style={styles.completeButtonText}>만남 완료</Text>
        </TouchableOpacity>
      )}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>채팅방에 입장하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={sendRequestToHost} style={styles.modalButton}>
                <Text>네</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text>아니요</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginVertical: 5,
  },
  chatButton: {
    borderColor: '#ffaa00', // 버튼 배경색
    borderWidth: 1,
    backgroundColor: 'transparent',

    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  chatButtonText: {
    color: 'black',             // 텍스트 색상
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 8 
  },
  modalButtons: { 
    flexDirection: 'row', 
    marginTop: 16 
  },
  modalButton: { 
    marginHorizontal: 8, 
    padding: 8, 
    backgroundColor: '#ccc', 
    borderRadius: 8 
  },
  completeButton: { marginTop: 16, padding: 12, borderRadius: 8 },
  completeButtonText: { color: '#fff', textAlign: 'center' },
});


