import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../configs/APIs';
import styleAdmin from './styleAdmin';
import { ActivityIndicator, Button } from 'react-native-paper';
import moment from 'moment';
import { MyDispatchContext } from "../../configs/Context";


const Approval = () => {
    const [loading, setLoading] = useState(true);
    const [pendingApprove, setPendingApprove] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useContext(MyDispatchContext);

    useEffect(() => {
        fetchPendingApprove();
    }, []);

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

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const response = await authApi(token).get(endpoints['pending-approve']);
            setPendingApprove(response.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    const handleApprove = async (approveId, code, last_name) => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }

            console.log('Payload:', {
                username: last_name,
                password: code,
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
        }
    };

    return (
        <ScrollView style={styleAdmin.margin} 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            {loading && <ActivityIndicator />}
            {pendingApprove.map(oa => (
                <View style={styleAdmin.commentContainer} key={oa.id}>
                <View style={styleAdmin.commentContent}>
                    <View style={{flex: 3}}>
                        <Text style={styleAdmin.fullName}>{`${oa.student.last_name} ${oa.student.first_name}`}</Text>
                        <Text style={styleAdmin.createdDate}>{`MSSV: ${oa.student.code}`}</Text>
                    </View>
                    <Button mode="contained" 
                            style={styleAdmin.button}
                            onPress={() => handleApprove(oa.id, oa.student.code, oa.student.last_name)}
                            >Xét Duyệt</Button>
                </View>
            </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
   
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    
});

export default Approval;