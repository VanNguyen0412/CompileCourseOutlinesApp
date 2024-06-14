import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f2f2f2',
        padding: 4,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    courseName: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    }, 
    overview: {
        fontSize: 16,
        color: 'grey',
        marginBottom: 10,
        textAlign: 'center',
    },
    showMoreText: {
        color: 'rgb(120, 69, 172)',
        fontWeight: 'bold',
    },
    details: {
        marginBottom: 20,
    },
    detailItem: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        backgroundColor: 'rgb(120, 69, 172)',
    },
    edit: {
        backgroundColor: '#f5f5dc',
    },
    evaluationTitle: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    evaluationItem: {
        fontSize: 16,
        marginBottom: 5
    },
    tableHeader: {
        marginTop: 10,
        backgroundColor: '#ffffff',
        height: 60, 
        borderBlockColor: '#333',
    },
    tableTitle1: {
        flex: 3,
        overflow: 'hidden',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tableTitle3: {
        flex: 1,
        overflow: 'hidden',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tableRow: {
        backgroundColor: '#ffffff',
        height: 70,
    },
    tableCell1: {
        flex: 3,
    },
    tableCell3: {
        flex: 1,
    },
    cover: {
        width: "89%",
        height: 130,
        borderRadius: 10,
        alignSelf: "center"
    },
    tableCource: {
        flex: 1,
        overflow: 'hidden',
        textAlign: 'center',
        fontWeight: 'bold',
    }, 
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'rgb(233, 223, 235)',
        margin: 5,
        marginLeft: 12,
        width: "80%"
    },
    resetButton: {
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
        width: "100%",
        marginLeft: 10, // Add some space between the dropdown and the button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,

    },
    resetButtonText: {
      color: '#808080',
      fontSize: 16,
      marginTop: 4,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Optional: Adjust based on your layout needs
    },
    dropdownWrapper: {
      flex:1,
      marginVertical: 10,
    },
    gridItem: {
        width: '25%',
        marginLeft: 5,
        marginRight: 7,
        alignSelf: 'center'
    },
    imageContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    imageAdd: {
        width: '100%',
        height: 40,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    commentContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    commentContent: {
        flex: 1,
    },
    fullName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    createdDate: {
        color: 'gray',
        fontSize: 12,
    },
    menuContent: {
        // backgroundColor: '#333',
        borderRadius: 5,
        elevation: 3,
    },
    menuItem: {
        fontSize: 16,
        paddingVertical: 10,
    }, 
    menuAnchor: {
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    textInput: {
        flex: 1,
        marginRight: 7,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 7.5,
        fontSize: 16,
    },
    addButton: {
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
       
    },
    addButton1: {
        color: '#9370db',
        fontSize: 16,
        marginTop: 4,
    },
    containerCO: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 8,
        margin: 20,
        marginBottom: 10,
    },
    headerCO: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'rgb(120, 69, 172)',
        textAlign: 'center',

    },
    fieldContainerCO: {
        marginBottom: 20,
    },
    labelCO: {
        fontSize: 16,
        fontWeight: '600',
        color: '#696969',
        marginBottom: 8,
    },
    inputCO: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    textAreaCO: {
        height: 80,
        textAlignVertical: 'top',
    },
    imageCO: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
    },
    buttonCO: {
        flexDirection: 'row',
        width: "55%",
        backgroundColor: '#5f9ea0',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonTextCO: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    saveButtonCO: {
        backgroundColor: 'rgb(120, 69, 172)',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginTop: 5,
        marginBottom: 10
    },
    saveButtonTextCO: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchCO: {
        width: "50%",
        height: 30
    },
    form: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    inputOD: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
    }, 
    evaluationContainer: {
        marginBottom: 16,
    },
    text: {
        fontSize: 17,
        color: '#808080',
        fontWeight: "500"
    },
    noncomment: {
        fontSize: 15,
        color: '#a9a9a9',
        fontWeight: "500",
        margin: 7
    }, 
    margin: {
        margin: 5,
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 10,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: "absolute",
      },

    
});