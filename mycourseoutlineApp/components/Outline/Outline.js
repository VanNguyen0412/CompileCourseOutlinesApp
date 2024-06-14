import { Alert, RefreshControl, Text, View } from "react-native";
import { ActivityIndicator, AnimatedFAB, Chip, List, Provider } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import { useContext, useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Context";
import { ScrollView } from "react-native";
import { Button, Card, Icon, Image, SearchBar } from "react-native-elements";
import styles from "./styles";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import { color } from "react-native-elements/dist/helpers";

const Outline = () => {
    const [outlines, setOutlines] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useContext(MyUserContext);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const nav = useNavigation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const userRole = user?.role;
    const [refreshing, setRefreshing] = useState(false);

    
    
    const [filter, setFilter] = useState([
        {
            label:'Chọn loại...'},
        {
            label:'Theo tên đề cương', value : 'q'},
        {
            label:'Theo tín chỉ',value: 'credit'},
        {
            label:'Theo tên giảng viên',value: 'lecturer'},
        {
            label:'Theo khóa học',value: 'course'},
        
    ]);
    
    const loadOutline = async () =>{
        if(page > 0){
            let url = `${endpoints['outlines']}?page=${page}`;
            if (value && query) {
                url += `&${value}=${query}`;
            }
            setLoading(true);
            try{
                let res = await APIs.get(url);
                if (res.data.next === null)
                    setPage(0);

                if (page === 1)
                    setOutlines(res.data.results);
                else
                    setOutlines(current => {
                        return [...current, ...res.data.results];
                    });  
            }catch(ex){
                console.error(ex);
            }finally{
                setLoading(false);
        }
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if(page > 0){
            let url = `${endpoints['outlines']}?page=${page}`;
            if (value && query) {
                url += `&${value}=${query}`;
            }
            setLoading(true);
        try{
            let res = await APIs.get(url);
            if (res.data.next === null)
                setPage(0);

            if (page === 1)
                setOutlines(res.data.results);
            else
                setOutlines(current => {
                    return [...current, ...res.data.results];
                });  
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    }
    };

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 120;
        return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
    };

    const loadMore = ({nativeEvent}) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
                setPage(page + 1);
        }
    }
    useEffect(() => {
        loadOutline();
    }, [page]);

    useEffect(() => {
        if (page === 1) {
            loadOutline();
        } else {
            setPage(1);
        }
    }, [value, query]);

    const search = (searchValue) => {
        setQuery(searchValue);
    }

    return (
        <Provider>
            <View >
                <SearchBar placeholder="Nhập từ khóa..." 
                            onChangeText={search} value={query}
                            containerStyle={MyStyle.searchContainer}
                            inputContainerStyle={MyStyle.inputContainer}
                            inputStyle={MyStyle.input}
                />
            </View>
            <View style={[styles.row]}>
                <DropDownPicker
                        style={styles.dropdownContainer}
                        open={open}
                        value={value}
                        items={filter}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setFilter}
                        placeholder="Chọn loại..."
                        containerStyle={styles.dropdownWrapper}
                /> 
                {userRole === 'lecturer'?(
                        
                    <View style={styles.gridItem}>
                        <TouchableOpacity onPress={() => {nav.navigate('CreateOutline')}} style={styles.imageContainer}>
                            <Image style={styles.imageAdd}  source={require('./images/category.jpg')} />
                            <View style={styles.overlay}>
                                <Text style={ styles.name}>Thêm</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ):null} 
               
            </View>
             
           <ScrollView  onScroll={loadMore} style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }>
            {loading && <ActivityIndicator/>}
            {outlines.map(o => (
                <View contentContainerStyle={styles.container} key={o.id}>
                    <Card>
                    <Image source={{ uri: o.image }} style={styles.image} />
                    <View style={MyStyle.row}>
                        <Text style={styles.courseName}>{o.name}</Text>
                    </View>                    
                    <Card.Divider />
                    <View style={styles.details}>
                        <Text style={styles.detailItem}>Môn học: {o.lesson.subject}</Text>
                        <Text style={styles.detailItem}>Số tín chỉ: {o.credit}</Text>
                        <Text style={styles.detailItem}>Ngày tạo: {moment(o.created_date).format('Do MMMM, YYYY')}</Text>
                    </View>
                    <Button
                        icon={<Icon name='book' color='#ffffff' />}
                        buttonStyle={styles.button}
                        title='View Detail'
                        onPress={() => {nav.navigate("OutlineDetail", {'outlineId': o.id})}}
                    />
                    </Card>
              </View>
            ))}
            </ScrollView>
            <AnimatedFAB
                icon={"plus"}
                label={"Add complaint"}
                // extended={isExtended}
                onPress={() => nav.navigate("CreateOutline")}
                // visible={visible}
                animateFrom={"right"}
                iconMode={"static"}
                style={[styles.fabStyle]}
            />
        </Provider>
    );
};
export default Outline;
