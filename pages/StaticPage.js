import React from 'react';
import {View,StyleSheet} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PageService from '../service/service';
import HTML from 'react-native-render-html';
import PageContainer from '../components/PageContainer';
import Spinner from 'react-native-loading-spinner-overlay';

class StaticPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            page:{
                title:'',
                descr:''
            },
            load:true
        }
    }

    componentDidMount()
    {
        if(this.props.navigation.state.params && this.props.navigation.state.params.page)
        {
            var pageservice = new PageService();
            let self = this;
            pageservice.getstaticpage(this.props.navigation.state.params.page).then(page=>{
                self.setState({
                    page:page.page,
                    load:false
                })
            })
        }

        
    }

    render()
    {
        return (
            <PageContainer {...this.props} backenable={true} back="Info">
                <Spinner visible={this.state.load} textContent="Loading ..." textStyle={{color:'white'}}></Spinner>
                <View style={style.container}>
                    <View>
                        <HTML baseFontStyle={style.contenttitle} html={this.state.page.title}></HTML>
                    </View>
                    <View>
                        <HTML tagsStyles={{p:style.p_style,a:style.a_style}} html={this.state.page.descr}></HTML>
                    </View>
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingLeft:wp('3%'),
        paddingRight:wp('3%'),
        paddingTop:hp('2%')
    },
    contenttitle:{
        color:'#605e00',
        fontSize:hp('2.4%'),
        fontWeight:'bold',
        marginTop:hp('1.5%')
    },
    p_style:{
        color:'white',
        fontSize:hp('2.2%'),
        marginTop:hp('1%')
    },
    a_style:{
        color:'#605e00',
        fontSize:hp('2.2%'),
        fontWeight:'bold'
    }
})

export default StaticPage;