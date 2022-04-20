import React from 'react';
import {View,StyleSheet,Image,TextInput,TouchableOpacity,Text,AsyncStorage} from 'react-native';
import connect from '../components/connectedcomponent';
import PageContainer from '../components/PageContainer';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import UserService from '../service/userservice';
class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user:{
                email:"",
                password:""
            },
            error:false,
            errormsg:"",
            loging:false
        }
    }

    login = () => {
        let userservice = new UserService();
        const {intlData,updateLanguage} = this.props;
        
        if(this.validate())
        {
            this.setState({
                loging:true
            })
            let self = this;
            userservice.login(this.state.user.email,this.state.user.password,function(data){
                if(data.success)
                {
                    
                    self.props.navigation.navigate('Intro');
                    AsyncStorage.setItem("lang",data.lang);
                    updateLanguage(data.lang);
                    self.setState({error:false,loging:false});
                }
                else
                {
                    let message = intlData.messages['EMAIL_CONTRASEÑA_INCORRECTO'];
                    if(data.message)
                    {
                        message = data.message;
                    }
                    self.setState({
                        error:true,
                        errormsg:message,
                        loging:false
                    })
                }
            })
        }
    }

    validate = () => {
        const {intlData} = this.props;
        let data = this.state.data;
        for(let item in data)
        {
            if(!data[item])
            {
                this.setState({
                    error:true,
                    errormsg:""
                })

                return false;
            }
        }
        return true;
    }

    handleChange = (name,text) => {
        let user = this.state.user;
        user[name] = text;
        this.setState({
            user:user,
            error:false
        })
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} bannerenable={false} title={intlData.messages["LOGIN"]}>
                <View style={style.container}>
                    <Image source={require('../assets/icon.png')} style={style.logo}></Image>
                    <View style={style.form}>
                        <View style={style.formgroup}>
                            <Text style={style.label}>Email</Text>
                            <TextInput style={style.input} defaultValue={this.state.user.email} onChangeText={(text)=>this.handleChange("email",text)}></TextInput>
                        </View>
                        <View style={style.formgroup}>
                            <Text style={style.label}>{intlData.messages["CONTRASENA"]}</Text>
                            <TextInput style={style.input} secureTextEntry={true} defaultValue={this.state.user.password} onChangeText={(text)=>this.handleChange("password",text)}></TextInput>
                        </View>
                        <View style={style.formgroup}>
                            <TouchableOpacity style={style.login_btncontainer} onPress={this.login}>
                                {
                                    !this.state.loging ? (
                                        <Text style={style.loginbtn_text}>{intlData.messages["ENTRAR"]}</Text>
                                    ):(
                                        <Text style={style.loginbtn_text}>Sending</Text>
                                    )
                                }
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.error && (
                                <Text style={style.form_error}>{this.state.errormsg}</Text>       
                            )
                        }
                    </View>
                    <View style={style.formlink}>
                        <TouchableOpacity style={style.link} onPress={()=>this.props.navigation.navigate('Register')}>
                            <Text style={style.linktext}>{intlData.messages["NO_CUEN"]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.link} onPress={()=>this.props.navigation.navigate('Forgot')}>
                            <Text style={style.linktext}>{intlData.messages["OLVIDO"]}</Text>
                        </TouchableOpacity>
                    </View> 
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingLeft:wp('10%'),
        paddingRight:wp('10%')
    },
    logo:{
        width:wp('35%'),
        height:wp('35%'),
        alignSelf:'center',
        marginTop:hp('10%')
    },
    form:{
        marginTop:hp('3%'),
        flex:1
    },
    formgroup:{
        marginTop:hp('2%')
    },  
    label:{
        fontSize:hp('2.2%'),
        color:'#605e00',
        fontWeight:'700',
        paddingBottom:hp('0.5%')
    },
    input:{
        paddingLeft:wp('3%'),
        paddingTop:hp('1%'),
        paddingBottom:hp('1%'),
        backgroundColor:'white',
        borderRadius:5
    },
    login_btncontainer:{
        paddingTop:hp('1%'),
        paddingBottom:hp('1%'),
        backgroundColor:'#dd691b',
        justifyContent:'center',
        borderRadius:5,
        marginTop:hp('2%')
    },
    loginbtn_text:{
        color:'white',
        fontSize:hp('2%'),
        textAlign:'center'
    },
    formlink:{
       marginTop:hp('7%'),
       flex:1
    },
    link:{
        marginBottom:hp('5%'),
        justifyContent:'center'
    },
    linktext:{
        color:'#605e00',
        fontSize:hp('2.2%'),
        textAlign:'center'
    },
    form_error:{
        color:'#fb0603',
        fontSize:hp('2.3%')
    }
})
export default connect(Login);