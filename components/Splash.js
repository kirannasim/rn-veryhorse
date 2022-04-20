import React,{Component} from 'react';
import {ImageBackground,View,AsyncStorage} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Navigator from './Navigator';
import {SelectLang,Intro,Info,StaticPage,Presentation,Contact,RouteShop,HotelList,HotelDetail, IntroItem,Login,Forgot,RegisterMain,UserRegister,NewDemand,MyDemand,MyDemandItem,ProposalItem, MyProfile, Valoracies,Valoraciesitem,AskPending,CarrierRegister,CarrierDemand,Compartar,NewRoute,MyRoute,RouteItem} from '../pages';
import { createStackNavigator } from 'react-navigation-stack';
import connect from '../components/connectedcomponent';
class Splash extends Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        let self = this;
        const {updateLanguage} = this.props;
        window.setTimeout(()=>{
            AsyncStorage.getItem("lang").then(value=>{
                if(value)
                {
                    updateLanguage(value);
                    self.props.navigation.navigate('Presentation');
                }
                else
                {
                    self.props.navigation.navigate('SelectLang');
                }
            
            })
            
        },1500);
    }

    render()
    {
        return (
            <View style={{flex:1}}>
                <ImageBackground style={{width:'100%',height:'100%'}} source={require('../assets/imgs/splash.png')}></ImageBackground>
            </View>
        )
    }   
}

let RootStack = createStackNavigator({
   Intro:{
        screen:Intro,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
   },
   IntroItem:{
        screen:IntroItem,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
   },
   Info:{
        screen:Info,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    StaticPage:{
        screen:StaticPage,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    Presentation:{
        screen:Presentation,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    Contact:{
        screen:Contact,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    RouteShop:{
        screen:RouteShop,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    HotelList:{
        screen:HotelList,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    HotelDetail:{
        screen:HotelDetail,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    Login:{
        screen:Login,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    Forgot:{
        screen:Forgot,
        navigationOptions:{
            header:null,
            title:"Very Horse"
        }
    },
    Register:{
        screen:RegisterMain,
        navigationOptions:{
            header:null
        }
    },
    UserRegister:{
        screen:UserRegister,
        navigationOptions:{
            header:null
        }
    },
    CarrierRegisrer:{
        screen:CarrierRegister,
        navigationOptions:{
            
            header:null
        }
    },
    NEWDEMAND:{
        screen:NewDemand,
        navigationOptions:{
            header:null
        }
    },
    MYDEMAND:{
        screen:MyDemand,
        navigationOptions:{
            header:null
        }
    },
    CarrierDeMand:{
        screen:CarrierDemand,
        navigationOptions:{
            header:null
        }
    },
    MYDEMANDITEM:{
        screen:MyDemandItem,
        navigationOptions:{
            header:null
        }
    },
    PROPOSAL:{
        screen:ProposalItem,
        navigationOptions:{
            header:null
        }
    },
    MyProfile:{
        screen:MyProfile,
        navigationOptions:{
            header:null
        }
    },
    VALORACIES:{
        screen:Valoracies,
        navigationOptions:{
            header:null
        }
    },
    REVIEWITEM:{
        screen:Valoraciesitem,
        navigationOptions:{
            header:null
        }
    },
    AskPending:{
        screen:AskPending,
        navigationOptions:{
            header:null
        }
    },
    Compartir:{
        screen:Compartar,
        navigationOptions:{
            header:null
        }
    },
    NewRoute:{
        screen:NewRoute,
        navigationOptions:{
            header:null
        }
    },
    MyRoute:{
        screen:MyRoute,
        navigationOptions:{
            header:null
        }
    },
    RouteItem:{
        screen:RouteItem,
        navigationOptions:{
            header:null
        }
    }
},{
    drawerBackgroundColor:'#e3dfb9',
    drawerPosition:'right',
    contentComponent:Navigator,
    drawerType:'slide',
    initialRouteName:"Presentation"
})


let DrawerNavigator = createDrawerNavigator({
    Splash:{
        screen:connect(Splash)
    },
    SelectLang:{
        screen:SelectLang
    },
    Intro:{
        screen:RootStack
    }
},
{
    drawerBackgroundColor:'#e3dfb9',
    drawerPosition:'right',
    contentComponent:Navigator,
    drawerType:'slide'
})

export default createAppContainer(DrawerNavigator);