import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';

const ModalComponent = ({ modalVisible, setModalVisible, onSelectUniversity }) => {
  const [universities, setUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);

  useEffect(() => {
    async function getData() {
      const url = `http://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${"2c09d7835f6d56250f6050286df62830"}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&thisPage=1&perPage=500`;
      
      try {
        const response = await fetch(url);
        const jsonResponse = await response.json();
        const universityList = jsonResponse.dataSearch.content;

        setUniversities(universityList);
        setFilteredUniversities(universityList);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    }

    getData();
  }, []);

  useEffect(() => {
    const filteredData = universities.filter((univ) =>
      univ.schoolName.includes(searchQuery)
    );
    setFilteredUniversities(filteredData);
  }, [searchQuery, universities]);

  return (
    <Modal visible={modalVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>대학교를 선택하세요</Text>
          
          {/* 검색창 */}
          <TextInput
            style={styles.searchInput}
            placeholder="대학교 검색"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* 대학교 목록을 표시 */}
          <ScrollView style={styles.scrollContainer}>
            {filteredUniversities.map((univ, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onSelectUniversity(univ.schoolName);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.universityText}>{univ.schoolName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    height: '50%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  scrollContainer: {
    width: '100%',
    height: '65%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  universityText: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffaa00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffaa00',
    fontSize: 16,
  },
});

export default ModalComponent;