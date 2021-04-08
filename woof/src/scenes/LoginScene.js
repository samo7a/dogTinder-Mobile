import React, {useState, useEffect} from 'react';
import { StyleSheet,
        Text, 
        View, 
        Image, 
        TouchableWithoutFeedback, 
        Keyboard,
        SafeAreaView,  
        Modal,  
        TouchableOpacity, 
        TextInput,
        KeyboardAvoidingView,
        ActivityIndicator
    } from 'react-native';
import { useHistory} from "react-router-native";
import LinearGradient from 'react-native-linear-gradient';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../images/logo.png';
import styles from '../../styles/GlobalStyles';
import Axios , {setClientToken}from '../utilities/axios';
import jwt_decode from 'jwt-decode';




const storage = require('../utilities/TokenStorage');


const LoginScene = () => {
    
    useEffect( () => {
         async function checkLogin() {
            console.log("Hello from use Effect");
            const bol =  await storage.load('isLoggedIn');
            console.log(bol);
            if (bol === 'true') {
                console.log("It was ture");
                const token =  await storage.load('accessToken');
                const obj = jwt_decode(token, { complete: true });
                console.log(obj);
                if (obj.isOwner === true) {
                    history.push('/ownerHome');
                }
                else {
                    history.push('/adaptorHome');
                }
            }
        }
        try{
            checkLogin();
        } catch (e) {
            console.log(e);
        }
    }, []);
    const history = useHistory();
    //const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    const loginHandler = async () => {
        //event.preventDefault();
        //setIsLoading(true);
        const json = {
            Email: email,
            Password: password,
        };
        
          const onFailure = error => {
            console.log(error);
            console.log('wird erreo about var');
          };
        await Axios.post('/login', json)
        .then(async function (response) {
            var res = response.data.accessToken;
            console.log("accessToken: ****" + res);
            var ud = jwt_decode(res,{complete:true});
            console.log(ud);

            if (res.error) {
              console.log(res.error);
              history.push('/login');
            } else {
                storage.save('accessToken', JSON.stringify(res));
                storage.save('isLoggedIn', 'true');
                setClientToken(res);
                const tok = await storage.load('accessToken');
                const tok2 = await storage.load('isLoggedIn');
                console.log("FROM LOGIN HANDEL++" + tok);
                console.log("FROM LOGIN HANDEL++" + tok2);
              if (isOwner){
                history.push('/ownerHome');
              } else {
                  history.push('/adaptorHome');
              }
            }
          })
        .catch(onFailure);
    }
    return (
        <SafeAreaView>
            <LinearGradient colors={['#8D99AE','#EDF2F4']} style={{height:'100%'}}>
                <TouchableWithoutFeedback  onPress={Keyboard.dismiss} >
                    <View style={styles.container}>
                        <Image style={styles.logo} source={logo} />
                        <KeyboardAvoidingView behavior='padding' style={{flex : 1,}} >
                            <View style={styles.form}>
                                <Text style={styles.text}>Email</Text>
                                <TextInput  style={styles.inputText} 
                                            placeholder = "Email" 
                                            onChangeText = {(e) => setEmail(e)} 
                                            value ={email}
                                            backgroundColor='white'
                                            keyboardType = 'email-address'    
                                            autoCapitalize = 'none' 
                                />
                                <Text style={styles.text}>Password</Text>
                                <TextInput  style={styles.inputText} 
                                            placeholder = "Password" 
                                            onChangeText = {(e) => setPassword(e)} 
                                            value ={password}
                                            backgroundColor='white'
                                            secureTextEntry={true} 
                                            textContentType='password'
                                            keyboardType = 'default'
                                />
                                <BouncyCheckbox
                                    size={25}
                                    fillColor="red"
                                    unfillColor="#FFFFFF"
                                    text="Are you a dog owner?"
                                    iconStyle={{ borderColor: "red" }}
                                    textStyle={{  textDecorationLine : "none"}}
                                    onPress={() => {setIsOwner(!isOwner)}}
                                    style={styles.checkbox}
                                />
                                <TouchableOpacity onPress={loginHandler}>
                                    <View style={styles.primaryButton}>
                                    <Text style={{ fontFamily: 'Arial', fontSize: 15, color: 'white', alignSelf: 'center' }}>
                                        Login
                                    <Icon name="chevron-right" size={15} color="white" />
                                    </Text>
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.text}>New User?</Text>
                                <TouchableOpacity onPress={ () => history.push("/signup")}>
                                    <View style={styles.secondaryButton}>
                                    <Text style={{ fontFamily: 'Arial', fontSize: 15, color: 'white', alignSelf: 'center' }}>
                                        Signup
                                    <Icon name="chevron-up" size={15} color="white" />
                                    </Text>
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.link} onPress={() => history.push('/reset')} > Forgot your Password? </Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>    
                 </TouchableWithoutFeedback>
            </LinearGradient>
        </SafeAreaView>
    ); 
}

export default LoginScene; 
