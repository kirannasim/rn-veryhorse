import React from 'react';
import {View,StyleSheet,Image,Text,TouchableOpacity,AsyncStorage} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import connect from './connectedcomponent';
class Navigator extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            menuitems:[
                {
                    title:'NEW_DEMANDA',
                    icon:require('../assets/imgs/menu/nueva_demanda.png'),
                    navigate:'NEWDEMAND',
                    type:["user"]
                },
                {
                    title:"NewRoute",
                    icon:require('../assets/imgs/menu/nueva_demanda.png'),
                    navigate:'NewRoute',
                    type:["transportista"]
                },
                {
                    title:"MYRoute",
                    icon:require('../assets/imgs/menu/mis_demandas.png'),
                    navigate:'MyRoute',
                    type:["transportista"]
                },
                {
                    title:"Route",
                    icon:require('../assets/imgs/menu/mis_demandas.png'),
                    navigate:'MyRoute',
                    type:["user"]
                },
                {
                    title:'MI_DEMANDA',
                    icon:require('../assets/imgs/menu/mis_demandas.png'),
                    navigate:'MYDEMAND',
                    type:["user"]
                },
                {
                    title:'TRASLADO',
                    icon:require('../assets/imgs/menu/mis_demandas.png'),
                    navigate:'CarrierDeMand',
                    type:["transportista","carrier"]
                },
                {
                    title:'MI_CUENTA',
                    icon:require('../assets/imgs/menu/mi_cuenta.png'),
                    navigate:'MyProfile',
                    type:["user","transportista","carrier"]
                },
                {
                    title:'VALORACION',
                    icon:require('../assets/imgs/menu/valoraciones.png'),
                    navigate:'VALORACIES',
                    type:["user"]
                },
                {
                    title:'LOGIN',
                    icon:require('../assets/imgs/menu/mi_cuenta.png'),
                    navigate:'Login',
                    type:["viewer"]
                },
                {
                    title:'HOTELS',
                    icon:require('../assets/imgs/menu/hotels.png'),
                    navigate:'RouteShop',
                    type:["viewer","user","transportista","carrier"]
                },
                {
                    title:'CONTACTO',
                    icon:require('../assets/imgs/menu/contacto.png'),
                    navigate:'Contact',
                    type:["viewer","user","transportista","carrier"]
                },
                {
                    title:'MENU_ME',
                    icon:require('../assets/imgs/menu/noticias.png'),
                    navigate:'Intro',
                    type:["viewer","user","transportista"]
                },
                {
                    title:'COMPARTIR',
                    icon:require('../assets/imgs/menu/compartir.png'),
                    navigate:'Compartir',
                    type:["viewer","user","transportista","carrier"]
                },
                {
                    title:'PRESENTACION',
                    icon:require('../assets/imgs/menu/presentacion.png'),
                    navigate:'Presentation',
                    type:["viewer","user","transportista"]
                },
                {
                    title:'SALIR',
                    icon:require('../assets/imgs/menu/salir.png'),
                    navigate:'SALIR',
                    type:["user","transportista","carrier"]
                },
                {
                    title:'HELP',
                    icon:require('../assets/imgs/menu/appversion.png'),
                    navigate:'Info',
                    type:["viewer","user","transportista"]
                }
            ],
            type:"viewer",
            update:false
        }
    }

    componentDidMount()
    {

        AsyncStorage.getItem("user").then(user=>{
            if(user)
            {
               user = JSON.parse(user);
               
               if(user.type == 'carrier')
               {
                   user.type = 'transportista';
               }
               this.setState({
                    type:user.type
                })
            } 
        })
    }
    componentWillReceiveProps()
    {
        AsyncStorage.getItem("user").then(user=>{
            if(user)
            {
               user = JSON.parse(user);
               console.log(user);
               
               this.setState({
                    type:user.type
                })
            }
            else
            {
                this.setState({
                    type:'viewer'
                })
            }
            
        })
    }

    page = (name) => {
        if(name == 'SALIR')
        {
            AsyncStorage.removeItem("user");
            this.props.navigation.navigate("Intro");
        }
        else
        {
            this.props.navigation.navigate(name);
        }
    }
    
    render()
    {
        let self = this;
        const {intlData} = this.props;
        return (
            <View style={style.container}>
                <View style={style.title}>
                    <Text style={{color:'white'}}>{this.props.navigation.title}</Text>
                </View>
                {
                    this.state.menuitems.map((row,index)=>{
                        if(row.type.indexOf(self.state.type) > -1)
                        {
                            return (
                                <TouchableOpacity key={index} style={style.containeritem} onPress={()=>this.page(row.navigate)}>
                                    <Image source={row.icon} style={style.icon}></Image>
                                    <Text style={style.icontext}>{intlData.messages[row.title]}</Text>
                                </TouchableOpacity>
                            )
                        }
                    })
                }
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#e3dfb9'
    },
    containeritem:{
        borderBottomColor:'#c6c585',
        borderBottomWidth:1,
        flexDirection:'row',
        alignItems:'center',
        height:hp('8%')
    },
    containeritemactive:{
        backgroundColor:'#c6c585',
        borderBottomColor:'#c6c585',
        borderBottomWidth:1,
        flexDirection:'row',
        alignItems:'center',
        height:hp('8%')
    },
    icon:{
        width:hp('5%'),
        height:hp('5%'),
        marginLeft:wp('3%'),
        marginRight:wp('3%')
    },
    icontext:{
        color:'#2c2c08',
        fontSize:hp('2.2%')
    },
    title:{
        borderColor:'#8b7f25',
        backgroundColor:'#8b7f25',
        color:'white',
        height:hp('4%'),
        alignItems:'center',
        justifyContent:'center'
    }
})

export default connect(Navigator);