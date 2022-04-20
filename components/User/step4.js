import React from 'react';
import {View,StyleSheet,Text,TextInput,Picker} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-material-dropdown';

import DataService from '../../service/dataservice';

import connect from '../connectedcomponent';

import Multiple from 'react-native-multiple-select';
class Step4 extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            languages:[],
            countries:[],
            selecteditems:[]
        }
    }

    componentDidMount()
    {
        let dataservice = new DataService();
        dataservice.getcountries().then(country=>{
            this.setState({
                countries:country
            })
        })
    }

    selectchange = (value) => {
        this.setState({
            selecteditems:value
        })
        
        console.log(value);
        let namearray = [];
        for(let item in value)
        {
            namearray.push(value[item].nombre);
        }
        this.props.handleChange("interestedCountries",value);
    }

    render()
    {
        const {intlData} = this.props;
        let type = this.props.user.type;
        
        return (
            <View style={style.form}>
                {
                    type == 'transportista' && (
                        <View style={style.formgroup}>
                            <Multiple styleSelectorContainer={style.input} hideTags uniqueKey="iso2" displayKey="nombre" tagRemoveIconColor="white" items={this.state.countries} selectedItems={this.state.selecteditems} onSelectedItemsChange={this.selectchange}></Multiple>
                        </View>
                        
                    )
                }
                <View style={style.formgroup}>
                    <Text style={style.label}>Email * </Text>
                    <TextInput style={style.input} onChangeText={(text)=>this.props.handleChange("email",text)} value={this.props.user.email}></TextInput>
                    {
                        this.props.error.email != undefined && (
                            <Text style={style.form_error}>{this.props.error.email}</Text>
                        )
                    }
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['CONFIRMAR_EMAIL']} * </Text>
                    <TextInput style={style.input} onChangeText={(text)=>this.props.handleChange("confirmEmail",text)} value={this.props.user.confirmEmail}></TextInput>
                    {
                        this.props.error.confirmEmail != undefined && (
                            <Text style={style.form_error}>{this.props.error.confirmEmail}</Text>
                        )
                    }
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['CONTRASENA']} * </Text>
                    <View style={style.containerStyle}>
                        <TextInput style={style.input} secureTextEntry={true} onChangeText={(text)=>this.props.handleChange("password",text)}></TextInput>
                    </View>
                    {
                        this.props.error.password != undefined && (
                            <Text style={style.form_error}>{this.props.error.password}</Text>
                        )
                    }
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['CONFIRMAR2']} * </Text>
                    <View style={style.containerStyle}>
                        <TextInput style={style.input} secureTextEntry={true} onChangeText={(text)=>this.props.handleChange("confirmPassword",text)}></TextInput>
                    </View>
                    {
                        this.props.error.confirmPassword != undefined && (
                            <Text style={style.form_error}>{this.props.error.confirmPassword}</Text>
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
        fontSize:hp('2.3%'),
        textAlign:'center',
        marginTop:hp('1%')
    }
})
export default Step4;
