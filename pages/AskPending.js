import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity,Image,AsyncStorage} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import connect from '../components/connectedcomponent';
class AskPending extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    componentDidMount()
    {
        
    }

    selectlanguage = () => {
       this.props.navigation.navigate('MYDEMAND');
    }

    render()
    {
        return (
            <View style={style.container}>
                <View style={style.flagcontainer}>
                    <View>
                        <View style={{display:'flex'}}>
                            <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage()}>
                                <Image source={require('../assets/imgs/flags/bandera_es.png')} style={style.flagimg}></Image>
                            </TouchableOpacity>    
                        </View>
                        <Text style={style.title}>Su consulta ha sido enviada al transportista.  en breve recibirás tu respuesta</Text>
                    </View>
                    <View style={{marginTop:hp('2%')}}>
                        <View style={{display:'flex'}}>
                            <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage()}>
                                <Image source={require('../assets/imgs/flags/bandera_en.png')} style={style.flagimg}></Image>
                            </TouchableOpacity>    
                        </View>
                        <Text style={style.title}>Your inquiry has been sent to the carrier.  You will receive your answer shortly</Text>
                    </View>
                    <View style={{marginTop:hp('2%')}}>
                        <View style={{display:'flex'}}>
                            <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage()}>
                                <Image source={require('../assets/imgs/flags/bandera_de.png')} style={style.flagimg}></Image>
                            </TouchableOpacity>    
                        </View>
                        <Text style={style.title}>Ihre Anfrage wurde an den Spediteur gesendet.  Sie erhalten Ihre Antwort in Kürze</Text>
                    </View>
                    <View style={{marginTop:hp('2%')}}>
                        <View style={{display:'flex'}}>
                            <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage()}>
                                <Image source={require('../assets/imgs/flags/bandera_fr.png')} style={style.flagimg}></Image>
                            </TouchableOpacity>    
                        </View>
                        <Text style={style.title}>Votre demande a été envoyée au transporteur.  Vous recevrez votre réponse sous peu</Text>
                    </View>
                    <View style={{marginTop:hp('2%')}}>
                        <View style={{display:'flex'}}>
                            <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage()}>
                                <Image source={require('../assets/imgs/flags/bandera_nl.png')} style={style.flagimg}></Image>
                            </TouchableOpacity>    
                        </View> 
                        <Text style={style.title}>Uw aanvraag is verzonden naar de vervoerder.   U ontvangt binnenkort uw antwoord</Text>
                    </View>
                    <View style={{marginTop:hp('2%')}}>
                        <View style={{display:'flex'}}>
                            <TouchableOpacity style={style.flagitem} onPress={()=>this.selectlanguage()}>
                                <Image source={require('../assets/imgs/flags/bandera_it.png')} style={style.flagimg}></Image>
                            </TouchableOpacity>    
                        </View>    
                        <Text style={style.title}>La tua richiesta è stata inviata al corriere.  Riceverai la tua risposta a breve</Text>
                    </View>
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
        fontWeight:'bold',
        marginTop:hp('2%')
    },
    flagcontainer:{
        justifyContent:'center',
        marginTop:hp('7%')
    },
    flagitem:{
        width:hp('5.5%'),
        height:hp('5.5%'),
        margin:'auto',
        alignSelf:'center'
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

export default connect(AskPending);