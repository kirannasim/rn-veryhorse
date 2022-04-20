import React from 'react';
import {View,StyleSheet,Image,Dimensions,Text,TouchableOpacity, TouchableWithoutFeedbackBase} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PageContainer from '../components/PageContainer';
import PageService from '../service/service';
import HTML from 'react-native-render-html';
import AutoHeightImage from 'react-native-auto-height-image';
import Spinner from 'react-native-loading-spinner-overlay';
import connect from '../components/connectedcomponent';
class Intro extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            banner:null,
            data:[],
            spinner:true
        }
    }

    componentDidMount()
    {
        var pageservice = new PageService();
        let self = this;
        pageservice.loadrandombanner().then(banner=>{
            self.setState({
                banner:banner
            })
        });

        pageservice.getintroduction().then(data=>{
            self.setState({
                data:data,
                spinner:false
            })
        })
        
    }

    render()
    {
        const {intlData} = this.props;
        
        return (
            <View style={{flex:1}}>
                <Spinner visible={this.state.spinner} textContent={'Loading .... '} textStyle={style.spinnerText}></Spinner>
                <PageContainer {...this.props} bannerenable={true} title={intlData.messages["NOTICIAS"]}>
                    <View style={style.contentitem}>
                        {
                            this.state.data.map((row,index)=>{
                                return (
                                    <TouchableOpacity key={index} style={style.contentitem} onPress={()=>this.props.navigation.navigate("IntroItem",{introid:row.id})}>
                                        <View style={{flex:1}}>
                                            <AutoHeightImage source={{uri:row.picture}} style={{flex:1}} width={wp('85%')}></AutoHeightImage>
                                        </View>
                                        <View>
                                            <Text style={style.contenttitle}>{row.title[intlData.locale]}</Text>
                                        </View>
                                        <View>
                                            <HTML baseFontStyle={{color:'white',fontSize:hp('1.9%'),fontWeight:'bold'}} html={row.excerpt['es']} imagesMaxWidth={Dimensions.get('window').width}></HTML>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </PageContainer>
            </View>
            
        )
    }
}

const style = StyleSheet.create({
    banner:{
        width:wp('100%'),
        height:hp('16%'),
        resizeMode:'stretch'
    },
    spinnerText:{
        color:"#FFF"
    },
    contentitem:{
        marginLeft:wp('3%'),
        flex:1,
        marginRight:wp('3%'),
        marginTop:hp('3%')
    },
    contenttitle:{
        color:'#605e00',
        fontSize:hp('2.4%'),
        fontWeight:'bold',
        marginTop:hp('1.5%')
    },
    readmore:{
        fontSize:hp('2%'),
        color:'#605e00',
        textAlign:'justify'
    }
})

export default connect(Intro);