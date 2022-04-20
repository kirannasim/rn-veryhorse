import React from 'react';
import {View,AsyncStorage,Text,StyleSheet,ImageBackground,TouchableOpacity} from 'react-native';
import AppIntro from 'react-native-app-intro-slider';
import HTML from 'react-native-render-html';
import PageContainer from '../components/PageContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import connect from '../components/connectedcomponent';

class Presentation extends AppIntro
{
    constructor(props)
    {
        super(props);
        const {intlData} = this.props;
        this.state = {
            presentation:[{
                key:'slider1',
                title:intlData.messages['TRANSPORTE'],
                text:intlData.messages['TEXTO_TRANSPORTE_CALIDAD'],
                image:require('../assets/imgs/presentation/1.jpg')
            },{
                key:'slider2',
                title:intlData.messages['MEJOR'],
                text: intlData.messages['TEXTO_MEJOR_TRASLADO'],
                image:require('../assets/imgs/presentation/2.jpg')
            },{
                key:'slider3',
                title:intlData.messages['CERTIFICADO_GARANTIA'],
                text:intlData.messages['TEXTO_CERTIFICADO_GARANTIA'],
                image:require('../assets/imgs/presentation/3.jpg')
            },{
                key:'slider4',
                title:intlData.messages['PROFESIONALES'],
                text:intlData.messages['TEXTO_PROFESIONALES_ALCANCE'],
                image:require('../assets/imgs/presentation/4.jpg')
            }],
            user:false
        }
    }

    componentDidMount()
    {
        AsyncStorage.getItem("user").then(user=>{
            if(user)
            {
                this.setState({
                    user:true
                })
            }
        })
    }

    renderNextButton = () => {
        return (
            <View>
                <Ionicons name="ios-arrow-forward" style={style.icontext}></Ionicons>
            </View>
        )
    }
    
    renderPrevButton = () => {
        return (
            <View>
                <Ionicons name="ios-arrow-back" style={style.icontext}></Ionicons>
            </View>
        )
    }

    comenzar = () => {
        if(this.state.user)
        {
            this.props.navigation.navigate('Intro');
        }
        else
        {
            this.props.navigation.navigate('Login');
        }
    }

    renderdonebutton = () => {
        const {intlData} = this.props;
        return (
            <TouchableOpacity style={style.donebuttoncontain} onPress={this.comenzar}>
                <Text style={style.donebutton}>{intlData.messages['COMENZAR']}</Text>
            </TouchableOpacity>
        )
    }

    renderItem = ({item}) => {
        return (
            <View style={style.container}>
                <View style={style.intro_img}>
                    <ImageBackground style={{width:'100%',height:'100%'}} source={item.image}></ImageBackground>
                </View>
                <View style={style.titlecontainer}>
                    <Text style={style.text}>{item.title}</Text>
                </View>
                <View style={style.content}>
                    <HTML html={item.text} tagsStyles={{p:style.p_description}}></HTML>
                </View>
            </View>
        )
    }

    done = () => {

    }
    
    render()
    {
        return (
            <PageContainer {...this.props}>
                <AppIntro 
                    renderItem={this.renderItem} 
                    slides={this.state.presentation} 
                    showPrevButton={true} 
                    renderNextButton={this.renderNextButton} 
                    renderPrevButton={this.renderPrevButton}
                    renderDoneButton={this.renderdonebutton}
                    onDone={this.done}
                ></AppIntro>
            </PageContainer>
        )
        
    }
}

const style = StyleSheet.create({
    container:{
        width:wp('100%'),
        height:hp('93%')
    },
    intro_img:{
        width:wp('100%'),
        height:hp('30%')
    },
    titlecontainer:{
        backgroundColor:'#8b7f25',
        width:wp('100%'),
        padding:wp('2.5%')
    },
    text:{
        textTransform:'uppercase',
        textAlign:'center',
        fontSize:hp('2.5%'),
        color:'white'
    },
    p_description:{
        color:'white',
        fontSize:hp('2.4%'),
        marginTop:hp('1%'),
        textAlign:'center'
    },
    icontext:{
        color:'white',
        fontSize:hp('4%')
    },
    content:{
        marginTop:hp('2%'),
        paddingLeft:wp('3%'),
        paddingRight:wp('3%')
    },
    donebutton:{
        fontSize:hp('2.2%'),
        color:'white'
    },
    donebuttoncontain:{
        padding:5,
        backgroundColor:'#dd691b',
        borderRadius:5
    }
})

export default connect(Presentation);
