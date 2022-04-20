import React from 'react';
import {View,StyleSheet,Text,TextInput,Picker} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-material-dropdown';
import connect from '../connectedcomponent';
import DataService from '../../service/dataservice';

class Step3 extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            countries:[]
        }
    }

    componentDidMount()
    {
        let dataservice = new DataService();
        let self  = this;
        dataservice.getcountries().then(countries=>{
            countries.sort(function(a,b){
                return a.phone_code > b.phone_code?-1:1;
            })

            self.setState({
                countries:countries
            })
        })  
    }
    render()
    {
        const {intlData} = this.props;
        return (
            <View style={style.form}>
                <View style={style.formgroup}>
                    <View style={style.formcontainer}>
                        <View style={style.left}>
                            <Text style={style.label}>{intlData.messages['PREFIJO']}</Text>
                            <View style={style.containerStyle}>
                                <Picker mode="dropdown" style={{flex:1}} selectedValue={this.props.user.prefixFix} onValueChange={(value)=>this.props.handleChange("prefixFix",value)}>
                                    <Picker.Item style={style.containerStyle} value="" label={intlData.messages["PREFIJO"]}></Picker.Item>
                                    {
                                        this.state.countries.map((row,index)=>{
                                            return (
                                                <Picker.Item key={index} value={'+ ' + row.phone_code} label={'+ ' + row.phone_code}></Picker.Item>
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={style.right}>
                            <Text style={style.label}>{intlData.messages['TELEFONO_F']}</Text> 
                            <TextInput keyboardType="numeric" style={style.input} value={this.props.user.phoneFix} onChangeText={(number)=>this.props.handleChange("phoneFix",number)}></TextInput>
                        </View>
                    </View>
                    {
                        this.props.error.phoneFix != undefined && (
                            <Text style={style.form_error}>{this.props.error.phoneFix}</Text>
                        )
                    }
                </View>
                <View style={style.formgroup}>
                    <View style={style.formcontainer}>
                        <View style={style.left}>
                            <Text style={style.label}>{intlData.messages["PREFIJO"]}</Text>
                            <View style={style.containerStyle}>
                                <Picker mode="dropdown" style={{flex:1}} selectedValue={this.props.user.prefixMob} onValueChange={(value)=>this.props.handleChange("prefixMob",value)}>
                                    <Picker.Item style={style.containerStyle} value="" label={intlData.messages["PREFIJO"]}></Picker.Item>
                                    {
                                        this.state.countries.map((row,index)=>{
                                            return (
                                                <Picker.Item key={index} value={'+ ' + row.phone_code} label={'+ ' + row.phone_code}></Picker.Item>
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                        <View style={style.right}>
                            <Text style={style.label}>{intlData.messages['TELEFONO_M']}</Text> 
                            <TextInput keyboardType="numeric" style={style.input} value={this.props.user.phoneMob} onChangeText={(text)=>this.props.handleChange("phoneMob",text)}></TextInput>
                        </View>
                    </View>
                    {
                        this.props.error.phoneMob != undefined && (
                            <Text style={style.form_error}>{this.props.error.phoneMob}</Text>
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
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
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
    formcontainer:{
        flexDirection:'row'
    },
    left:{
        flex:2,
        marginRight:wp('3%')
    },
    right:{
        flex:3
    },
    form_error:{
        color:'#fb0603',
        fontSize:hp('2.3%'),
        textAlign:'center',
        marginTop:hp('1%')
    }
})
export default Step3;
