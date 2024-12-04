import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NotificationContext } from './noticeContext';


export default function Notifications() {
  const {
    notifications,
    unreadCount,
    addNotification,
    markAllAsRead,
    clearNotifications,
  } = useContext(NotificationContext);

  // 가상 데이터: 알림 시뮬레이션
  useEffect(() => {
    setTimeout(() => {
      addNotification('입장 요청', '사용자가 채팅룸 입장을 요청했습니다.');
    }, 2000);

    setTimeout(() => {
      addNotification('입장 수락', '방장이 채팅방 입장을 수락했습니다.');
    }, 4000);

    setTimeout(() => {
      addNotification('입장 거절', '방장이 채팅방 입장을 거절했습니다.');
    }, 6000);

    setTimeout(() => {
      addNotification('약속 시간 알림', '약속 시간이 1시간 남았습니다.');
    }, 8000);

    setTimeout(() => {
      addNotification('약속 시간 알림', '약속 시간이 30분 남았습니다.');
    }, 10000);

    setTimeout(() => {
      addNotification('평가 알림', '익명의 사용자로부터 평가를 받았습니다.');
    }, 12000);
  }, []);
  
  // 페이지 진입 시 알림 모두 읽음 처리
  useEffect(() => {
    markAllAsRead();
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>알림</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount}</Text>
        </View>
      </View>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>알림이 없습니다.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
            </View>
          )}
        />
      )}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.clearButton} onPress={clearNotifications}>
          <Text style={styles.buttonText}>알림 모두 삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  noNotifications: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 16 },
  notificationItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationTitle: { fontSize: 18, fontWeight: 'bold' },
  notificationMessage: { fontSize: 14, color: '#555' },
  clearButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
