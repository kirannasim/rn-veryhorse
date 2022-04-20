import React from 'react';
import {View,StyleSheet,Text,TextInput,Picker} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-material-dropdown';
import connect from '../connectedcomponent';
import DataService from '../../service/dataservice';

class Step1 extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            languages:[]
        }
    }

    componentDidMount()
    {
        let dataservice = new DataService();
        let self  = this;
        dataservice.getlanguages().then(res=>{
            self.setState({
                languages:res
            })
        })  
    }
    render()
    {
        const {intlData} = this.props;
        let type = this.props.user.type;
        return (
            <View style={style.form}>
                <View style={style.formgroup}>
                    <Text style={style.label}>{this.props.user.type == 'user'?intlData.messages['NOMBRE']:intlData.messages['NOMBRE_E']} * </Text>
                    <TextInput style={style.input} defaultValue={this.props.user[type=='user'?'name':'name_empresa']} onChangeText={(text)=>this.props.handleChange(type == 'user'?"name":"name_empresa",text)}></TextInput>
                    {
                        this.props.error[type=='user'?"name":"name_empresa"] != undefined && (
                            <Text style={style.form_error}>{this.props.error[type=='user'?"name":"name_empresa"]}</Text>
                        )
                    }
                    
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{type=='user'?intlData.messages['APELLIDO']:'CIF/NIF'} * </Text>
                    <TextInput style={style.input} onChangeText={(text)=>this.props.handleChange(type=='user'?"lastname":"numero_identificacion",text)} defaultValue={this.props.user[type == 'user'?'lastname':'numero_identificacion']}></TextInput>
                    {
                        this.props.error[type=='user'?"lastname":"numero_identificacion"] != undefined && (
                            <Text style={style.form_error}>{this.props.error[type=='user'?"lastname":"numero_identificacion"]}</Text>
                        )
                    }
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['IDIOMA']} * </Text>
                    <View style={style.containerStyle}>
                        <Picker mode="dropdown" style={{flex:1}} onValueChange={(itemvalue)=>this.props.handleChange("idioma",itemvalue)} selectedValue={this.props.user.idioma}>
                            <Picker.Item style={style.containerStyle} value="" label={intlData.messages["IDIOMA"]}></Picker.Item>
                            {
                                this.state.languages.map((row,index)=>{
                                    return (
                                        <Picker.Item key={index} value={row.code} label={row.name}></Picker.Item>
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    {
                        this.props.error.idioma != undefined && (
                            <Text style={style.form_error}>{this.props.error.idioma}</Text>
                        )
                    }
                </View>
                    
            </View>
        )
    }
}

const style = StyleSheet.create({
    form:{
        flex:1
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
    formgroup:{
        marginBottom:hp('2%')
    },
    containerStyle:{
        backgroundColor:'white',
        borderRadius:10,
        paddingLeft:wp('3%'),
        flex:1,
        justifyContent:'center'
    },
    form_error:{
        color:'#fb0603',
        fontSize:hp('2.3%')
    }
})
export default Step1;
