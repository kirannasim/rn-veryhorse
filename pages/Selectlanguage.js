import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity,Image,AsyncStorage} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import connect from '../components/connectedcomponent';
class SelectLanguage extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    componentDidMount()
    {
        
    }

    selectlanguage = (lang) => {
        AsyncStorage.setItem("lang",lang);
        const {updateLanguage} = this.props;
        updateLanguage(lang);
        this.props.navigation.navigate("Intro");
    }

    render()
    {
        return (
            <View style={style.container}>
                <Text style={style.titlecontainer}>Seleccione idioma</Text>
                <Text style={style.title}>Select Language</Text>
                <View style={style.flagcontainer}>
                    <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage("es")}>
                        <Image source={require('../assets/imgs/flags/bandera_es.png')} style={style.flagimg}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage("en")}>
                        <Image source={require('../assets/imgs/flags/bandera_en.png')} style={style.flagimg}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.flagitemlast} onPress={()=>this.selectlanguage("de")}>
                        <Image source={require('../assets/imgs/flags/bandera_de.png')} style={style.flagimg}></Image>
                    </TouchableOpacity>
                </View>
                <View style={style.flagcontainer}>
                    <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage("fr")}>
                        <Image source={require('../assets/imgs/flags/bandera_fr.png')} style={style.flagimg}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage("nl")}>
                        <Image source={require('../assets/imgs/flags/bandera_nl.png')} style={style.flagimg}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.flagitemlast} onPress={()=>this.selectlanguage("it")}>
                        <Image source={require('../assets/imgs/flags/bandera_it.png')} style={style.flagimg}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#b6a740'
    },
    titlecontainer:{
        marginTop:hp('26%'),
        color:"white",
        fontWeight:'bold',
        fontSize:hp('2.3%'),
        textAlign:'center'
    },
    title:{
        color:"white",
        fontSize:hp('2.3%'),
        textAlign:'center',
        fontWeight:'bold'
    },
    flagcontainer:{
        flexDirection:'row',
        justifyContent:'center',
        marginTop:hp('3%')
    },
    flagitem:{
        width:hp('5.5%'),
        height:hp('5.5%'),
        marginRight:wp('5%')
    },
    flagimg:{
        width:hp('5.5%'),
        height:hp('5.5%'),
        borderRadius:hp('2.45%')
    },
    flagitemlast:{
        width:hp('5.5%'),
        height:hp('5.5%')
    }
})

export default connect(SelectLanguage);