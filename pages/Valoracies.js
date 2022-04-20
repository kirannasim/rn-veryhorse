import React from 'react';
import {View,StyleSheet,TouchableOpacity,Text,AsyncStorage} from 'react-native';
import connect from '../components/connectedcomponent';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PageContainer from '../components/PageContainer';
import DataService from '../service/dataservice';

class Valoracies extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data:[],
            tab:"pending"
        }
    }

    getinformation = () => {
        let service = new DataService();
        let self = this;
        AsyncStorage.getItem("user").then(user=>{
            user = JSON.parse(user);
            console.log(user.uid);
            if(user.uid)
            {
                service.getreview(user.uid).then(result=>{
                    self.setState({
                        data:result
                    })
                })
            }
        })
    }  

    
    componentDidMount()
    {
        this.getinformation();
    }

    componentWillReceiveProps()
    {
        this.getinformation();    
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} bannerenable={true} title={intlData.messages['VALORACIONES_PEN']}>
                <View style={style.container}>
                    <View style={{flex:1}}>
                        {
                            this.state.data.map((row,index)=>{
                                return (
                                    <TouchableOpacity key={index} style={style.contentitem} onPress={()=>this.props.navigation.navigate('REVIEWITEM',{id:row.id})}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text>{row.transName} - {row.demandName}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        {
                            this.state.data.length == 0 && (
                                <TouchableOpacity style={style.contentitem}>
                                    <Text style={{textAlign:'center'}}>{intlData.messages['NO_VALOR']}</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        marginTop:hp('2%'),
        marginBottom:hp('2%')
    },
    contentitem:{
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        paddingLeft:wp('2%'),
        backgroundColor:'white',
        marginBottom:1
    }
})

export default connect(Valoracies);