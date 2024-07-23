import React, { useEffect, useState } from "react"
import { View, Text, FlatList, Alert, ScrollView, RefreshControl, Image } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { authApi, endpoints } from "../../configs/APIs";
import styleAdmin from "./styleAdmin";
import moment from "moment";
import { FieldArray } from "formik";

const Account = () => {
    const [loading, setLoading] = useState(true);
    const [pendingAccounts, setPendingAccounts] = useState([]);
    const [pendingApprove, setPendingApprove] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPendingAccounts = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const response = await authApi(token).get(endpoints['pending-account']);
            setPendingAccounts(response.data);
            // console.info(response.data)
        } catch (error) {
            console.error('Error getting pending accounts:', error);
            Alert.alert('Error', 'Failed to fetch pending accounts');
        } finally {
            setLoading(false);
        }
    };
    
    const handleApprove1 = async (id) => {
       try {
        setLoading(true)
        const token = await AsyncStorage.getItem("token");

        if (!token) {
            Alert.alert("Error", "No access token found.");
            return;
        }
        await authApi(token).post(endpoints['confirm-account'](id));
        Alert.alert("Thông báo", "Tài khoản đã được xét duyệt thành công");
        fetchPendingAccounts();
       } catch (error){
            console.error("Error approving account:", error);
            Alert.alert("Error", "Unable to approve account");
       }finally{
        setLoading(false)
       }
    };
    

    const fetchPendingApprove = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const response = await authApi(token).get(endpoints['pending-approve']);
            setPendingApprove(response.data);
            // console.info(response.data)
        } catch (error) {
            console.error('Error getting pending approve:', error);
            Alert.alert('Error', 'Failed to fetch pending approve');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove2 = async (approveId, code, last_name) => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }

            console.log('Payload:', {
                username: code,
                password: approveId,
                id: approveId
            });
            const data = {
                username: code,
                password: approveId
            };
            console.info(token)
            const response = await authApi(token).post(endpoints['confirm-approve'](approveId), data);
            console.log('Approval response:', response.data);

            Alert.alert('Thông báo', 'Yêu cầu đã được duyệt');
            fetchPendingApprove();
        } catch (error) {
            console.error('Error approving request:', error);
            if (error.response) {
                console.log('Error response headers:', error.response.headers);
            }
            Alert.alert('Error', 'Failed to approve request');
        } finally{
            setLoading(false)
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const response = await authApi(token).get(endpoints['pending-account']);
            setPendingAccounts(response.data);
            const response1 = await authApi(token).get(endpoints['pending-approve']);
            setPendingApprove(response1.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPendingApprove();
    }, []);


    useEffect(() => {
        fetchPendingAccounts();
    }, []);
    
    if (loading) {
        return (
            <View style={styleAdmin.loadingContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScrollView style={styleAdmin.margin} 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            {loading && <ActivityIndicator />}
            <View style={{margin: 7 , flexDirection: 'row', alignItems: "center"}}>
                <Text style={styleAdmin.text}>1.1. Tài khoản Giảng Viên: </Text>
                <View style={styleAdmin.horizontalLine} />
            </View>
            {pendingAccounts.length === 0 ? (
            <View style={styleAdmin.emptyContainer}>
            <Text style={styleAdmin.emptyText}>Không có tài khoản nào đang chờ duyệt</Text>
             </View>
            ) : (
                pendingAccounts.map(oa => (
                    <View style={styleAdmin.commentContainer} key={oa.id}>
                        <View style={styleAdmin.avatarContainer}>
                            <Image source={{ uri: oa.avatar }} style={styleAdmin.avatar} />
                        </View>
                        <View style={styleAdmin.commentContent}>
                            <View style={{flex: 3}}>
                                <Text style={styleAdmin.fullName}>{oa.username}</Text>
                                <Text style={styleAdmin.createdDate}>{moment(oa.created_date).format('Do MMMM, YYYY')}</Text>
                            </View>
                            <Button mode="contained" 
                                    style={styleAdmin.button}
                                    onPress={() => handleApprove1(oa.id)}
                                    >Xét Duyệt</Button>
                        </View>
                    </View>
            )))}


            <View style={{margin: 7 , flexDirection: 'row', alignItems: "center"}}>
                <Text style={styleAdmin.text}>1.2. Tài khoản Sinh Viên: </Text>
                <View style={styleAdmin.horizontalLine} />
            </View>
            {pendingApprove.length === 0 ? (
                <View style={styleAdmin.emptyContainer}>
                        <Text style={styleAdmin.emptyText}>Không có tài khoản nào đang chờ duyệt</Text>
                    </View>
                ) : (
                pendingApprove.map(oa => (
                <View style={styleAdmin.commentContainer} key={oa.id}>
                <View style={styleAdmin.commentContent}>
                    <View style={{flex: 3}}>
                        <Text style={styleAdmin.fullName}>{`${oa.student.last_name} ${oa.student.first_name}`}</Text>
                        <Text style={styleAdmin.createdDate}>{`MSSV: ${oa.student.code}`}</Text>
                    </View>
                    <Button mode="contained" 
                            style={styleAdmin.button}
                            onPress={() => handleApprove2(oa.id, oa.student.code, oa.student.last_name)}
                            >Xét Duyệt</Button>
                </View>
                </View>
            )))}
        </ScrollView>
    );
};

export default Account;