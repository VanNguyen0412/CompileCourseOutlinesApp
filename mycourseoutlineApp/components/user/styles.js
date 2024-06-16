import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        // width: "70%"
      },
      header1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
      },
      userInfo1: {
        marginLeft: 10,
      },
      username1: {
        fontSize: 22,
        fontWeight: 'bold',
      },
      role1: {
        fontSize: 18,
        color: 'grey',
      },
      details: {
        marginBottom: 10,
      },
      detailItem: {
        fontSize: 16,
        marginBottom: 5,
      },
      button1: {
        backgroundColor: 'rgb(120, 69, 172)',
        marginBottom: 7,
      },
      button2: {
        backgroundColor: '#ba55d3',
        marginBottom: 7,
      },
      containerLogin: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 50,
    },   
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainer: {
        marginBottom: 10, 
        paddingTop: 60
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    listContent: {
        paddingBottom: 16
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginVertical: 5,
        borderRadius: 5,
    },
    accountInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    name: {
        fontSize: 18,
        marginBottom: 5,
    },
    code: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    inputLogin: {
        flex: 1,
        height: 40,
    },
    button: {
        backgroundColor: '#1E90FF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    icon: {
        marginLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },inputContainerCO: {
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
  },fieldContainerCO: {
    marginBottom: 15,
},
labelCO: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
},
});