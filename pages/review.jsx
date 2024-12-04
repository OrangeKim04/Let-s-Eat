import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
export default function Review({route, navigation}){
    const { participant, onCompleteReview } = route.params;
   /*  if (!onCompleteReview) {
        console.error('onCompleteReview 함수가 전달되지 않았습니다.');
        return (
          <View>
            <Text>오류: onCompleteReview가 정의되지 않았습니다.</Text>
          </View>
        );
      } */
    const [checkedStates, setCheckedStates] = useState([false, false, false]);
    const toggleCheck = (index) => {
        setCheckedStates((prevState) => {
          const updatedStates = [...prevState];
          updatedStates[index] = !updatedStates[index]; // 클릭된 항목 상태 토글
          return updatedStates;
        });
      };
      const reviewItems = [
        { text: '식사 매너를 잘 지켜요.' },
        { text: '약속 시간을 잘 지켜요.' },
        { text: '친절해요.' },
      ];
      const handleSubmit = () => {
        const selectedKeywords = reviewItems
          .filter((_, index) => checkedStates[index])
          .map((item) => item.text);
    
        onCompleteReview(selectedKeywords); // 부모 컴포넌트에 결과 전달
      };
    
    
      const handleSkip = () => {
        onCompleteReview([]); // 빈 리뷰를 전달
      };
    
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{participant}에 대한 리뷰</Text>
          {reviewItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleCheck(index)}
              style={styles.reviewItems}
            >
              <Image
                source={
                  checkedStates[index]
                    ? require('../assets/check.png')
                    : require('../assets/check-mark.png')
                }
                style={styles.image}
              />
              <Text style={styles.text}>{item.text}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>건너뛰기</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
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
    submitButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  skipButton: { backgroundColor: '#f44336', padding: 12, borderRadius: 8, flex: 1, marginLeft: 8 },
  skipButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});