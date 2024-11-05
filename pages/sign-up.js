import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ModalComponent from '../srcs/ModalComponent';
import { auth } from '../firebaseConfig'; // Firebase 설정 파일에서 auth 가져오기
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSendVerificationCode = () => {
    if (university === '' || email === '') {
      Alert.alert('오류', '대학교와 이메일을 모두 입력해주세요.');
      return;
    }
    Alert.alert('인증번호 전송', `인증번호가 ${email}@${university}로 전송되었습니다.`);
  };

  const handleSignUp = async () => {
    if (verificationCode !== '1234') {
      Alert.alert('오류', '인증번호가 올바르지 않습니다.');
    } else if (password !== repassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
        navigation.navigate('Home'); // 회원가입 후 홈으로 이동
      } catch (error) {
        Alert.alert('회원가입 실패', error.message);
      }
    }
  };

  const handleSelectUniversity = (selectUniversity) => {
    setUniversity(selectUniversity);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 재입력"
        secureTextEntry={true}
        value={repassword}
        onChangeText={setRePassword}
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      <TouchableOpacity style={styles.pickerContainer} onPress={() => setModalVisible(true)}>
        {university ? (
          <Text style={{ color: 'black', fontSize: 16 }}>{university}</Text>
        ) : (
          <Text style={{ color: '#ccc', fontSize: 16 }}>대학교 선택</Text>
        )}
      </TouchableOpacity>
      <ModalComponent 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
        onSelectUniversity={handleSelectUniversity}
      />
      <View style={styles.emailContainer}>
        <TextInput
          style={styles.emailInput}
          placeholder="이메일 입력"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSendVerificationCode}>
        <Text style={styles.buttonText}>인증번호 전송</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="이메일로 받은 인증번호 입력"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <TouchableOpacity 
        style={[styles.button, { marginTop: 50 }]} 
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
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
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
  },
  emailInput: {
    flex: 3,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    height: '80%',
    marginBottom: 20,
    paddingLeft: 20,
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
