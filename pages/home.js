import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig'; // Firebase 설정 파일에서 auth 가져오기
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Home({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded] = useFonts({
    tokki: require("../assets/Fonts/HSSantokki-Regular.ttf"),
    jeju: require("../assets/Fonts/EF_jejudoldam(TTF).ttf"),
  });

  // 폰트가 로드되지 않았으면 로딩 스피너를 표시
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Firebase 로그인 처리 함수
  const handleLogin = async () => {
    if (username === '') {
      Alert.alert('아이디를 입력하세요.');
      return;
    }
    if (password === '') {
      Alert.alert('비밀번호를 입력하세요.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, username, password);
      console.log('로그인 성공');
      navigation.navigate('MyPage', { email: username });
      navigation.replace("Main"); // 로그인 성공 시 Main 페이지로 이동
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      Alert.alert('로그인 실패', errorMessage);
      console.log('로그인 실패', error);
    }
  };

  // Firebase 에러 메시지 변환 함수
  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 형식입니다.';
      case 'auth/user-not-found':
        return '존재하지 않는 사용자입니다.';
      case 'auth/wrong-password':
        return '잘못된 비밀번호입니다.';
      default:
        return '로그인에 실패했습니다. 다시 시도해주세요.';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.emoji}>{String.fromCodePoint(0x1F374)}</Text>
        <Text style={styles.text}>밥먹자</Text>
        <Text style={styles.emoji}>{String.fromCodePoint(0x1F374)}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {/* 로그인 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        {/* 회원가입 버튼 */}
        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  textContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 110,
    marginTop: 20,
  },
  text: {
    fontFamily: 'tokki',
    fontSize: 70,
    color: "#ffaa00",
    fontWeight: 'regular',
    margin: 5,
  },
  emoji: {
    fontSize: 40,
  },
  form: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 10,
    fontSize: 18,
  },
  passwordInput: {
    marginBottom: 30,
  },
  button: {
    width: '100%',
    height: 50,
    paddingVertical: 10,
    backgroundColor: '#ffaa00',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  signupButton: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ffaa00',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signupButtonText: {
    color: '#ffaa00',
    fontSize: 18,
  },
});