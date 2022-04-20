import React from 'react';
import {View,StyleSheet,Image,Dimensions,Text} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PageContainer from '../components/PageContainer';
import PageService from '../service/service';
import HTML from 'react-native-render-html';
import AutoHeightImage from 'react-native-auto-height-image';
import Spinner from 'react-native-loading-spinner-overlay';
import connect from '../components/connectedcomponent';
class Introitem extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            banner:null,
            data:{},
            spinner:true
        }
    }

    componentDidMount()
    {
        let introid = this.props.navigation.state.params.introid;
        var pageservice = new PageService();
        let self = this;
        pageservice.getintroitem(introid).then(data=>{
            console.log(data);
            self.setState({
                data:data,
                spinner:false
            })
        })
        
    }

    alerternode = (node) => {
        const { name, parent } = node;
        if (name === 'img') {
            let attributes = {};
            attributes.style = "min-width:100%";
            attributes.src = node.attribs.src;
            node.attribs = attributes;
            console.log(node);
            return node;
        }
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <View style={{flex:1}}>
                <Spinner visible={this.state.spinner} textContent={'Loading ....'} textStyle={{color:'white'}}></Spinner>
                <PageContainer {...this.props} bannerenable={true} title={this.state.data.title?this.state.data.title[intlData.locale]:""} backenable={true}>
                    <View style={style.contentitem}>
                        <View style={{flex:1}}>
                            <AutoHeightImage source={{uri:this.state.data.picture}} style={{flex:1}} width={wp('94%')}></AutoHeightImage>
                        </View>
                        <View>
                            <Text style={style.contenttitle}>{this.state.data.title?this.state.data.title[intlData.locale]:""}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <HTML html={this.state.data.content?this.state.data.content[intlData.locale]:''} tagsStyles={{p:style.p_style,em:style.em_style,h5:style.h5_style}} imagesMaxWidth={wp('85%')} alterNode={this.alerternode}></HTML>
                        </View>
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
        paddingLeft:wp('3%'),
        flex:1,
        paddingRight:wp('3%'),
        marginTop:hp('3%'),
        paddingBottom:hp('4%')
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
    },
    p_style:{
        color:'white',
        fontSize:hp('2.1%')
    },
    img_style:{
        width:wp('83%')
    },
    em_style:{
        fontSize:hp('2.3%'),
        fontStyle:'normal'
    },
    h5_style:{
        fontSize:hp('2%')
    }
})

export default connect(Introitem);