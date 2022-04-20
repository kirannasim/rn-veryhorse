import React from 'react';
import {View,StyleSheet,TouchableOpacity,Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Multiple from 'react-native-multiple-select';
import Service from '../service/dataservice';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';

class AutoComplete extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            countries:[]
        }
    }

    componentDidMount()
    {  
        let service = new Service();
        service.getcountries().then(countries=>this.setState({
            countries:countries
        }))

    }

    getcountry = (name) => {
        for(let item in this.state.countries)
        {
            if(this.state.countries[item].iso2 == name)
            {
                return this.state.countries[item];
            }
        }

        return {};
    }
    selectchange = (value) => {
        console.log(value);
        let countries = []; let namearray = [];
        for(let item in value)
        {
            if(typeof value[item] == 'object')
            {
                countries.push(value[item]);
                namearray.push(value[item].nombre);
            }
            else if(namearray.indexOf(value[item]) == -1)
            {
                countries.push(this.getcountry(value[item]))
                namearray.push(value[item]);
            }
        }  
        
        this.props.selectchange(value);
    }

    render()
    {
        let self = this;
        const {intlData} = this.props;
        console.log(this.props.value);
        return (
            <View style={style.container}>
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                    {
                        this.props.value.map((row,index)=>{
                            return (
                                <TouchableOpacity key={index} style={style.btn}>
                                    <Text style={{marginRight:10,color:'white'}}>{this.getcountry(row)['nombre']}</Text>
                                    <Icon name="times" onPress={(index)=>self.props.remove(index)}></Icon>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <Multiple styleSelectorContainer={style.input} hideTags={true} uniqueKey="iso2" displayKey="nombre" tagRemoveIconColor="white" items={this.state.countries} selectedItems={this.props.value}  onSelectedItemsChange={(value)=>this.selectchange(value)} selectText={intlData.messages['SELECT']} ></Multiple>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        padding:2,
        borderTopRightRadius:5,
        borderTopLeftRadius:5
    },
    btn:{
        backgroundColor:'#D9544C',
        flexDirection:'row',
        marginRight:wp('1%'),
        marginBottom:hp('1%'),
        padding:hp('0.5%'),
        borderRadius:5,
        alignItems:'center'
    },
    input:{
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5,
        backgroundColor:'white'
    }
})


export default AutoComplete;