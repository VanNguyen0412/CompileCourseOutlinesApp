import { useContext } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import { Card, Icon, Button } from "react-native-elements";
import styles from "./styles";
import moment from "moment";
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
        {user.role === 'admin' ? <>
        <Card>
            <View style={styles.header1}>
              {user.avatar === null ? <>
                <Image source={require('./images/2.png')} style={styles.avatar}
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
          <Text style={styles.detailItem}>Tham gia: {moment(user.date_join).format('Do MMMM, YYYY')}</Text>
          <Text style={styles.detailItem}>Chức vụ: {user.position? user.position: "..."}</Text>
          <Text style={styles.detailItem}>Email: {user.email ? user.email : "..."}</Text>
          <Text style={styles.detailItem}>Giới Tính: {user.gender ? "Nam" : "Nữ"}</Text>
        </View>
        
        <Button
          icon={<Icon name='logout' color='#ffffff' />}
          buttonStyle={styles.button1}
          title='Logout'
          onPress={() => dispatch({type: "logout"})}
        />
      </Card>
      </>:<>
      <Card>
            <View style={styles.header1}>
              {user.account.avatar === null ? <>
                <Image source={require('./images/2.png')} style={styles.avatar}
              />
              </>:<>
                <Image source={{ uri: user.account.avatar }} style={styles.avatar} />
              </>}
            
            <View style={styles.userInfo1}>
                <Text style={styles.username1}>{user.full_name}</Text>
                <Text style={styles.role1}>{getUserRole(user.account.role)}</Text>
            </View>
            </View>
        <Card.Divider />
        <View style={styles.details}>
        <Text style={styles.detailItem}>Username: {user.account.username}</Text>
          <Text style={styles.detailItem}>Tham gia: {moment(user.date_join).format('Do MMMM, YYYY')}</Text>
          <Text style={styles.detailItem}>Chức vụ: {user.position? user.position: "..."}</Text>
          <Text style={styles.detailItem}>{user.account.email ? `Email: ${user.account.email}` : `Tuổi: ${user.age}`}</Text>
          <Text style={styles.detailItem}>Giới Tính: {user.gender ? "Nam" : "Nữ"}</Text>
        </View>
        <Button
          icon={<Icon name='update' color='#ffffff' />}
          buttonStyle={styles.button2}
          title='Chỉnh sửa'
          onPress={() => nav.navigate("UpdateAccount")}
        />
        <Button
          icon={<Icon name='logout' color='#ffffff' />}
          buttonStyle={styles.button1}
          title='Logout'
          onPress={() => dispatch({type: "logout"})}
        />
      </Card>
      </>}
    </View>
  );
        
}

export default Profile;