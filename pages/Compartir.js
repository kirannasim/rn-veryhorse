import React from 'react';
import {View,Text,StyleSheet,ImageBackground,TextInput,TouchableOpacity,AsyncStorage} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PageContainer from '../components/PageContainer';
import PageService from '../service/service';
import connect from '../components/connectedcomponent';
class Compartir extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data:{
                nombre:"",
                email:"",
                friend:"",
                friendEmail:""
            },
            error:false,
            sended:false
        }
    }

    componentDidMount()
    {
        AsyncStorage.getItem("user").then(user=>{
            if(user)
            {
                user = JSON.parse(user);
                let data = this.state.data;
                data.nombre = user.nombre;
                data.email = user.email;
                this.setState({
                    data:data
                })
            }
        })
    }

    sendcompatiar = () => {
        let service = new PageService();
        const {intlData} = this.props;
        if(this.validate())
        {
            let self = this;
            let data = this.state.data;
            service.sendcompatiar(data,intlData.locale).then(function(){
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
                    <View style={style.contactcontent}>
                        {
                            !this.state.sended && (
                                <View style={style.form}>
                                    <Text style={style.description}>{intlData.messages['RELLENE']}</Text>
                                    <View style={{marginTop:hp('5%'),...style.formgroup}}>
                                        <Text style={style.label}>{intlData.messages['MI']} {intlData.messages['NOMBRE']}</Text>
                                        <TextInput style={style.input} onChangeText={(text)=>this.handleChange(text,"nombre")} value={this.state.data.nombre}></TextInput>
                                    </View> 
                                    <View style={style.formgroup}>
                                        <Text style={style.label}>{intlData.messages['MI']} {intlData.messages['EMAIL']}</Text>
                                        <TextInput style={style.input} onChangeText={(text)=>this.handleChange(text,"email")} value={this.state.data.email}></TextInput>
                                    </View> 
                                    <View style={style.formgroup}>
                                        <Text style={style.label}>{intlData.messages['NOMBRE_MI_AMIGO']}</Text>
                                        <TextInput style={style.input} onChangeText={(text)=>this.handleChange(text,"friend")} value={this.state.data.friend}></TextInput>
                                    </View> 
                                    <View style={style.formgroup}>
                                        <Text style={style.label}>{intlData.messages['EMAIL_MI_AMIGO']}</Text>
                                        <TextInput style={style.input} onChangeText={(text)=>this.handleChange(text,"friendEmail")} value={this.state.data.friendEmail}></TextInput>
                                    </View> 
                                    {
                                        this.state.error && (
                                            <Text style={style.errortext}>{intlData.messages['OBLIGATORIO2']}</Text>
                                        )
                                    }
                                    <View style={{flexDirection:'row',display:'flex',...style.formgroup}}>
                                        <TouchableOpacity style={style.send_btn} onPress={this.sendcompatiar}>
                                            <Text style={style.sendtext}>{intlData.messages['ENVIAR2']}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                        {
                            this.state.sended && (
                                <View style={style.formgroup}>
                                    <Text style={style.description}>{intlData.messages['MENSAJE_ENVIADO_EXITOSAMENTE']}</Text>
                                    <Text style={style.description}>{intlData.messages['GRACIAS']}  Very Horse</Text>
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
        paddingRight:wp('5%'),
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
        fontSize:hp('2.2%')
    },
    form:{
        marginTop:hp('2%')
    },
    formgroup:{
        marginBottom:hp('2%')
    },
    label:{
        fontSize:hp('2.5%'),
        color:'#605e00',
        fontWeight:'bold'
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
        borderRadius:hp('1%'),
        marginLeft:'auto'
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

export default connect(Compartir);