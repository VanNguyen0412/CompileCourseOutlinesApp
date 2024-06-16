import React, { useEffect, useState } from "react"
import { View, Text, FlatList, Alert, ScrollView, RefreshControl, Image } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { authApi, endpoints } from "../../configs/APIs";
import styleAdmin from "./styleAdmin";
import moment from "moment";

const Account = () => {
    const [loading, setLoading] = useState(true);
    const [pendingAccounts, setPendingAccounts] = useState([]);
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
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };
    const handleApprove = async (id) => {
       try {
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
       }
    };

    useEffect(() => {
        fetchPendingAccounts();
    }, []);
    
    if (loading) {
        return (
            <View style={styleAdmin.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styleAdmin.margin} 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            {loading && <ActivityIndicator />}
            {pendingAccounts.map(oa => (
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
                            onPress={() => handleApprove(oa.id)}
                            >Xét Duyệt</Button>
                </View>
            </View>
            ))}
        </ScrollView>
    );
};

export default Account;