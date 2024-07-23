import { View, Text, ScrollView, RefreshControl, Alert, TouchableOpacity, Modal } from "react-native";
import { ActivityIndicator, Button, Paragraph, Title } from "react-native-paper";
import styleAdmin from "./styleAdmin";
import { useEffect, useState } from "react";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";
import MyStyle from "../../styles/MyStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProvideAccount = () => {
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState([]);
    const [lecturer, setLecturer] = useState([]);
    const [detailLecturer, setDetailLecturer] = useState([]);
    const [detailStudent, setDetailStudent] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModal, setIsModal] = useState(false);
    

    const loadLecturer = async () => {
        setLoading(true)
        try {
            let res = await APIs.get(endpoints['lecturer-account']);
            setLecturer(res.data)
        }catch(err){
            console.error("Error", err)
            Alert.alert("Thông báo", "Bị lỗi khi load thông tin giảng viên")
        }finally{
            setLoading(false)
        }
    }

    const loadStudent = async () => {
        setLoading(true)
        try {
            let res = await APIs.get(endpoints['student-account']);
            setStudent(res.data)
        }catch(err){
            console.error("Error", err)
            Alert.alert("Thông báo", "Bị lỗi khi load thông tin sinh viên")
        }finally{
            setLoading(false)
        }
    }

    const loadDetailLecturer = async (lecturerId) => {
        try{
            let res = await APIs.get(endpoints['lecturer-account-detail'](lecturerId))
            setDetailLecturer(res.data)
            setIsModalVisible(true)
        }catch(err){
            console.error("Error", err)
            Alert.alert("Thông báo", "Bị lỗi khi load thông tin giảng viên")
        }
    }

    const loadDetailStudent = async (studentId) => {
        try{
            let res = await APIs.get(endpoints['student-account-detail'](studentId))
            setDetailStudent(res.data)
            setIsModal(true)
        }catch(err){
            console.error("Error", err)
            Alert.alert("Thông báo", "Bị lỗi khi load thông tin sinh viên")
        }
    }

    const handleProvideLecturer = async (lecturerId) => {
        try{
            setLoading(true)
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            await authApi(token).post(endpoints['provide-lecturer'](lecturerId));
            Alert.alert("Thông báo", "Tài khoản đã được cung cấp thành công");
            loadLecturer();
        }catch(err){
            console.error(err);
            Alert.alert("Thông báo","Cung cấp tài khoản không thành công")
        }finally{
            setLoading(false)
            setIsModalVisible(false)
        }
    }

    const handleProvideStudent = async (studentId) => {
        try{
            setLoading(true)
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            await authApi(token).post(endpoints['provide-student'](studentId));
            Alert.alert("Thông báo", "Tài khoản đã được cung cấp thành công");
            loadStudent();
        }catch(err){
            console.error(err);
            Alert.alert("Thông báo","Cung cấp tài khoản không thành công")
        }finally{
            setLoading(false)
            setIsModal(false)
        }
    }

    
    useEffect(() => {
        loadLecturer()
    }, []);

    useEffect(() => {
        loadStudent();
    },[])

    return (
        <ScrollView style={styleAdmin.margin} >
            {loading && <ActivityIndicator />}
            <View style={{margin: 7 , flexDirection: 'row', alignItems: "center"}}>
                <Text style={styleAdmin.text}>1.1. Thông Tin Giảng Viên: </Text>
                <View style={styleAdmin.horizontalLine} />
            </View>
            {lecturer.length === 0 ? (
            <View style={styleAdmin.emptyContainer}>
            <Text style={styleAdmin.emptyText}>Không có tài khoản nào đang chờ duyệt</Text>
             </View>
            ) : (
                lecturer.map(oa => (
                    <View style={styleAdmin.commentContainer} key={oa.id}>
                        <View style={styleAdmin.commentContent}>
                            <View style={{flex: 3, marginLeft: 10}}>
                                <Text style={styleAdmin.fullName}>{oa.first_name} {oa.last_name}</Text>
                                <Text style={styleAdmin.createdDate}>{oa.email}</Text>
                            </View>
                            <Button mode="contained" 
                                    style={styleAdmin.button}
                                    onPress={() => loadDetailLecturer(oa.id)}
                                    >Chi Tiết</Button>
                        </View>
                    </View>
            )))}


            <View style={{margin: 7 , flexDirection: 'row', alignItems: "center"}}>
                <Text style={styleAdmin.text}>1.2. Thông Tin Sinh Viên: </Text>
                <View style={styleAdmin.horizontalLine} />
            </View>
            {student.length === 0 ? (
                <View style={styleAdmin.emptyContainer}>
                        <Text style={styleAdmin.emptyText}>Không có tài khoản nào đang chờ duyệt</Text>
                    </View>
                ) : (
                student.map(oa => (
                <View style={styleAdmin.commentContainer} key={oa.id} >
                <View style={styleAdmin.commentContent}>
                    <View style={{flex: 3, marginLeft: 10}}>
                        <Text style={styleAdmin.fullName}>{oa.first_name} {oa.last_name}</Text>
                        <Text style={styleAdmin.createdDate}>{moment(oa.created_date).format('Do MMMM, YYYY')}</Text>
                    </View>
                    <Button mode="contained" 
                            style={styleAdmin.button}
                            onPress={() => loadDetailStudent(oa.id)}
                            >Chi Tiết</Button>
                </View>
                </View>
            )))}
            {detailLecturer === null ? <ActivityIndicator /> : <>
                <Modal key={detailLecturer.id}
                            animationType="slide"
                            transparent={true}
                            visible={isModalVisible}
                            onRequestClose={() => {
                                setIsModalVisible(!isModalVisible);
                            }}>
                    <View style={styleAdmin.modalContainer}>
                        <View style={styleAdmin.modalView}>
                        <TouchableOpacity style={styleAdmin.closeButton}
                            onPress={() => setIsModalVisible(!isModalVisible)}>
                            <FontAwesome name='close' size={23} color='gray' />
                        </TouchableOpacity>
                            <Text style={styleAdmin.modalText}>Thông Tin Giảng Viên</Text>
                            <Title style={styleAdmin.title}>{detailLecturer.first_name} {detailLecturer.last_name} <Text style={styleAdmin.paragraph}>({detailLecturer.code})</Text></Title>
                            <Paragraph style={styleAdmin.paragraph}>{detailLecturer.position} </Paragraph>
                            <Paragraph style={styleAdmin.paragraph}>Tuổi: {detailLecturer.age}    Giới tính: {detailLecturer.gender === 'true' ? "Nữ" : "Nam"} </Paragraph>
                            <Text style={styleAdmin.date}>Ngày tạo: {moment(detailLecturer.created_date).format('Do MMMM, YYYY')}</Text>
                            <Button 
                                mode="contained" 
                                style={styleAdmin.provideButton} 
                                onPress={() => handleProvideLecturer(detailLecturer.id)}
                            >Cung Cấp</Button>
                        </View>
                    </View>
                </Modal>
            </>}
            {detailStudent === null ? <ActivityIndicator /> : <>
                <Modal key={detailStudent.id}
                            animationType="slide"
                            transparent={true}
                            visible={isModal}
                            onRequestClose={() => {
                                setIsModal(!isModal);
                            }}>
                    <View style={styleAdmin.modalContainer}>
                        <View style={styleAdmin.modalView}>
                        <TouchableOpacity style={styleAdmin.closeButton}
                            onPress={() => setIsModal(!isModal)}>
                            <FontAwesome name='close' size={23} color='gray' />
                        </TouchableOpacity>
                            <Text style={styleAdmin.modalText}>Thông Tin Sinh Viên</Text>
                            <Title style={styleAdmin.title}>{detailStudent.first_name} {detailStudent.last_name} <Text style={styleAdmin.paragraph}>({detailLecturer.code})</Text></Title>
                            <Paragraph style={styleAdmin.paragraph}>{detailStudent.email} </Paragraph>
                            <Paragraph style={styleAdmin.paragraph}>Tuổi: {detailStudent.age}    Giới tính: {detailStudent.gender === 'true' ? "Nữ" : "Nam"} </Paragraph>
                            <Text style={styleAdmin.date}>Ngày tạo: {moment(detailStudent.created_date).format('Do MMMM, YYYY')}</Text>
                            <Button 
                                mode="contained" 
                                style={styleAdmin.provideButton}
                                onPress={() => handleProvideStudent(detailStudent.id)}
                                >Cung Cấp</Button>
                        </View>
                    </View>
                        </Modal>
            </>}
        </ScrollView>
    );

}

export default ProvideAccount;