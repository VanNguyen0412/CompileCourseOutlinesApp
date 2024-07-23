import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import styleAdmin from '../Admin/styleAdmin';
import { ActivityIndicator } from 'react-native-paper';

const CreateOutline = ({route}) => {
    const [name, setName] = useState('');
    const [credit, setCredit] = useState('');
    const [overview, setOverview] = useState('');
    const [is_approved, setIsApproved] = useState(false);
    const [lessons, setLesson] = useState('');
    const [imageNew, setImage] = useState(null);
    const nav = useNavigation();
    const {lessonId} = route.params;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(lessonId != 0){
        const loadLessonDetails = async () => {
            try {
                let res = await APIs.get(endpoints['lesson-details'](lessonId));
                setLesson(res.data.subject);
            } catch (err) {
                console.error(err);
            }
        };
        loadLessonDetails();
        }else{
            setLesson('')
        }
    }, [lessonId])

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("Outline Course App", "Permissions Denied!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!res.canceled) {
                setImage(res.assets[0]);
            }
        }
    }



    const CreateOutline = async (name, credit, overview, is_approved, imageNew) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            // Dữ liệu outline mới
            const formData = new FormData();
            formData.append('name', name);
            formData.append('credit', credit);
            formData.append('overview', overview);
            formData.append('is_approved', is_approved);
            formData.append('lesson', lessonId);

            const filename = imageNew.uri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const fileType = match ? `image/${match[1]}` : `image`;

            // formData.append('image', image)
            if (imageNew) {
                formData.append('image', {
                    uri: imageNew.uri,
                    name: filename,
                    type: fileType
                });
            }
            // Gửi yêu cầu POST để tạo outline mới
            const response = await authApi(token).post(endpoints['outline-create'], formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Kiểm tra phản hồi từ server
            if (response.status === 201) {
                console.info("Tạo đề cương thành công:", response.data);
                Alert.alert("Thông báo", "Đã tạo đề cương thành công.");
                setName('');
                setCredit('');
                setImage(null);
                setIsApproved(false);
                setLesson('');
                setOverview('');
                nav.navigate("Outline");
            } else if (response.status === 403) {
                console.error("Error: Chỉ có giảng viên mới được tạo đề cương.");
                Alert.alert("Error: Chỉ có giảng viên mới được tạo đề cương.");
            } else {
                console.error("Error creating lesson:", response.errorData);
                Alert.alert("Error", "Bị lỗi khi tạo đề cương!!!");
            }
        }catch(ex){
            Alert.alert("Error", "Network request failed. Please check your connection.");
            console.error(ex);
        }finally{
            setLoading(false);
        }
    }

    const addOutline = () => {
        CreateOutline(name, credit, overview, is_approved, imageNew);
    };

    if (loading) {
        return (
            <View style={styleAdmin.loadingContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.containerCO}>
            <Animatable.Text animation="fadeInDown" style={styles.headerCO}>
            Thêm Mới Đề Cương
            </Animatable.Text>

            <View style={styles.fieldContainerCO}>
                <Text style={styles.labelCO}>Tên đề cương</Text>
                <TextInput
                    style={styles.inputCO}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nhập tên đề cương"
                    placeholderTextColor="#999"
                />  
            </View>

            <View style={styles.fieldContainerCO}>
                <Text style={styles.labelCO}>Số tín chỉ</Text>
                <TextInput
                    style={styles.inputCO}
                    value={credit}
                    onChangeText={setCredit}
                    placeholder="Nhập số tín chỉ"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.fieldContainerCO}>
                <Text style={styles.labelCO}>Mô tả</Text>
                <TextInput
                    style={[styles.inputCO, styles.textAreaCO]}
                    value={overview}
                    onChangeText={setOverview}
                    placeholder="Nhập mô tả"
                    placeholderTextColor="#999"
                    multiline={true}
                />
            </View>

            <View style={styles.fieldContainerCO}>
                <Text style={styles.labelCO}>Môn học</Text>
                <TextInput
                    style={styles.inputCO}
                    value={lessons}
                    onChangeText={setLesson}
                    placeholder="Nhập môn học"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.fieldContainerCO}>
                <Text style={styles.labelCO}>Hình ảnh đề cương</Text>
                
                <TouchableOpacity style={styles.buttonCO} onPress={picker}>
                    <Icon name="image" size={22} color="#fff" />
                    <Text style={styles.buttonTextCO}>Chọn hình ảnh</Text>
                </TouchableOpacity>
                {imageNew && (
                    <Image
                    source={{ uri: imageNew.uri }}
                    style={styles.imageCO}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.saveButtonCO} onPress={addOutline}>
                <Text style={styles.saveButtonTextCO}>Lưu</Text>
            </TouchableOpacity>

        </ScrollView>
  );
};

export default CreateOutline;
