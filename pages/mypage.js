import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function MyPage({ navigation, route }) {
  const [name, setName] = useState(nickname);
  const {email='정보 없음', nickname='정보 없음'} = route.params || {};
  
  console.log("route.params: ", route.params);
  console.log("email: ", email);

  const gotosettingpage = () => {
    navigation.navigate('SettingPage', {
      name,        // 현재 이름
      email,       // 현재 이메일
      setName      // 이름 업데이트 함수
    });
  };
  const gotoMyRoom = () => {
    navigation.navigate('MyRoom');
  };

 
  return (
    <View style={styles.container}>

      <Image 
        source={require('../assets/default-profile.png')} 
        style={styles.profileImage} 
      />
      
      {/* 사용자 이름 */}
      <Text style={styles.name}>{name}</Text>  
      
      {/* 사용자 이메일 */}
      <Text style={styles.email}>{email}</Text>

      {/* 설정 섹션 */}
      <View style={styles.settingsContainer}>
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={gotosettingpage}  // 설정 페이지로 이동
        >
          <Text style={styles.settingText}>설정</Text> 
        </TouchableOpacity>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={gotoMyRoom}  // 설정 페이지로 이동
        >
          <Text style={styles.settingText}>내가 만든 방</Text> 
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  settingsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
  },
  settingItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 18,
  },
  reviewItems: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});
