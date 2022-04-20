import React from 'react';
import {View,StyleSheet,Image,TextInput,TouchableOpacity,Text} from 'react-native';
import connect from '../components/connectedcomponent';
import PageContainer from '../components/PageContainer';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import UserService from '../service/userservice';

class ForgotPassword extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            email:"",
            sending:false,
            contact:false
        }
    }

    handleChange = (input) => {
        this.setState({
            email:input
        })
    }

    forgotpassword = () => {
        let userservice = new UserService();
        let self = this;
        if(!this.state.sending)
        {
            this.setState({
                sending:true
            });
            
            userservice.forgotpassword(this.state.email).then(res=>{
                self.setState({
                    sending:false,
                    contact:true
                })
            }).catch(err=>this.setState({
                sending:false
            }))
        }
        
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} bannerenable = {true} backenable={true} title={intlData.messages['RECUPERAR_CONTRASENA']}>
                <View style={style.container}>
                    <Text style={style.text}>{intlData.messages['INDICAR_EMAIL_REINICIO_CONTRASENA']}</Text>
                    <View style={style.form}>
                        <View style={style.formgroup}>
                            <View style={style.formgroup}>
                                <Text style={style.label}>Email</Text>
                                <TextInput style={style.input} onChangeText={(text)=>this.handleChange(text)} defaultValue={this.state.email}></TextInput>
                            </View>
                            <View style={style.formgroup}>
                                <TouchableOpacity style={style.forgot_btncontainer} onPress={this.forgotpassword}>
                                    <Text style={style.forgotbtn_text}>{intlData.messages['RECUPERAR']}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {
                    this.state.contact && (
                        <View style={style.formgroup}>
                            <Text style={style.label}>{intlData.messages['ENVIO_EMAIL_RECUPERAR_CONTRASENA']}</Text>
                        </View>
                    )
                }
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        marginTop:hp('2%'),
        paddingLeft:wp('5%'),
        paddingRight:wp('5%')
    },
    text:{
        fontSize:hp('2.2%'),
        color:'white'
    },
    form:{
        paddingLeft:wp('10%'),
        paddingRight:wp('10%')
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
    forgot_btncontainer:{
        paddingTop:hp('1%'),
        paddingBottom:hp('1%'),
        backgroundColor:'#dd691b',
        justifyContent:'center',
        borderRadius:5,
        marginTop:hp('2%')
    },
    forgotbtn_text:{
        color:'white',
        fontSize:hp('2%'),
        textAlign:'center'
    },
})
export default connect(ForgotPassword);