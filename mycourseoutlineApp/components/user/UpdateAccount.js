import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Icon, Image } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import { MyDispatchContext, MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { FastField } from 'formik';


const UpdateAccount = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState(false);
    const [lastname, setLastname] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [email, setEmail] = useState('');
    const user = useContext(MyUserContext);
    const info = user.account;
    const dispatch = useContext(MyDispatchContext);

    const handleUpdate = async (userId) => {
        const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }

        const formData = new FormData();
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('age', age);
        formData.append('gender', gender);
        try {
            if(info?.role === 'lecturer'){
                const res = await APIs.patch(endpoints['lecturer'](userId), formData,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.info(res.data)
                if(res.status===200){
                Alert.alert('Success', 'Thông tin của bạn đã được cập nhập.');
                dispatch({type: "logout"})
                }else{
                    Alert.alert("Error", 'Đã gặp lỗi')
            }
            }else if(info?.role === 'student'){
                const res = await APIs.patch(endpoints['student'](userId), formData,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                console.info(res.data)
                if(res.status===200){
                Alert.alert('Success', 'Thông tin của bạn đã được cập nhập.');
                dispatch({type: "logout"})
                }else{
                    Alert.alert("Error", 'Đã gặp lỗi')
                }
            }

            // await handleAvatarUsername(userId, username, email)
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Failed to update information. Please try again.');
        }
    };

    return (
        <ScrollView style={styleUpdate.containerCO}>
            <View >
                <Text style={styleUpdate.headerCO}>CẬP NHẬP TÀI KHOẢN {info.username}</Text>
            </View>
            <View style={styleUpdate.fieldContainerCO}>
                <Text style={styleUpdate.labelCO}>Họ</Text>
                <View style={styleUpdate.inputContainerCO}>
                    <TextInput
                        style={styleUpdate.inputCO}
                        value={firstname}
                        onChangeText={setFirstname}
                        placeholder="Nhập họ mới"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity>
                        <FontAwesome name='angle-up'  size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styleUpdate.fieldContainerCO}>
                <Text style={styleUpdate.labelCO}>Tên</Text>
                <View style={styleUpdate.inputContainerCO}>
                    <TextInput
                        style={styleUpdate.inputCO}
                        value={lastname}
                        onChangeText={setLastname}
                        placeholder="Nhập tên mới"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity>
                        <FontAwesome name='angle-up'  size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styleUpdate.fieldContainerCO}>
                <Text style={styleUpdate.labelCO}>Tên</Text>
                <View style={styleUpdate.inputContainerCO}>
                    <TextInput
                        style={styleUpdate.inputCO}
                        value={age}
                        onChangeText={setAge}
                        placeholder="Nhập tuổi mới"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity>
                        <FontAwesome name='angle-up'  size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styleUpdate.fieldContainerCO}>
                <Text style={styleUpdate.labelCO}>Giới tính</Text>
                <Switch
                style={styleUpdate.switchCO}
                    value={gender}
                    onValueChange={setGender}
                    trackColor={{ false: "#767577", true: "#66cdaa" }}
                    thumbColor={gender ? "#5f9ea0" : "#f4f3f4"}
                />
            </View>
            
            <Button
                buttonStyle={styleUpdate.button}
                title='Cập Nhập'
                onPress={() => handleUpdate(info.id)}
                />
        </ScrollView>
    );
};

const styleUpdate = StyleSheet.create({
    containerCO: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    headerCO: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
        textTransform: 'uppercase',

    },
    fieldContainerCO: {
        marginBottom: 15,
    },
    labelCO: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    inputContainerCO: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    inputCO: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    avatar: {
        width: 150,
        height: 150,
        // alignItems: "center",
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 100,
    },
    button: {
        backgroundColor: 'rgb(120, 69, 172)',
        // color:"#ffffff",
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 20,
    },
    text: {
        color:"#800080",
        fontWeight:"500",

    },
    switchCO: {
        width: "50%",
        height: 30
    },
});
export default UpdateAccount;
