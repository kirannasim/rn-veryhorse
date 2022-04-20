import React from 'react';
import {View,StyleSheet,TouchableOpacity,Text} from 'react-native';
import {heightPercentageToDP as hp,widthPercentageToDP as wp} from 'react-native-responsive-screen';
class Step7 extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const {intlData} = this.props;
        return(
            <View style={style.container}>
                <Text style={style.title}>{intlData.messages['QUE_DESEA_HACER']}</Text>
                <View style={style.formgroup}>
                    <TouchableOpacity style={style.btn_container} onPress={()=>this.props.newdemand()}>
                        <Text style={style.btn}>{intlData.messages['TRASLADO_NEW']}</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.formgroup}>
                    <TouchableOpacity style={style.btn_container} onPress={()=>this.props.navigation.navigate('Intro')}>
                        <Text style={style.btn}>{intlData.messages['VER']}</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.formgroup}>
                    <TouchableOpacity style={style.btn_container} onPress={()=>this.props.navigation.navigate('Compartir')}>
                        <Text style={style.btn}>{intlData.messages['ENVIAR_AMIGO']}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    title:{
        fontSize:hp('2.5%'),
        color:'white',
        textAlign:'center'
    },
    formgroup:{
        marginTop:hp('4%')
    },
    btn_container:{
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        backgroundColor:'#dd691b',
        justifyContent:'center',
        borderRadius:5
    },
    btn:{
        fontSize:hp('2.3%'),
        color:'white',
        textAlign:'center'
    }
})

export default Step7;