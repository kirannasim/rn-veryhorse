import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';

class Step4 extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <View style={style.form}>
                <View style={style.upform}>
                    <View style={style.formgroup}>
                        <Text style={style.label}>{intlData.messages['NUMERO_C2']} *:</Text>
                        <NumericInput style={style.input} rounded={true} valueType="integer" minValue={1} maxValue={99} value={this.props.data.numHorses} onChange={(value)=>this.props.handleChange("numHorses",value)} inputStyle={style.numberinput}></NumericInput>
                        {
                            this.props.error.numHorses != undefined && (
                            <Text style={style.form_error}>{this.props.error.numHorses}</Text>
                            )
                        }
                    </View>
                    <View style={style.formgroup}>
                        <Text style={style.label}>{intlData.messages['MEDICINA']} *:</Text>
                        <TextInput style={style.input} value={this.props.data.specialDesc} onChangeText={(text)=>this.props.handleChange("specialDesc",text)} multiline={true} numberOfLines={5}></TextInput>
                    </View>    
                </View>
                <View style={style.downform}>
                    <Text style={style.label}>{intlData.messages['EQUIPAJE2']}</Text>
                    <View style={style.btncontainer}>
                        <View>
                            <TouchableOpacity style={this.props.data.lugage?style.btn_yes:style.btn_no} onPress={()=>this.props.handleChange('lugage',true)}>
                                <Text style={style.text}>{intlData.messages['SI']}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginLeft:wp('10%')}}>
                            <TouchableOpacity style={this.props.data.lugage?style.btn_no:style.btn_yes} onPress={()=>this.props.handleChange('lugage',false)}>
                                <Text style={style.text}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.props.data.lugage && (
                            <TextInput style={style.input} onChangeText={(text)=>this.props.handleChange("lugageDesc",text)} value={this.props.data.lugageDesc}></TextInput>
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
    formgroup:{
        marginTop:hp('2%')
    },  
    label:{
        fontSize:hp('2.2%'),
        color:'#605e00',
        fontWeight:'700',
        paddingBottom:hp('0.5%')
    },
    numberinput:{
        backgroundColor:'white'
    },
    input:{
        paddingLeft:wp('3%'),
        paddingTop:hp('1%'),
        paddingBottom:hp('1%'),
        backgroundColor:'white',
        borderRadius:5
    },
    form_error:{
        color:'#fb0603',
        fontSize:hp('2.3%')
    },
    upform:{
        flex:1,
        paddingBottom:hp('2%'),
        borderBottomWidth:2,
        borderBottomColor:'#605e00',
    },
    downform:{
        paddingTop:hp('2%'),
        paddingBottom:hp('2%')
    },
    btncontainer:{
        flexDirection:'row',
        marginTop:hp('1%'),
        marginBottom:hp('2%')
    },
    btn_no:{
        width:hp('7%'),
        height:hp('7%'),
        backgroundColor:'#8b7f25',
        justifyContent:'center',
        borderRadius:hp('1%'),       
    },
    text:{
        fontSize:hp('2.5%'),
        color:'white',
        textAlign:'center'
    },
    btn_yes:{
        width:hp('7%'),
        height:hp('7%'),
        backgroundColor:'#dd691b',
        justifyContent:'center',
        borderRadius:hp('1%')
    }
})
export default Step4;