import React from 'react';
import {View,StyleSheet,TouchableOpacity,Text,Platform} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PageContainer from '../components/PageContainer';
import AppService from '../service/service';
import Modal,{ModalTitle,ModalContent,ModalButton,ModalFooter} from 'react-native-modals';
import connect from '../components/connectedcomponent';
import VersionNumber from 'react-native-version-number';
class Info extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            pages:[],
            version:false
        }
    }  

    componentDidMount()
    {
        const {intlData} = this.props;
        let appservice = new AppService();
        let self = this;

        appservice.getinfo(intlData.locale).then(pages=>{
            self.setState({
                pages:pages
            })
        })
    }

    showpage = (page) => {
        this.props.navigation.navigate('StaticPage',{page:page});
    }

    showversion = () => {
        this.setState({
            version:true
        })
    }
    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer title={intlData.messages['HELP']} {...this.props}>
                <View style={style.pagecontainer}>
                    {
                        this.state.pages.map((row,index) => {
                            return (
                                <TouchableOpacity key={index} style={style.pageitem} onPress={()=>this.showpage(row.name)}>
                                    <TouchableOpacity style={style.doticon}></TouchableOpacity>
                                    <Text style={style.title}>{row.title}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                    <TouchableOpacity style={style.pageitem} onPress={()=>this.props.navigation.navigate('Presentation')}>
                        <TouchableOpacity style={style.doticon}></TouchableOpacity>
                        <Text style={style.title}>{intlData.messages['PRESENTACION']}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.pageitem} onPress={()=>this.showversion()}>
                        <TouchableOpacity style={style.doticon}></TouchableOpacity>
                        <Text style={style.title}>{intlData.messages['APP_VERSION']}</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                     visible={this.state.version} 
                     modalTitle={<ModalTitle title={intlData.messages['APP_VERSION']}></ModalTitle>}
                     footer={<ModalFooter><ModalButton text="OK" onPress={()=>this.setState({version:false})}></ModalButton></ModalFooter>}
                     onTouchOutside={()=>this.setState({version:false})}
                >
                    <ModalContent>
                        <Text>{intlData.messages['APP_VERSION_TEXT']} {VersionNumber.appVersion}</Text>
                    </ModalContent>
                </Modal>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    pagecontainer:{
        marginLeft:wp('2%'),
        marginRight:wp('2%'),
        backgroundColor:'white',
        marginTop:hp('3%'),
        paddingBottom:hp('3%')
    },
    pageitem:{
        flexDirection:'row',
        paddingLeft:wp('2%'),
        marginTop:hp('2%'),
        alignItems:'center'
    },
    doticon:{
        width:hp('2%'),
        height:hp('2%'),
        backgroundColor:'#F7941C',
        marginRight:wp('3%'),
        borderRadius:hp('1%')
    },
    title:{
        fontSize:hp('2.3%')
    }
})

export default connect(Info);