import React from 'react';
import {View,StyleSheet,ImageBackground,Text,TouchableOpacity} from 'react-native';
import connect from '../components/connectedcomponent';
import PageContainer from '../components/PageContainer';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
class RegisterMain extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const {intlData} = this.props; 
        return (
            <PageContainer {...this.props} backenable={true} title={intlData.messages['REGISTRO_G']}>
                <View style={style.container}>
                    <TouchableOpacity style={style.button} onPress={()=>this.props.navigation.navigate("UserRegister",{type:'user'})}>
                        <ImageBackground style={{width:'100%',height:'100%'}} source={require('../assets/imgs/icons/owner.png')}>
                            <Text style={style.text}>{intlData.messages['OWNER']}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button} onPress={()=>this.props.navigation.navigate('CarrierRegisrer',{type:'carrier'})}>
                        <ImageBackground style={{width:'100%',height:'100%'}} source={require('../assets/imgs/icons/carrier.png')}>
                            <Text style={style.text}>{intlData.messages['TRASPORTISTA']}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:hp('15%'),
        flexDirection:'row',
        justifyContent:'center'
    },
    button:{
        width:hp('18%'),
        height:hp('18%'),
        margin:wp('4%'),
        justifyContent:'center'
    },
    text:{
        color:'white',
        marginTop:hp('11%'),
        alignSelf:'center',
        fontSize:hp('1.9%'),
        width:hp('16%'),
        textAlign:'center'
    }
});
export default connect(RegisterMain);