import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { useContext, useEffect, useState } from "react";
import { Button, Card, List, Paragraph, SegmentedButtons, Title } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import moment from "moment";
import { MyUserContext } from "../../configs/Context";

const LessonDetail = ({navigation, route}) => {
    const [details, setLessonDetails] = useState(null);
    const {lessonId} = route.params;
    const [value, setValue] = useState('outline');
    const [courses, setCourses] = useState([]);
    const [outlines, setOutlines] = useState([]);
    const user = useContext(MyUserContext);
    const loadLessonDetails = async () => {
            try {
                let res = await APIs.get(endpoints['lesson-details'](lessonId));
                setLessonDetails(res.data);
            } catch (err) {
                console.error(err);
            }
        }

    const loadLessonCourse = async () => {
        try {
            let res = await APIs.get(endpoints['lesson-course'](lessonId));
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    const loadLessonOutline = async () => {
        try {
            let res = await APIs.get(endpoints['lesson-outline'](lessonId));
            setOutlines(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadLessonDetails();
        if (value === 'course') {
            loadLessonCourse();
        }else if(value === 'outline'){
            loadLessonOutline();
        }
    }, [value, lessonId]);


    return (
        <View style={MyStyle.container}>
            {details===null?<ActivityIndicator />:<>
                
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
                            <Text style={MyStyle.text}>Danh sách các đề cương</Text>
                            <View style={MyStyle.margin}>
                                {outlines.length > 0 ? (
                                    outlines.map((outline, index) => (
                                    <TouchableOpacity key={index} onPress={() =>{navigation.navigate('OutlineDetail', {'outlineId': outline.id})}}>
                                        <List.Item  title={`${outline.name}`}
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
                            <Text style={MyStyle.text}>Danh sách các khóa học</Text>
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
            
        </View>
    )
};

export default LessonDetail;