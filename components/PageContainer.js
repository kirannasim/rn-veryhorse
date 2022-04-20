import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView, KeyboardAvoidingView,Image,Linking} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PageService from '../service/service';
class PageContainer extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            banner:null
        }
    }

    componentDidMount()
    {
        if(this.props.bannerenable)
        {
            let pageService = new PageService();
            let self = this;
            pageService.loadrandombanner().then(banner=>{
                self.setState({
                    banner:banner
                })
            })
        }
    }

    back = () => {
        if(this.props.backfunction)
        {
            this.props.backfunction();
        }
        else
        {
            this.props.navigation.goBack();
        }
    }
    render()
    {
        return(
            <KeyboardAvoidingView behavior="padding" style={style.container}>
                <View style={this.props.padding?style.containerpadding:style.container}>
                    <View style={style.title}>
                        {
                            this.props.backenable && (
                                <TouchableOpacity style={style.back} onPress={()=>this.back()}>
                                    <Ionicons name="ios-arrow-round-back" style={style.backtext}></Ionicons>
                                </TouchableOpacity>
                            )
                        }
                        <Text style={style.titletext}>{this.props.title}</Text>
                        <TouchableOpacity style={style.naviconcontainer} onPress={()=>this.props.navigation.openDrawer()}>
                            <Ionicons name="md-menu" style={style.navicon}></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={this.props.padding?style.containerpadding:style.container} keyboardShouldPersistTaps="handled">
                        {
                            this.state.banner && (
                                <TouchableOpacity style={style.banner} onPress={()=>Linking.openURL(this.state.banner.link)}>
                                    <Image source={{uri:this.state.banner.image}} style={style.banner}></Image>
                                </TouchableOpacity>
                            )
                        }
                        {this.props.children}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        )
    }
}


const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#b6a740',
        zIndex:0
    },
    containerpadding:{
        flex:1,
        backgroundColor: '#b6a740',
        zIndex:0,
        paddingBottom:hp('4%')
    },
    title:{
        backgroundColor:'#8b7f25',
        borderColor:'#8b7f25',
        flexDirection:'row',
        height:hp('5%'),
        alignItems:'center',
        paddingLeft:wp('2%')
    },
    titletext:{
        color:'white',
        fontSize:hp('2%'),
        fontWeight:'bold'
    },
    naviconcontainer:{
        marginLeft:'auto',
        alignItems:'center'
    },
    navicon:{
        color:'white',
        fontSize:hp('3%'),
        marginRight:wp('2%')
    },
    back:{
        marginLeft:wp('4%'),
        marginRight:wp('4%'),
        alignItems:'center'
    },
    backtext:{
        fontSize:hp('5.5%'),
        fontWeight:'bold',
        color:'white'
    },
    banner:{
        width:wp('100%'),
        height:hp('16%'),
        resizeMode:'stretch'
    }
})

export default PageContainer;
