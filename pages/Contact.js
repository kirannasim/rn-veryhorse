import React from 'react';
import {View,Text,StyleSheet,ImageBackground,TextInput,TouchableOpacity,KeyboardAvoidingView} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PageContainer from '../components/PageContainer';
import PageService from '../service/service';
import connect from '../components/connectedcomponent';
class Contact extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data:{
                nombre:"",
                telefono:"",
                asunto:"",
                explicacion:""
            },
            error:false,
            sended:false
        }
    }

    sendcontactinfo = () => {
        const {intlData} = this.props;
        let service = new PageService();
        if(this.validate())
        {
            let data = this.state.data;
            let self = this;
            service.sendcontactinfo(data,intlData.locale,function(){
                self.setState({
                    sended:true
                })
            })
        }
        else
        {
            this.setState({
                error:true
            })
        }
    }

    validate = () => {
        for(let item in this.state.data)
        {
            if(!this.state.data[item])
            {
                return false;
            }
        }

        return true;
    }

    handleChange = (text,name) => {
        let data = this.state.data;
        data[name] = text;
        this.setState({
            data:data,
            error:false
        })
    }


    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props}>
                <View style={style.container}>
                    <ImageBackground style={style.imgicon} source={require('../assets/imgs/icons/Contact.png')}></ImageBackground>
                    <View style={style.contactcontent}>
                        <Text style={style.contacttitle}>{intlData.messages['ATENCION_USUARIO']}</Text>
                        <Text style={style.telephone}>+34 696 596 344</Text>
                        <View style={style.contentdescription}>
                            <Text style={style.contacttitle}>{intlData.messages['DIRECCION_MAYUSCULA']}</Text>
                            <Text style={style.description}>LOGISTICA ECUESTRE</Text>
                            <Text style={style.description}>B16506859</Text>
                            <Text style={style.description}>{intlData.messages['SEDE']} : Antoni Mulet, 21. 07015</Text>
                            <Text style={style.description}>Palma de Mallorca - Spain</Text>
                        </View>
                        {
                            !this.state.sended && (
                                <View style={{marginTop:hp('1%')}}>
                                    <Text style={style.description}>{intlData.messages['RELLENE2']}</Text>
                                    <View style={style.form}>
                                        <View style={style.formgroup}>
                                            <Text style={style.label}>{intlData.messages['NOMBRE']}</Text>
                                            <TextInput style={style.input} defaultValue={this.state.data.nombre} onChangeText={(text)=>this.handleChange(text,"nombre")}></TextInput>
                                        </View>
                                        <View style={style.formgroup}>
                                            <Text style={style.label}>{intlData.messages['TELEFONO_M']}</Text>
                                            <TextInput style={style.input} defaultValue={this.state.data.telefono} onChangeText={(text)=>this.handleChange(text,"telefono")}></TextInput>
                                        </View>
                                        <View style={style.formgroup}>
                                            <Text style={style.label}>{intlData.messages['ASUNTO']}</Text>
                                            <TextInput style={style.input} defaultValue={this.state.data.asunto} onChangeText={(text)=>this.handleChange(text,"asunto")}></TextInput>
                                        </View>
                                        <View style={style.formgroup}>
                                            <Text style={style.label}>{intlData.messages['EXPLICAR']}</Text>
                                            <TextInput style={style.input} multiline={true} defaultValue={this.state.data.explicacion} onChangeText={(text)=>this.handleChange(text,"explicacion")}></TextInput>
                                        </View>
                                        {
                                            this.state.error && (
                                                <View style={style.formgroup}>
                                                    <Text style={style.errortext}>{intlData.messages['OBLIGATORIO2']}</Text>
                                                </View>
                                            )
                                        }
                                        <TouchableOpacity style={style.send_btn} onPress={this.sendcontactinfo}>
                                            <Text style={style.sendtext}>{intlData.messages['ENVIAR2']}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                        {
                            this.state.sended && (
                                <View style={style.form}>
                                    <Text style={style.description}>{intlData.messages['MENSAJE_ENVIADO_EXITOSAMENTE']}</Text>
                                </View>
                            )
                        }
                        
                    </View>
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        marginTop:hp('2%'),
        flexDirection:'row',
        paddingLeft:wp('5%'),
        paddingRight:wp('1%'),
        paddingBottom:hp('5%')
    },
    imgicon:{
        width:hp('6%'),
        height:hp('6%'),
        justifyContent:'center',
        alignItems:'center'
    },
    imgtext:{
        fontSize:hp('2.5%'),
        fontWeight:'bold',
        color:'white'
    },
    contactcontent:{
        paddingLeft:wp('2%'),
        paddingRight:wp('5%'),
        flex:1
    },
    contacttitle:{
        fontSize:hp('2.5%'),
        textTransform:'uppercase',
        color:'#605e00',
        fontWeight:'bold'
    },
    telephone:{
        color:'white',
        marginTop:hp('2%'),
        fontSize:hp('2.5%')
    },
    contentdescription:{
        marginTop:hp('2%')
    },
    description:{
        color:'white',
        fontSize:hp('2.5%')
    },
    form:{
        marginTop:hp('2%')
    },
    formgroup:{
        marginBottom:hp('1%')
    },
    label:{
        fontSize:hp('2.5%')
    },
    input:{
        borderRadius:10,
        backgroundColor:'white',
        padding:5,
        paddingLeft:20
    },
    send_btn:{
        backgroundColor:'#dd691b',
        width:wp('15%'),
        height:hp('5%'),
        justifyContent:'center',
        alignItems:'center',
        borderRadius:hp('1%')
    },
    sendtext:{
        color:'white',
        fontSize:hp('2%')
    },
    errortext:{
        color:'red',
        fontSize:hp('2%')
    },
    phone:{
        color:'#605e00',
        fontSize:hp('2%'),
        textDecorationLine:'underline',
        fontWeight:'bold'
    }
})

export default connect(Contact);