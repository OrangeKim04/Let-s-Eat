import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ModalComponent from '../srcs/ModalComponent';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function SignUp({ navigation }) {
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSendVerificationCode = async () => {
    if (!university || !email) {
      return Alert.alert('오류', '대학교와 이메일을 모두 입력해주세요.');
    }
    if (password !== repassword) {
      return Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
    }

    try {
      // 사용자 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 인증 이메일 전송
      const user = userCredential.user;
      await sendEmailVerification(user);
      
      Alert.alert('인증 이메일이 전송되었습니다.');
      setIsEmailSent(true); // 이메일 전송 상태 업데이트
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('회원가입 실패', '이미 사용 중인 이메일 주소입니다.');
      } else {
        Alert.alert('회원가입 실패', error.message);
      }
    }
  };

  const handleSignUp = () => {
    if (!isEmailSent) {
      return Alert.alert('오류', '먼저 인증번호를 요청해주세요.');
    }
    if (verificationCode !== '1234') {
      return Alert.alert('오류', '인증번호가 올바르지 않습니다.');
    }
    navigation.navigate('Home');
  };

  const handleSelectUniversity = (selectedUniversity) => {
    setUniversity(selectedUniversity);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>{university || '대학교 선택'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry
        value={repassword}
        onChangeText={setRePassword}
      />
      <TextInput
        style={styles.input}
        placeholder="인증번호"
        value={verificationCode}
        onChangeText={setVerificationCode}
        editable={isEmailSent}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendVerificationCode}>
        <Text style={styles.buttonText}>인증번호 요청</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>

      <ModalComponent 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
        onSelectUniversity={handleSelectUniversity} 
      />
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
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#ffaa00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});