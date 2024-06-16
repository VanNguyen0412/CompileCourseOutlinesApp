import { useEffect, useState } from "react";
import {Alert, Image, RefreshControl, ScrollView, Text, View } from "react-native"
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { ActivityIndicator, Card, Icon, Button } from "react-native-paper";
import moment from "moment";

import styleAdmin from "./styleAdmin";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApproveOutline = () => {
    const [outlineapprove, setOutlineNoApprove] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadOutlineNoApprove = async () => {
        setLoading(true);
        try{
            let res = await APIs.get(endpoints['noapprove-outline']);
            setOutlineNoApprove(res.data)
            // console.info(outlineapprove);
        }catch(ex){
            console.error(ex);
        }finally{
            setLoading(false);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            let res = await APIs.get(endpoints['noapprove-outline']);
            setOutlineNoApprove(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    const approveOutline = async (outlineId) => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const res = await authApi(token).post(endpoints['approve-outline'](outlineId));
            if (res.status === 200) {
                Alert.alert("Thông báo", "Đề cương đã được xét duyệt thành công.");
                // Optionally, refresh the list after approval
                loadOutlineNoApprove();
            }
        }catch(ex){
            console.error(ex);
            Alert.alert("Error", "Failed to approve outline.");
        }
    }

    useEffect(() => {
        loadOutlineNoApprove();
    }, []);

    return (
        <ScrollView style={styleAdmin.margin} 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            {loading && <ActivityIndicator />}
            {outlineapprove.map(oa => (
                <View style={styleAdmin.commentContainer} key={oa.id}>
                    <View style={styleAdmin.avatarContainer}>
                        <Image source={{ uri: oa.image }} style={styleAdmin.avatar} />
                    </View>
                    <View style={styleAdmin.commentContent}>
                        <View style={{flex: 3}}>
                            <Text style={styleAdmin.fullName}>{oa.name}</Text>
                            <Text style={styleAdmin.createdDate}>{moment(oa.created_date).format('Do MMMM, YYYY')}</Text>
                        </View>
                        <Button mode="contained" 
                                style={styleAdmin.button}
                                onPress={() => approveOutline(oa.id)}
                                >Xét Duyệt</Button>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

export default ApproveOutline;