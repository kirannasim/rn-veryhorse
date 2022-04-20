import React from 'react';
import {View,StyleSheet,Image,TextInput,TouchableOpacity,Text, AsyncStorage} from 'react-native';
import connect from '../components/connectedcomponent';
import PageContainer from '../components/PageContainer';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import UserService from '../service/userservice';
import {Step1,Step2,Step3,Step4} from '../components/User';
import CheckBox from 'react-native-check-box';
import * as Util from '../service/Util';
class RegisterForm extends React.Component
{
    
    constructor(props)
    {
        super(props);
        this.state = {
            user:{
                type            :"user",
                name      		: "",
				lastname  		: "",
				age       		: "",
				idioma			: props.intlData.locale | "es",
				 
				address   		: "",
				town      		: "",
				cp        		: "",
				country   		: "0",
				 
				prefixFix 		: "",
				phoneFix  		: "",
				prefixMob 		: "",
				phoneMob  		: "",
				 
				email     		: "",
				confirmEmail	: "",
				password  		: "",
				confirmPassword : "",
				tos 			: false
            },        
            error:{

            },
            step:0,
            creatinguser:false
        }
    }

    nextstep = () => {
        const {intlData,updateLanguage} = this.props;
        if(this.validate(this.state.step) && !this.state.creatinguser)
        {
            if(this.state.step == 3)
            {
                let userservice = new UserService();    
                this.setState({
                    creatinguser:true
                });
                let self = this;
                userservice.registeruser(this.state.user,function(data){
                    if(data.success)
                    {
                        alert(intlData.messages['REGISTRO_E']);
                        self.props.navigation.navigate('Intro');
                        AsyncStorage.setItem("lang",self.state.user.idioma);
                        updateLanguage(self.state.user.idioma);
                        self.setState({
                            creatinguser:false
                        })
                    }
                    else
                    {
                        self.setState({
                            creatinguser:false
                        })
                        alert(data.error);
                    }
                                       
                })
            }
            
            let step = Math.min(this.state.step + 1,3);

            this.setState({
                step:step
            })
        }   
        
    }

    validate = async(step) => {
        let error = {};
        let user = this.state.user;
        let enable = true;
        const {intlData} = this.props;

        for(let item in user)
        {
            switch(step)
            {
                case 0:
                    if(["name","lastname","idioma"].indexOf(item) > -1)
                    {
                        if(!user[item])
                        {
                            error[item] = intlData.messages['OBLIGATORIO'];
                            enable = false;
                        }
                    }
                    break;
                case 1:
                    if(["address","town","cp","country"].indexOf(item) > -1)
                    {
                        if(!user[item])
                        {
                            error[item] = intlData.messages['OBLIGATORIO'];
                            enable = false;
                        }
                    }
                    break;
                case 2:
                    if(!user[item])
                    {
                        switch(item)
                        {
                            case 'prefixFix':
                            case 'phoneFix':
                                error.phoneFix = intlData.messages['OBLIGATORIO'];
                                enable = false;
                                break;
                            case 'prefixMob':
                            case 'phoneMob':
                                error.phoneMob = intlData.messages['OBLIGATORIO'];
                                enable = false;
                                break;
                        }
                    }
                    else if(item == 'phoneFix' || item == 'phoneMob')
                    {
                        if(await this.phoneexist(user[item],item))
                        {
                            error[item] = intlData.messages['YA_EXISTE']; 
                            enable = false;
                        }
                    }
                    break;

                case 3:
                    if(!user[item])
                    {
                        if(['email','confirmEmail','password','confirmPassword'].indexOf(item) > -1)
                        {
                            error[item] = intlData.messages['OBLIGATORIO'];
                            enable = false;
                        }
                        else if(item == 'tos')
                        {
                            error[item] = intlData.messages['ACEPTAR_CONDICIONES'];
                            enable = false;
                        }
                    }
                    else
                    {
                        if(item == 'email' || item == 'confirmEmail')
                        {
                            if(!Util.email_validate(user[item]))
                            {
                                error[item] = intlData.messages['OBLIGATORIO'];
                                enable = false;
                            }
                            else if(user['email'] != user['confirmEmail'])
                            {
                                error.confirmEmail = intlData.messages['EMAIL_NO_COINCIDEN'];
                                enable = false;
                            }
                        }
                        else if(item == 'password')
                        {
                            if(user.password != user.confirmPassword)
                            {
                                error.confirmPassword = intlData.messages['CONTRASENA_CAMBIADA_EXITO'];
                                enable = false;
                            }
                        }
                    }
            }
        }

        this.setState({
            error:error
        })
        return enable;
    }

    phoneexist = async(phone,type) => {
        let userservice = new UserService();
        let enable = await userservice.phoneexist(phone,type);
        return enable;
    }

    prev = () => {
        let step = Math.max(this.state.step - 1,0);
        this.setState({
            step:step
        })
    }

    handleChange = (name,value) => {
        let user = this.state.user;
        user[name] = value;

        this.setState({
            user:user
        })

    }

    acceptlicense = () => {
        let user = this.state.user;
        user.tos = !user.tos;
        this.setState({
            user:user
        })
    }

    righttext = () => {
        const {intlData} = this.props;
        return (
            <Text style={{marginLeft:wp('2%'),alignItems:'center'}}>
                <Text style={style.acceptbefore}>
                    {intlData.messages['LEIDO']}
                </Text>
                <Text style={style.acceptafter}> {intlData.messages['CONDICIONES_GENERAL_CONTRATACION']}</Text>
            </Text>
        )
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} title={intlData.messages["REGISTRO_U"]} backenable={true} backfunction={this.state.step == 0?false:this.prev}>
                <View style={style.container}>
                    {
                        this.state.step == 0 && (
                            <Step1 {...this.props} user={this.state.user} error={this.state.error} handleChange={this.handleChange}></Step1>
                        )
                    }
                    {
                        this.state.step == 1 && (
                            <Step2 {...this.props} user={this.state.user}  error={this.state.error} handleChange={this.handleChange}></Step2>
                        )
                    }
                    {
                        this.state.step == 2 && (
                            <Step3 {...this.props} user={this.state.user}  error={this.state.error} handleChange={this.handleChange}></Step3>
                        )
                    }
                    {
                        this.state.step == 3 && (
                            <Step4 {...this.props} user={this.state.user}  error={this.state.error} handleChange={this.handleChange}></Step4>
                        )
                    }
                    {
                        this.state.step == 3 && (
                            <View style={style.license_accept}>
                                <CheckBox rightTextView={this.righttext()} onClick={this.acceptlicense} isChecked={this.state.user.tos}></CheckBox>
                            </View>
                        )
                    }
                    {
                        (this.state.step == 3 && this.state.error.tos != undefined) && (
                            <Text style={style.form_error}>{intlData.messages['ACEPTAR_CONDICIONES']}</Text>
                        )
                    }
                    <TouchableOpacity style={style.stepbutton} onPress={this.nextstep}>
                        <Text style={style.stepbuttontext}>{this.state.step != 3?intlData.messages['SIGUIENTE']:intlData.messages['ENVIAR2']}</Text>
                    </TouchableOpacity>                    
                    {
                        this.state.step > 0 && (
                            <TouchableOpacity style={style.backbtn} onPress={this.prev}>
                                <Text style={style.stepbuttontext}>{intlData.messages['ATRAS']}</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingLeft:wp('10%'),
        paddingRight:wp('10%'),
        paddingTop:hp('8%')
    },
    stepbutton:{
        paddingTop:hp('2%'),
        paddingBottom:hp('2%'),
        backgroundColor:'#dd691b',
        justifyContent:'center',
        borderRadius:5,
        marginTop:hp('4%')
    },
    stepbuttontext:{
        color:'white',
        fontSize:hp('2%'),
        textAlign:'center'
    },
    backbtn:{
        paddingTop:hp('2%'),
        paddingBottom:hp('2%'),
        backgroundColor:'#8b7f25',
        justifyContent:'center',
        borderRadius:5,
        marginTop:hp('2%')
    },
    license_accept:{
        marginTop:hp('3%'),
        flex:1,
        paddingLeft:wp('2%'),
        paddingRight:wp('2%')
    },
    acceptbefore:{
        fontSize:hp('2%'),
        color:'white'
    },
    acceptafter:{
        fontSize:hp('2%'),
        color:'#605e00',
        marginLeft:wp('1%')
    },
    form_error:{
        color:'#fb0603',
        fontSize:hp('2.3%'),
        textAlign:'center',
        marginTop:hp('1%')
    }
})
export default connect(RegisterForm);