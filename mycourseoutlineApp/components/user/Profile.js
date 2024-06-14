import { useContext } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
// import { Button } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import MyStyle from "../../styles/MyStyle";
import { Card, Icon, Button } from "react-native-elements";
import styles from "./styles";
import moment from "moment";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();

    const getUserRole = (role) => {
      switch (role) {
        case 'lecturer':
          return 'Giảng Viên';
        case 'admin':
          return 'Quản trị viên';
        case 'student':
          return 'Sinh Viên';
        default:
          return role;
      }
    };


    return (
        <View style={styles.container}>
        <Card>
            <View style={styles.header1}>
              {user.avatar === null ? <>
                <Image source={require('./images/a.jpg')} style={styles.avatar}
              />
              </>:<>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              </>}
            
            <View style={styles.userInfo1}>
                <Text style={styles.username1}>{user.username}</Text>
                <Text style={styles.role1}>{getUserRole(user.role)}</Text>
            </View>
            </View>
        <Card.Divider />
        <View style={styles.details}>
          <Text style={styles.detailItem}>ID: {user.id}</Text>
          <Text style={styles.detailItem}>Tham gia: {moment(user.date_join).format('Do MMMM, YYYY')}</Text>
          <Text style={styles.detailItem}>Email: {user.email ? user.email : "..."}</Text>
          <Text style={styles.detailItem}>Đã xét duyệt: {user.is_approved ? "Yes" : "No"}</Text>
        </View>
        <TouchableOpacity style={MyStyle.margin} onPress={() => nav.navigate('Update')}>
          <Text>Update Tài Khoản</Text>
        </TouchableOpacity>
        <Button
          icon={<Icon name='logout' color='#ffffff' />}
          buttonStyle={styles.button1}
          title='Logout'
          onPress={() => dispatch({type: "logout"})}
        />
      </Card>
    </View>
  );
        
}

export default Profile;