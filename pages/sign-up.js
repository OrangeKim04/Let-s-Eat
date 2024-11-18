import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import ModalComponent from '../srcs/ModalComponent';
import { auth } from '../firebaseConfig'; // Firebase 설정 파일에서 auth 가져오기
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp({ navigation }) {
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSendVerificationCode = () => {
    if (!university || !email) {
      return Alert.alert('오류', '대학교와 이메일을 모두 입력해주세요.');
    }
    Alert.alert('인증번호 전송', `인증번호가 ${email}@${university}로 전송되었습니다.`);
  };

  const handleSignUp = async () => {
    if (verificationCode !== '1234') {
      return Alert.alert('오류', '인증번호가 올바르지 않습니다.');
    }
    if (password !== repassword) {
      return Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
      navigation.navigate('MyPage', {email, nickname});
      navigation.navigate('Home');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert('회원가입 실패', '이미 사용 중인 이메일 주소입니다.');
          break;
        case 'auth/invalid-email':
          Alert.alert('회원가입 실패', '유효하지 않은 이메일 형식입니다.');
          break;
        case 'auth/weak-password':
          Alert.alert('회원가입 실패', '비밀번호가 너무 약합니다. 최소 6자 이상 입력해주세요.');
          break;
        case 'auth/operation-not-allowed':
          Alert.alert('회원가입 실패', '이메일/비밀번호 계정이 활성화되어 있지 않습니다.');
          break;
        case 'auth/network-request-failed':
          Alert.alert('회원가입 실패', '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
          break;
        default:
          Alert.alert('회원가입 실패', '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          console.error('회원가입 오류:', error);
          break;
      }
    }
  };

  const handleSelectUniversity = (selectedUniversity) => {
    setUniversity(selectedUniversity);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
    
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        textContentType="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 재입력"
        secureTextEntry={true}
        value={repassword}
        onChangeText={setRePassword}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        textContentType="none"
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        textContentType="none"
      />

      <TouchableOpacity style={styles.pickerContainer} onPress={() => setModalVisible(true)}>
        <Text style={university ? styles.universityText : styles.universityPlaceholder}>
          {university || '대학교 선택'}
        </Text>
      </TouchableOpacity>
      <ModalComponent modalVisible={modalVisible} setModalVisible={setModalVisible} onSelectUniversity={handleSelectUniversity} />

      <View style={styles.emailContainer}>
        <TextInput
          style={styles.emailInput}
          placeholder="이메일 입력"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSendVerificationCode}>
        <Text style={styles.buttonText}>인증번호 전송</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="인증번호 입력"
        value={verificationCode}
        onChangeText={setVerificationCode}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        textContentType="none"
      />
      <TouchableOpacity style={[styles.button, { marginTop: 50 }]} onPress={handleSignUp}>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    justifyContent:'center',
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
  emailDomain: {
    height: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    flex: 3,
    marginLeft: 10,
    fontSize: 16,
    marginBottom: 20,
    justifyContent: 'center',
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


