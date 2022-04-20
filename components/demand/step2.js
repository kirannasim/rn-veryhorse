import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';

class Step2 extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    changemod = (mode) => {
        this.props.handleChange(this.props.param1,mode);
        this.props.nextstep();
    }
    
    render()
    {
        const {intlData} = this.props;
        return (
            <View style={style.form}>
                <Text style={style.title}>
                    {intlData.messages['FECHA_R']}
                </Text>
                <Text style={style.description}>{intlData.messages['ESCOJA']}</Text>
                <View style={style.formcontainer}>
                    <View style={style.formgroup}>
                        <TouchableOpacity style={style.btn} onPress={()=>this.changemod("before")}>
                            <Text style={style.btntext}>{intlData.messages['ANTES_DIA']} ...</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.formgroup}>
                        <TouchableOpacity style={style.btn} onPress={()=>this.changemod("between")}>
                            <Text style={style.btntext}>{intlData.messages['ENTRE']}... {intlData.messages['Y_EL']}...</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.formgroup}>
                        <TouchableOpacity style={style.btn} onPress={()=>this.changemod("day")}>
                            <Text style={style.btntext}>{intlData.messages['EL_DIA']}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.formgroup}>
                        <TouchableOpacity style={style.btn} onPress={()=>this.changemod("after")}>
                            <Text style={style.btntext}>{intlData.messages['DESPUES']}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    form:{
        flex:1
    },
    title:{
        fontSize:hp('2.3%'),
        color:'#605e00',
        fontWeight:'700',
        paddingBottom:hp('0.5%')
    },
    description:{
        color:'white',
        fontSize:hp('2%')
    },
    formcontainer:{
        paddingLeft:wp('3%'),
        paddingRight:wp('3%')
    },  
    formgroup:{
        marginTop:hp('2%')
    },  
    btn:{
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        backgroundColor:'#dd691b',
        justifyContent:'center',
        borderRadius:5
    },
    btntext:{
        color:'white',
        fontSize:hp('2%'),
        textAlign:'center'
    }
})
export default Step2;