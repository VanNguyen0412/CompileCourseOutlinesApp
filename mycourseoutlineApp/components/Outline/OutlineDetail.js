import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, Alert, Dimensions, Linking, Modal,TextInput, RefreshControl } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { ActivityIndicator, Appbar, Card, DataTable, Divider, List, Menu,
     Paragraph, Provider, SegmentedButtons, Title, Button, 
     Avatar} from "react-native-paper";
import moment from "moment";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { ScrollView } from "react-native";
import styles from "./styles";
import { Icon, Image } from "react-native-elements";
import { MyUserContext } from "../../configs/Context";
import { FontAwesome } from '@expo/vector-icons'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';


const OutlineDetail = ({route}) => {
    const [details, setOutlineDetails] = useState(null);
    const {outlineId} = route.params;
    const [showFullOverview, setShowFullOverview] = useState(false);
    const [value, setValue] = useState('evaluation');
    const [comment, setComment] = useState([]);
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    const [visibleMenus, setVisibleMenus] = useState(Array(comment.length).fill(false));
    const [loading, setLoading] = useState(false);
    const user = useContext(MyUserContext);
    const userRole = user?.account.role;
    const currentUser = user?.account.id;
    const [content, setContent] = useState("");
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [evaluations, setEvaluations] = useState([{ percentage: '', method: '' }]);
    const [course, setCourse] = useState([{ year: ''}]);
    const [evaluation, setEvaluation] = useState([]);
    const nav = useNavigation();
    const [downloading, setDownloading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const openMenu = (index) => {
        const newVisibleMenus = [...visibleMenus];
        newVisibleMenus[index] = true;
        setVisibleMenus(newVisibleMenus);
    };

    const closeMenu = (index) => {
        const newVisibleMenus = [...visibleMenus];
        newVisibleMenus[index] = false;
        setVisibleMenus(newVisibleMenus);
    };
    const toggleOverview = () => {
        setShowFullOverview(!showFullOverview);
    };

    const handleAddEvaluation = () => {
        setEvaluations([...evaluations, { percentage: '', method: '' }]);
    };

    const handleChangeText = (index, field, value) => {
        const newEvaluations = evaluations.map((evaluation, idx) =>
            idx === index ? { ...evaluation, [field]: value } : evaluation
        );
        setEvaluations(newEvaluations);
    };
    
    const handleSubmit = async () => {
        try {
          
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Thông báo Error", "No access token found.");
                return;
            }

            // Gửi yêu cầu POST để thêm đánh giá mới
            const response = await authApi(token).post(endpoints['add-evaluation'](outlineId), {evaluation: evaluations});

            if (response.status === 201) {
                console.info("Thêm đánh giá thành công:", response.data);
                Alert.alert("Thông báo", "Đã thêm đánh giá thành công.");
                setEvaluations([{ percentage: '', method: '' }]);
                setEditMode(false);

            } else if (response.status === 403) {
                console.error("Error: Chỉ có giảng viên mới được thêm đánh giá.");
                Alert.alert("Error: Chỉ có giảng viên mới được thêm đánh giá.");
            } else if (response.status === 400) {
                console.error("Error: Lỗi nhập sai phần trăm và thành phần đánh giá.");
                Alert.alert("Error: Lỗi nhập sai phần trăm và thành phần đánh giá.");
            } else {
                console.error("Error creating lesson:", response.errorData);
                Alert.alert("Error", "Bị lỗi khi thêm đánh giá!!!");
            }
        } catch (error) {
          Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
        }
    };

    const handleCourseText = (index, field, value) => {
        const newCourse = course.map((course, idx) =>
            idx === index ? { ...course, [field]: value } : course
        );
        setCourse(newCourse)
    };

    const addCourse = async () => {
        try {
          
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }

            // Gửi yêu cầu POST để tạo khóa học mới
            const response = await authApi(token).post(endpoints['add-course'](outlineId), {course: course});

            if (response.status === 201) {
                console.info("Thêm khóa học thành công:", response.data);
                Alert.alert("Thông báo", "Đã thêm khóa học thành công.");
                setCourse([{year: ' '}])
                setIsModalVisible(false);

            } else if (response.status === 403) {
                console.error("Thông báo Error: Chỉ có giảng viên mới được thêm khóa học cho đề cương này.");
                Alert.alert("Thông báo Error: Chỉ có giảng viên mới được thêm khóa học cho đề cương này.");
                setCourse([{year: ' '}])

            } else if (response.status === 400) {
                console.error("Error: Một đề cương chỉ tối đa hai khóa học.");
                Alert.alert("Error: Một đề cương chỉ tối đa hai khóa học.");
                setCourse([{year: ' '}])
                setEditMode(false);
                nav.navigate('Outline');
            } else {
                console.error("Error creating lesson:", response.errorData);
                Alert.alert("Error", "Bị lỗi khi thêm đánh giá!!!");
            }
        } catch (error) {
          Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
        }
    };

    const loadOutlineDetails = async () => {
        try {
            let res = await APIs.get(endpoints['outline-details'](outlineId));
            setOutlineDetails(res.data);
            // console.info(res.data)
        } catch (err) {
            console.error(err);
        }
    }
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            let res = await APIs.get(endpoints['outline-details'](outlineId));
            setOutlineDetails(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    const getEvaluationType = (method) => {
        switch (method) {
          case 'FinalExam':
            return 'Đánh giá cuối kỳ';
          case 'Midterm':
            return 'Đánh giá giữa kỳ';
          case 'Chuyên cần':
            return 'Đánh giá quá trình';
          default:
            return method;
        }
      };
    
    
    const loadComment = async () => {
        if(page > 0){
            try {
                let url = `${endpoints['outline-comment'](outlineId)}?page=${page}`
                let res = await APIs.get(url);
                if (res.data.next === null){
                    setPage(0);
                    setMore(false);
                }
                if (page === 1){
                    setComment(res.data.results);
                }else{
                    setComment(current => {
                        return [...current, ...res.data.results];
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    const addComment = async (content) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const commentData = {
                content: content,
                // student: currentUser
            };
            // Gửi yêu cầu POST để tạo comment mới
            const response = await authApi(token).post(endpoints['add-comment'](outlineId), commentData);

            // Kiểm tra phản hồi từ server
            if (response.status === 201) {
                console.info("Done:", response.data);
                Alert.alert("Thông báo", "Đã thêm bình luận mới.");
                setComment([...comment, response.data]);
                setContent('');
                // nav.navigate("Outline")
            } else {
                console.error("Error creating comment:", response.errorData);
                Alert.alert("Error", "Thêm bình luận bị lỗi!!!");
            }
        }catch(ex){
            Alert.alert("Error", "Network request failed. Please check your connection.");
            console.error(ex);
        }finally{
            setLoading(false);
        }
    };

    const editComment  = async (commentId, content) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const commentData = {
                content: content,
            };
            // Gửi yêu cầu POST để tạo comment mới
            const response = await authApi(token).patch(`${endpoints['update-comment'](commentId)}`, commentData);

            // Kiểm tra phản hồi từ server
            if (response.status === 200) {
                console.info("Done:", response.data);
                Alert.alert("Thông báo", "Đã sửa bình luận mới.");
                setComment(comment.map(c => c.id === commentId ? response.data : c));
                setEditingCommentId(null);
                setEditContent('');
            } else {
                console.error("Error creating comment:", response.data);
                Alert.alert("Error", "Sửa bình luận bị lỗi!!!");
            }
        }catch(ex){
            Alert.alert("Error", "Network request failed. Please check your connection.");
            console.error(ex);
            nav.navigate("Lesson");
        }finally{
            setLoading(false);
        }
    };

    const deleteComment  = async (commentId) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            
            // Gửi yêu cầu POST để xóa comment
            const response = await authApi(token).delete(`${endpoints['delete-comment'](commentId)}`);

            // Kiểm tra phản hồi từ server
            if (response.status === 204) {
                Alert.alert("Thông báo", "Đã xóa bình luận thành công.");
                setComment(comment.filter(c => c.id !== commentId));
                 
            } else {
                console.error("Error creating comment:", response.data);
                Alert.alert("Error", "Xóa bình luận bị lỗi!!!");
            }
        }catch(ex){
            Alert.alert("Error", "Network request failed. Please check your connection.");
            console.error(ex);
            nav.navigate("Lesson");
        }finally{
            setLoading(false);
        }
    };

    const deleteEvaluation  = async (outlineId, evaluationId) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            
            // Gửi yêu cầu POST để tạo xóa đánh giá
            const response = await authApi(token).delete(`${endpoints['delete-evaluation'](outlineId, evaluationId)}`);

            // Kiểm tra phản hồi từ server
            if (response.status === 204) {
                Alert.alert("Thông báo", "Đã xóa đánh giá thành công.");
                setEvaluation(evaluation.filter(c => c.id !== evaluationId));
                nav.navigate('Outline');
            } else {
                console.error("Error creating comment:", response.data);
                Alert.alert("Error", "Xóa đánh giá bị lỗi!!!");
            }
        }catch(ex){
            Alert.alert("Error", "Network request failed. Please check your connection.");
            console.error(ex);
            nav.navigate("Outline");
        }finally{
            setLoading(false);
        }
    };   

    const handleDeleteComPress = (commentId, commentUserId) => {
        if (currentUser !== commentUserId) {
            Alert.alert("Thông báo", "Bạn không được phép xóa bình luận này.");
            return;
        }
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn xóa bình luận này không?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => deleteComment(commentId) }
            ]
        );
    };

    const handleDeleteEvaPress = (evaluationId, UserId, outlineId) => {
        if (currentUser !== UserId) {
            Alert.alert("Thông báo", "Bạn không được phép xóa đánh giá này.");
            return;
        }
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn xóa đánh giá này không?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => deleteEvaluation(outlineId,evaluationId) }
            ]
        );
    };

    const handleEditPress = (commentId, commentContent, commentUserId) => {
        if (currentUser !== commentUserId) {
            Alert.alert("Thông báo", "Bạn không được phép chỉnh sửa bình luận này.");
            return;
        }
        setEditingCommentId(commentId);
        setEditContent(commentContent);
    }

    
    const handleEditEvaluation = () => {
        const totalPercentage = details.evaluation.reduce((sum, evalItem) => sum + evalItem.percentage, 0);

        if (currentUser !== details?.lecturer.account.id) {
          Alert.alert("Thông báo", "Bạn không được phép chỉnh sửa đánh giá của đề cương này.");
          return;
        }
        if (totalPercentage === 100) {
            Alert.alert("Thông báo", "Tổng phần trăm đánh giá đã là 100%, không thể chỉnh sửa thêm.");
            return;
        }else{
            setIsModalVisible(true);
        }
    };

    const handleEditCourse = () => {
        if (currentUser !== details?.lecturer.account.id) {
          Alert.alert("Thông báo", "Bạn không được phép chỉnh sửa khóa học của đề cương này.");
          return;
        }else if (details?.course.length >= 2) {
            Alert.alert("Thông báo", "Không thể thêm nhiều hơn 2 khóa học.");
        }else{
            setIsModalVisible(true);
        }
    };

    const handleEditOutline = (id) => {
        if (currentUser !== details?.lecturer.account.id) {
          Alert.alert("Thông báo", "Bạn không được phép chỉnh sửa đề cương này.");
          return;
        }
        nav.navigate("UpdateOutline", {'outlineId': id})
    };

    const handleDownload = async () => {
        setLoading(true);
        setDownloading(true);
        try{
            const response = await APIs.get(endpoints['outline-download'](outlineId));
            
            if (response.status === 200) {
                const pdfUrl = response.request.responseURL;
                Linking.openURL(pdfUrl);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load PDF',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.error || 'An error occurred',
            });
        } finally {
            setDownloading(false);
            setLoading(false);
        }
    };

    const addNewComment = () => {
        addComment(content);
    };

    useEffect(() => {
        loadOutlineDetails();
    }, [value, outlineId]);

    useEffect(() => {
        loadComment();
    }, [page, outlineId]);

    const moreComment = () =>{
        setPage(page+1);
    }
    return (
        <Provider>
        <View style={MyStyle.container}>
            {details===null?<ActivityIndicator />:<>
                <ScrollView style={styles.container} key={details.id} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}  >
                    <Card style={MyStyle.card}>
                        <Card.Cover style={[styles.cover]}
                                source={{ uri: details.image }}/>
                        <Card.Content>
                        <View style={{flexDirection:"row"}}>
                        <Title style={MyStyle.title}>{details.name}</Title>

                        <TouchableOpacity style={{margin: 7}} onPress={() => handleEditOutline(details.id)}>
                                <FontAwesome name="edit" size={24} color="black" />
                        </TouchableOpacity>

                        </View>
                        <Paragraph style={MyStyle.paragraph}>Giảng viên: Ths {details.lecturer.full_name}</Paragraph>
                        <Paragraph style={MyStyle.paragraph}>Chức vụ: {details.lecturer.position}</Paragraph>
                        <Paragraph style={MyStyle.paragraph}>
                            {showFullOverview ? details.overview : `${details.overview.substring(0, 70)}... `}
                            <TouchableOpacity onPress={toggleOverview}>
                                <Text style={styles.showMoreText}>{showFullOverview ? ' Thu gọn' : ' Xem thêm'}</Text>
                            </TouchableOpacity> 
                        </Paragraph>
                        <Paragraph style={MyStyle.paragraph}>Đã xét duyệt: {details.is_approved === true?"Đã":"Chưa"}</Paragraph>
                        <Text style={MyStyle.date}>Ngày tạo: {moment(details.created_date).format('Do MMMM, YYYY')}</Text>
                        </Card.Content>
                        
                        <Button
                            onPress={handleDownload}
                            disabled={downloading}
                            icon="cloud-download-outline" 
                            style={MyStyle.button}>{downloading ? 'Đang Tải...' : 'Tải Đề Cương'}</Button>
                            <Toast ref={(ref) => Toast.setRef(ref)} />

                    </Card>
                    <SegmentedButtons style={MyStyle.margin}
                        value={value}
                        onValueChange={setValue}
                        buttons={[
                        {
                            value: 'evaluation',
                            label: 'Đánh giá',
                        },
                        {
                            value: 'course',
                            label: 'Khóa học',
                        },
                        {
                            value: 'comment',
                            label: 'Bình luận',
                        }
                        ]}
                    />
                    {value === 'evaluation' && (
                        <View style={MyStyle.outline}>
                            <View style={styles.header}>
                            <Text style={[styles.text]}>1. Đánh giá môn học/ Student assessment</Text>
                            {userRole === 'lecturer' && (
                                <TouchableOpacity onPress={handleEditEvaluation}>
                                <FontAwesome name="edit" size={24} color="black" />
                                </TouchableOpacity>
                            )}
                            </View>
                            
                            <DataTable>
                                <DataTable.Header style={styles.tableHeader}>
                                    <DataTable.Title style={styles.tableTitle1}>Thành phần đánh giá</DataTable.Title>
                                    <DataTable.Title style={styles.tableTitle1}>Thời điểm</DataTable.Title>
                                    <DataTable.Title style={styles.tableTitle3}>Tỷ lệ</DataTable.Title>
                                    <DataTable.Title style={styles.tableTitle3}></DataTable.Title>
                                </DataTable.Header>
                                { details.evaluation.map((evalItem, index) => (
                                    <DataTable.Row key={evalItem.id} style={styles.tableRow}>
                                        <DataTable.Cell style={styles.tableCell1}>{getEvaluationType(evalItem.method)}</DataTable.Cell>
                                        <DataTable.Cell style={styles.tableCell1}>
                                            {evalItem.method === "FinalExam" ? 'Kết thúc môn học' : 'Quá trình học'}
                                        </DataTable.Cell>
                                        <DataTable.Cell style={styles.tableCell3}>{evalItem.percentage}%</DataTable.Cell>
                                        {/* <DataTable.Cell style={styles.tableCell3}>{details.evaluation.reduce((sum, evalItem) => sum + evalItem.percentage, 0)}%</DataTable.Cell> */}
                                        <DataTable.Cell style={styles.tableCell3}>
                                        <Appbar.Action 
                                                        icon='playlist-remove'
                                                        onPress={() => handleDeleteEvaPress(evalItem.id,details.lecturer.account.id, outlineId)}/>
                                            </DataTable.Cell>
                                    </DataTable.Row>
                                    
                                    ))}
                            </DataTable>
                            {evaluations.map((evaluation, index) => (
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
                                        <Text style={MyStyle.modalText}>Thêm đánh giá {index+1}</Text>
                                        <TextInput
                                            style={MyStyle.inputAC}
                                            placeholder="Nhập phần trăm"
                                            value={evaluation.percentage}
                                            onChangeText={(text) => handleChangeText(index, 'percentage', text)}
                                            keyboardType="numeric"
                                        />
                                        <TextInput
                                            style={MyStyle.inputAC}
                                            placeholder="Nhập phương thức"
                                            value={evaluation.method}
                                            onChangeText={(text) => handleChangeText(index, 'method', text)}
                                        />
                                        {loading ? (
                                            <ActivityIndicator />
                                        ) : (
                                            <>
                                                <Button mode="contained" onPress={handleSubmit} style={MyStyle.button}>Lưu</Button>
                                                <Button mode="contained" onPress={handleAddEvaluation} style={MyStyle.button}>Thêm Đánh Giá</Button>
                                                <Button mode="outlined" onPress={() => setIsModalVisible(false)} style={MyStyle.button}>Hủy</Button>
                                                
                                            </>
                                        )}
                                    </View>
                                </View>
                            </Modal>
                            ))}
                        </View>
                    )}
                    {value === 'course' && (
                        <View style={MyStyle.outline}>
                            <View style={styles.header}>
                            <Text style={[styles.text]}>2. Danh sách khóa học</Text>
                            { userRole === 'lecturer' && (
                                <TouchableOpacity onPress={handleEditCourse}>
                                <FontAwesome name="edit" size={24} color="black" />
                                </TouchableOpacity>
                            )}
                            </View>
                            <DataTable>
                                <DataTable.Header style={styles.tableHeader}>
                                    <DataTable.Title style={styles.tableTitle3}>Năm</DataTable.Title>
                                    <DataTable.Title style={styles.tableTitle1}>Khoa</DataTable.Title>
                                    <DataTable.Title style={styles.tableTitle1}>Ngành</DataTable.Title>
                                </DataTable.Header>
                                {details.course.map(item => (
                                    <DataTable.Row key={item.id} style={styles.tableRow}>
                                        <DataTable.Cell style={styles.tableCell3}>{item.year}</DataTable.Cell>
                                        <DataTable.Cell style={styles.tableCell1}>Công nghệ thông tin</DataTable.Cell>
                                        <DataTable.Cell style={styles.tableCell1}>Công nghệ thông tin</DataTable.Cell>
                                    </DataTable.Row>
                                 ))}
                            </DataTable>
                            {course.map((c, index) => (
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
                                            value={c.year}
                                            onChangeText={(text) => handleCourseText(index, 'year', text)}
                                            keyboardType="numeric"
                                        />
                                        {loading ? (
                                            <ActivityIndicator />
                                        ) : (
                                            <>
                                                <Button mode="contained" onPress={addCourse} style={MyStyle.button}>
                                                    Lưu
                                                </Button>
                                                <Button mode="outlined" onPress={() => setIsModalVisible(false)} style={MyStyle.button}>
                                                    Hủy
                                                </Button>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </Modal>
                            ))}
                        </View>
                    )}
                    {value === 'comment' && (
                        <View style={MyStyle.outline}>
                            <Text style={[styles.text]}>3. Bình luận</Text>
                            {userRole === 'student'?(
                            <View style={styles.inputContainerNow}>
                                <TextInput
                                    mode="outlined"
                                    label="Thêm bình luận"
                                    value={content}
                                    onChangeText={setContent}
                                    style={styles.textInput}
                                    multiline
                                />
                                <Button 
                                    mode="contained" 
                                    onPress={addNewComment}
                                    style={styles.addButton}>Gửi
                                </Button>
                            </View>
                            ): null}
                            <View>
                                {loading && <ActivityIndicator/>}
                                {comment.length > 0 ? (
                                    comment.map((c, index) => 
                                        <View style={styles.commentContainer}>
                                            {c.student.avatar === null ? <>
                                            <View style={styles.avatarContainer}>
                                                <Avatar.Icon size={24} icon='account' style={styles.avatar} />
                                            </View>
                                            </>: <>
                                            <View style={styles.avatarContainer}>
                                                <Image source={{ uri: c.student.avatar }} style={styles.avatar} />
                                            </View>
                                            </>}
                                            
                                            <View style={styles.commentContent}>
                                                {editingCommentId === c.id ? (
                                                            <>
                                                                <TextInput
                                                                    mode="outlined"
                                                                    label="Chỉnh sửa bình luận"
                                                                    value={editContent}
                                                                    onChangeText={setEditContent}
                                                                    style={styles.textInput}
                                                                    multiline
                                                                />
                                                                <View style={MyStyle.row1}>
                                                                    <TouchableOpacity
                                                                        mode="contained"
                                                                        onPress={() => editComment(c.id, editContent)}>
                                                                    <Text style={styles.addButton1}>Lưu</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        mode="contained"
                                                                        onPress={() => setEditingCommentId(null)}>
                                                                    <Text style={styles.addButton1}>Hủy</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Text style={styles.fullName}>{c.student.full_name}</Text>
                                                                <Text>{c.content}</Text>
                                                                <Text style={styles.createdDate}>{moment(c.created_date).format('Do MMMM, YYYY')}</Text>
                                                            </>
                                                        )}
                                            </View>
                                            <View style={styles.menuAnchor}>
                                                <Menu 
                                                    visible={visibleMenus[index]}
                                                    onDismiss={() => closeMenu(index)}
                                                    anchor={<Appbar.Action 
                                                        icon={MORE_ICON}
                                                        onPress={() => openMenu(index)}/>}
                                                        contentStyle={styles.menuContent}
                                                    >
                                                    {userRole === 'student' && (
                                                        <>
                                                            <Menu.Item 
                                                                onPress={() => handleEditPress(c.id, c.content, c.student.account.id)} 
                                                                title="Chỉnh sửa" titleStyle={styles.menuItem} />
                                                            <Menu.Item onPress={() => { handleDeleteComPress(c.id, c.student.account.id )}} title="Xóa" titleStyle={styles.menuItem} />
                                                            
                                                        </>
                                                    )}
                                                </Menu>
                                                
                                            </View>
                                            
                                        </View>
                                        
                                    )
                                ):(
                                    <Text style={styles.noncomment}>Không có bình luận nào</Text>
                                )}
                                
                                <TouchableOpacity style={styles.resetButton} onPress={moreComment}>
                                        <Text style={styles.resetButtonText}>{more === true ? 'Xem thêm bình luận': ''}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </>}
        </View>
        </Provider>
    );
};
export default OutlineDetail;