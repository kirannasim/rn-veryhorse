import React from 'react';
import MapView,{Marker} from 'react-native-maps';
import {View,StyleSheet,Text} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MapViewDirections from 'react-native-maps-directions';
import Moment from 'moment';
import Geocoding from 'react-native-geocoding';
import Service from '../../service/service';
class Step5 extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            origin:{},
            destination:{},
            region:{},
            originenable:false,
            destinationenable:false
        }
    }

    gettitle = (mode,firstdate,seconddate) => {
        const {intlData} = this.props;
        switch(mode)
        {
            case 'before':
                return intlData.messages['ANTES_DIA'] + " " +  firstdate?Moment(new Date(firstdate)).format("DD-MM-YYYY"):"";
            case 'after':
                return intlData.messages['DESPUES'] + " " +  firstdate?Moment(new Date(firstdate)).format("DD-MM-YYYY"):"";
            case 'day':
                return firstdate?Moment(new Date(firstdate)).format("DD-MM-YYYY"):"";
            case 'between':
                return intlData.messages['ENTRE'] + " " + Moment(new Date(firstdate)).format("DD-MM-YYYY") + " " + intlData.messages['Y_EL'] + " " + Moment(new Date(seconddate)).format("dd-MM-YYYY");
        }
    }
    
    

    componentDidMount()
    {
        Geocoding.init('AIzaSyDbsOXv4sPiyPY1p-RGsRtMCwoKZdBMXCM');
        let self = this;
        Geocoding.from(this.props.data.pickCity).then(json=>{
            let location = json.results[0].geometry.location;
            self.setState({
                origin:{latitude:location.lat,longitude:location.lng},
                originenable:true
            })
        })

        Geocoding.from(this.props.data.deliverCity).then(json=>{
            let location = json.results[0].geometry.location;
            self.setState({
                destination:{latitude:location.lat,longitude:location.lng},
                destinationenable:true
            })
        })
    }

    getregion = () => {
        let origin = this.state.origin;
        let destination = this.state.destination;

        let latitudeDelta = Math.max(destination.latitude?destination.latitude:0 - origin.latitude?origin.latitude:0,0.3);
        let longitudeDelta = Math.max(destination.longitude?destination.longitude:0 - origin.longitude?origin.longitude:0,0.3);
        

        return {latitude:origin.latitude,longitude:origin.longitude,latitudeDelta:latitudeDelta,longitudeDelta:longitudeDelta};
    }
    
    render()
    {
        const {intlData} = this.props;
        let region = this.getregion();
        let distance = 0;
        if(this.state.originenable && this.state.destinationenable)
        {
            let service = new Service();
            distance = service.getdistance({lat:this.state.origin.latitude,long:this.state.origin.longitude},this.state.destination);
        }
        
        return (
            <View style={style.container}>
                {
                    (this.state.originenable && this.state.destinationenable) && (
                        <MapView style={style.map} 
                        initialRegion={region}
                        zoomEnabled={true}
                        zoomControlEnabled={true}
                        showsCompass={true}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        toolbarEnabled={true}>
                            <Marker coordinate={this.state.origin}></Marker>
                            <Marker coordinate={this.state.destination}></Marker>
                            <MapViewDirections
                            origin={this.state.origin} 
                            destination={this.state.destination} 
                            mode="DRIVING" 
                            language={intlData.locale} 
                            apikey="AIzaSyDbsOXv4sPiyPY1p-RGsRtMCwoKZdBMXCM"
                            ></MapViewDirections>
                        </MapView>
                    )
                }
                <Text style={style.description}>{distance} km</Text>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['RECOGIDA']}</Text>
                    <Text style={style.description}>{this.props.data.pickCity} {this.gettitle(this.props.data.pickMod,this.props.data.pickDayIni,this.props.data.pickDayEnd)}</Text>
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['ENTREGA']}</Text>
                    <Text style={style.description}>{this.props.data.deliverCity} {this.gettitle(this.props.data.deliverMod,this.props.data.deliverDayIni,this.props.data.deliverDayEnd)}</Text>
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['NUMERO_C']}</Text>
                    <Text style={style.description}>{this.props.data.numHorses}</Text>
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['EQUIPAJE']}</Text>
                    <Text style={style.description}>{this.props.data.lugage?intlData.messages['SI']:'No'}</Text>
                </View>
                {
                    this.props.data.lugage && (
                        <View style={style.formgroup}>
                            <Text style={style.specialdescription}>{this.props.data.lugageDesc}</Text>
                        </View>
                    )
                }
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['TRATAMIENTO2']}</Text>
                </View>
                <Text style={style.specialdescription}>
                    {this.props.data.specialDesc}
                </Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    map:{
        width:wp('90%'),
        height:hp('30%'),
        alignSelf:'center'
    },
    formgroup:{
        flexDirection:"row",
        marginTop:hp('3%')
    },
    label:{
        fontSize:hp('2.3%'),
        fontWeight:'bold',
        color:'white'
    },
    description:{
        fontSize:hp('2.3%'),
        color:'white',
        marginLeft:wp('2%')
    },
    specialdescription:{
        fontSize:hp('2.3%'),
        color:'white'
    }
})
export default Step5;
