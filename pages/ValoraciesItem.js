import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity,TextInput,AsyncStorage} from 'react-native';
import PageContainer from '../components/PageContainer';
import DataService from '../service/dataservice';
import connect from '../components/connectedcomponent';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import IonIcons from 'react-native-vector-icons/Ionicons';
class ValoraciesItem extends React.Component
{
    sending = false;
    constructor(props)
    {
        super(props);
        this.state = {
            data:{},
            userval:{
                rating:0
            },
            error:false,
            sended:false
        }
    }

    handleChange = (name,value) => {
        let userval = this.state.userval;
        userval[name] = value;
        this.setState({
            userval:userval
        })
    }

    getinformation = () =>{
        let id = this.props.navigation.state.params.id;
        let dataservice = new DataService();
        let self = this;
        AsyncStorage.getItem("user").then(user=>{
            user = JSON.parse(user);
            dataservice.getreviewitem(user.uid,id).then(data=>{
                self.setState({
                    data:data
                })
            })
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

    send = () => {
        let userval = this.state.userval;
        if(userval.rating == 0 || !userval.desc)
        {
            this.setState({
                error:true
            })
        }
        else if(!this.sending)
        {
            this.sending = true;
            let data = this.state.data;
            let dataservice = new DataService();
            let self = this;
            
            dataservice.addreview(data,userval).then(success=>{
                if(success)
                {
                    self.sending = false;
                    self.setState({
                        sended:true,
                        error:false
                    })
                }
                
            })
        }
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} bannerenable={true}>
                <View style={style.container}>
                    {
                        !this.state.sended && (
                            <View>
                                <Text style={style.title}>{intlData.messages['SERVICIO']} {this.state.data.transName} {intlData.messages['SERVICIO2']}</Text>
                                <Text style={style.title}>{this.state.data.demandName}</Text>
                                <Text style={style.title}>{intlData.messages['SELECCIONE']}</Text>
                                <View style={style.form}>
                                    <View style={style.ratingcontainer}>
                                        {
                                            [0,1,2,3,4].map((row,index)=>{
                                                return (
                                                    <TouchableOpacity key={index} style={{marginRight:wp('1%')}} onPress={()=>this.handleChange("rating",row + 1)}>
                                                        <IonIcons name="md-star" style={row<this.state.userval.rating?style.onicon:style.officon}></IonIcons>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                    <View style={style.formgroup}>
                                        <Text style={style.label}>{intlData.messages['DESCRIPCION']}</Text>
                                        <TextInput style={style.input} multiline={true} numberOfLines={3} value={this.state.userval.desc} onChangeText={(text)=>this.handleChange("desc",text)}></TextInput>
                                        {
                                            this.state.error && (
                                                <Text style={style.formerror}>{intlData.messages['OBLIGATORIO2']}</Text>
                                            )
                                        }
                                    </View>
                                    <TouchableOpacity style={style.btn} onPress={this.send}>
                                        <Text style={style.text}>{intlData.messages['ENVIAR2']}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                    {
                        this.state.sended && (
                            <View>
                                <Text style={style.title}>{intlData.messages['VALORACION2']}</Text>
                                <Text style={style.title}>{intlData.messages['GRACIAS2']}</Text>
                            </View>
                        )
                    }
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        marginTop:hp('2%'),
        paddingLeft:wp('5%'),
        paddingRight:wp('5%')
    },
    title:{
        color:'white',
        fontSize:hp('2.3%'),
        marginTop:hp('1%')
    },
    form:{
        marginTop:hp('3%')
    },
    ratingcontainer:{
        flex:1,
        flexDirection:'row',
        display:'flex'
    },
    ratingstar:{
        width:hp('5%'),
        height:hp('5%'),
        justifyContent:'center'
    },
    onicon:{
        fontSize:hp('4.5%'),
        color:'white',
        marginRight:wp('1%')
    },
    officon:{
        fontSize:hp('4.5%'),
        color:'#605e00',
        marginRight:wp('1%')
    },
    label:{
        fontSize:hp('2.3%'),
        fontWeight:'bold',
        color:'#605e00',
        
    },
    input:{
        backgroundColor:'white',
        borderRadius:5,
        padding:hp('1%'),
        marginTop:hp('1%')
    },
    formgroup:{
        marginTop:hp('2%')
    },
    btn:{
        paddingLeft:wp('2%'),
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        paddingRight:wp('2%'),
        backgroundColor:'#dd691b',
        borderRadius:5,
        display:'flex',
        marginTop:hp('3%')
    },
    text:{
        color:'white',
        fontSize:hp('2.3%'),
        textAlign:'center'
    },
    formerror:{
        color:'#fb0603',
        fontSize:hp('2.3%'),
        textAlign:'center',
        marginTop:hp('1%')
    }
})

export default connect(ValoraciesItem);