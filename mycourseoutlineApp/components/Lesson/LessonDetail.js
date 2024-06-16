import React, { useState, useContext, useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, Modal, TextInput, Alert } from "react-native";
import { Button, Card, List, Paragraph, SegmentedButtons, Title } from "react-native-paper";
import { FontAwesome } from '@expo/vector-icons';
import moment from "moment";
import MyStyle from "../../styles/MyStyle";
import styles from "../Outline/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Context";

const LessonDetail = ({ navigation, route }) => {
    const [details, setLessonDetails] = useState(null);
    const { lessonId } = route.params;
    const [value, setValue] = useState('outline');
    const [courses, setCourses] = useState([]);
    const [outlines, setOutlines] = useState([]);
    const user = useContext(MyUserContext);
    const currentUser = user?.account.id;
    const userRole = user?.account.role;
    const [editMode, setEditMode] = useState(false);
    const [courseYear, setCourseYear] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadLessonDetails = async () => {
        try {
            let res = await APIs.get(endpoints['lesson-details'](lessonId));
            setLessonDetails(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadLessonCourse = async () => {
        try {
            let res = await APIs.get(endpoints['lesson-course'](lessonId));
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadLessonOutline = async () => {
        try {
            let res = await APIs.get(endpoints['lesson-outline'](lessonId));
            setOutlines(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addCourseToLesson = async (lessonId) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).post(endpoints['lesson-addcourse'](lessonId), { year: courseYear });
            setCourses([...courses, res.data]);
            setCourseYear('');
            setIsModalVisible(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditCourse = (currentUser) => {
        if (currentUser !== details?.lecturer.account.id) {
          Alert.alert("Thông báo", "Bạn không được phép chỉnh sửa khóa học của đề cương này.");
          return;
        }else if (courses.length >= 2) {
            Alert.alert("Thông báo", "Không thể thêm nhiều hơn 2 khóa học.");
        }else{
            setIsModalVisible(true);
        }
    };

    useEffect(() => {
        loadLessonDetails();
        if (value === 'course') {
            loadLessonCourse();
        } else if (value === 'outline') {
            loadLessonOutline();
        }
    }, [value, lessonId]);

    return (
        <View style={MyStyle.container}>
            {details === null ? <ActivityIndicator /> : <>
                <ScrollView contentContainerStyle={MyStyle.container}>
                    <Card style={MyStyle.card}>
                        <Card.Content>
                            <Title style={MyStyle.title}>{details.subject}</Title>
                            <Paragraph style={MyStyle.paragraph}>Giảng viên: Ths {details.lecturer.full_name}</Paragraph>
                            <Paragraph style={MyStyle.paragraph}>Thuộc hướng: {details.category.name}</Paragraph>
                            <Text style={MyStyle.date}>Created: {moment(details.created_date).format('Do MMMM, YYYY')}</Text>
                        </Card.Content>
                    </Card>
                    <SegmentedButtons style={MyStyle.margin}
                        value={value}
                        onValueChange={setValue}
                        buttons={[
                            {
                                value: 'outline',
                                label: 'Đề cương',
                            },
                            {
                                value: 'course',
                                label: 'Khóa học',
                            }
                        ]}
                    />
                    {value === 'outline' && (
                        <View style={MyStyle.outline}>
                            <View style={styles.header}>
                                <Text style={styles.text}>Danh sách các đề cương</Text>
                                {userRole === 'lecturer' && (
                                    <TouchableOpacity >
                                        <FontAwesome name="edit" size={24} color="black" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={MyStyle.margin}>
                                {outlines.length > 0 ? (
                                    outlines.map((outline, index) => (
                                        <TouchableOpacity key={index} onPress={() => { navigation.navigate('OutlineDetail', { 'outlineId': outline.id }) }}>
                                            <List.Item title={`${outline.name}`}
                                                right={props => <List.Icon {...props} icon="tray-arrow-down" />}
                                            />
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text>Không có đề cương nào</Text>
                                )}
                            </View>
                        </View>
                    )}
                    {value === 'course' && (
                        <View style={MyStyle.outline}>
                            <View style={styles.header}>
                                <Text style={styles.text}>Danh sách các khóa học</Text>
                                {userRole === 'lecturer' && (
                                    <TouchableOpacity onPress={() => handleEditCourse(currentUser)}>
                                        <FontAwesome name="edit" size={24} color="black" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={MyStyle.margin}>
                                {courses.length > 0 ? (
                                    courses.map((course, index) => (
                                        <List.Item
                                            key={index}
                                            title={`Khóa ${course.year}`}
                                            left={props => <List.Icon {...props} icon="book" />}
                                        />
                                    ))
                                ) : (
                                    <Text>Không có khóa học nào</Text>
                                )}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </>}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View style={MyStyle.modalContainer}>
                    <View style={MyStyle.modalView}>
                        <Text style={MyStyle.modalText}>Thêm khóa học</Text>
                        <TextInput
                            style={MyStyle.inputAC}
                            placeholder="Nhập năm khóa học"
                            value={courseYear}
                            onChangeText={setCourseYear}
                            keyboardType="numeric"
                        />
                        {loading ? (
                            <ActivityIndicator />
                        ) : (
                            <>
                                <Button mode="contained" onPress={() => addCourseToLesson(lessonId)} style={MyStyle.button}>
                                    Thêm
                                </Button>
                                <Button mode="outlined" onPress={() => setIsModalVisible(false)} style={MyStyle.button}>
                                    Hủy
                                </Button>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LessonDetail;
