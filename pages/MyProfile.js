import React from 'react';
import {View,StyleSheet,AsyncStorage,Text,TextInput,TouchableOpacity,Picker,Alert} from 'react-native';
import PageContainer from '../components/PageContainer';
import DataService from '../service/dataservice';
import UserService from '../service/userservice';
import connect from '../components/connectedcomponent';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AutoComplete from '../components/autocomplete';

class MyProfile extends React.Component
{
    sending = false;
    constructor(props)
    {
        super(props);
        this.state = {
            user:{},
            saved:false,
            error:{},
            idioma:[],
            countries:[],
            password:'',
            confirmpassword:''
        }
    }

    handleChangePassword = (password) => {
        this.setState({
            password:password
        })
    }

    handleConfirmPassword = (confirm) => {
        this.setState({
            confirmpassword:confirm
        })
    }

    deleteaccount = () => {
        const {intlData} = this.props;

        Alert.alert(
            intlData.messages['ELIMINAR_CUENTA'],
            intlData.messages['SEGURIDAD'],
            [
                {text:intlData.messages['CANCELAR']},
                {text:intlData.messages['SI'],onPress:()=>this.delete()}
            ]
        )
    }

    delete = () => {
        const {intlData} = this.props;
        let user = this.state.user;
        let userservice = new UserService();
        let self = this;
        userservice.deleteuser(user,function(success){
            if(success.success)
            {
                AsyncStorage.setItem("user","");
                self.props.navigation.navigate('Intro');
            }
            else
            {
                alert(intlData.messages['LOGIN_AGAIN']);
            }
        })
    }
    validate = () => {
        let error = {};
        const {intlData} = this.props;
        if(this.state.user.type == 'user' && this.state.user.name      === ""){ error.name = intlData.messages['OBLIGATORIO'];}
        if(this.state.user.type == 'user' && this.state.user.lastname  === ""){ error.lastname = intlData.messages['OBLIGATORIO'];}
        if(this.state.user.address   === ""){ error.address = intlData.messages['OBLIGATORIO'];}
        if(this.state.user.idioma    === null || this.state.user.idioma === ""){ error.idioma = intlData.messages['OBLIGATORIO'];}
        if(this.state.user.town      === ""){ error.town = intlData.messages['OBLIGATORIO'];}
        if(this.state.user.cp        === ""){ error.cp = intlData.messages['OBLIGATORIO'];}
        if(this.state.user.country   === ""){ error.country = intlData.messages['OBLIGATORIO'];}
        // if($scope.formData.prefixFix === ""){ error = true; $scope.formErrors.phoneFix = true;}
        // if($scope.formData.phoneFix  === ""){ error = true; $scope.formErrors.phoneFix = true;}
        if(this.state.user.prefixMob === ""){ error.phoneMob = intlData.messages['OBLIGATORIO'];}
        if(this.state.user.phoneMob  === "" || isNaN(this.state.user.phoneMob)){ error.phoneMob = intlData.messages['OBLIGATORIO'];}
        
        if(this.state.password && this.state.password != this.state.confirmpassword)
        {
            error.confirmpassword = intlData.messages['CONTRASENA_CAMBIADA_EXITO'];
        }

        this.setState({
            error:error
        })
        return Object.keys(error).length > 0?false:true;
    }

    componentDidMount()
    {
        AsyncStorage.getItem("user").then(user=>{
            user = JSON.parse(user);
            this.setState({
                user:user
            })
        })

        let dataservice = new DataService();
        dataservice.getlanguages().then(lang=>{
            this.setState({
                idioma:lang
            })
        })

        dataservice.getcountries().then(country=>{
            this.setState({
                countries:country
            })
        })
        
    }
    
    handleChange = (name,value) => {
        console.log(value);
        let user = this.state.user;
        user[name] = value;
        this.setState({
            user:user
        })
    }

    send = () => {
        const {intlData,updateLanguage} = this.props;
        let user = this.state.user;
        if(this.validate() && !this.sending)
        {
            let self = this;
            this.sending = true;
            let userservice = new UserService();
            userservice.updateuser(user,this.state.password,function(data){
                console.log(data);
                if(data.success)
                {
                    self.setState({
                        saved:true
                    })
                    console.log(data.user);
                    updateLanguage(data.user.idioma);
                    AsyncStorage.setItem("lang",data.user.idioma);
                    let user = data.user;
                    AsyncStorage.setItem("user",JSON.stringify(data.user));
                }
                else
                {
                    let error = {};
                    error.password = intlData.messages['LOGIN_AGAIN'];
                    self.setState({
                        error:error
                    })
                }

                self.sending = false;
            })
        }
    }

    remove = (index) => {
        let user = this.state.user;
        user.paises.splice(index,1);
        this.setState({
            user:user
        })
    }
    render()
    {
        const {intlData} = this.props;
        let countrycode = [];
        this.state.countries.map(function(row){
            if(row.phone_code)
            {
                countrycode.push(row.phone_code);
            }
            
        })

        countrycode.sort(function(a,b){
            if(a.split)
            {
                a = a.split(' ').join('');
            }

            if(b.split)
            {
                b = b.split(' ').join('');
            }
            return a>b?1:-1
        });
        return (
            <PageContainer {...this.props} bannerenable={true} padding={true}>
                <View style={style.container}>
                    {
                        !this.state.saved && (
                            <View>
                                {
                                    this.state.user.type == "user" && (
                                        <View style={style.formgroup}>
                                            <Text style={style.label}>{intlData.messages['NOMBRE']}</Text>
                                            <TextInput style={style.input} value={this.state.user.name} onChangeText={(text)=>this.handleChange("name",text)}></TextInput>
                                            {
                                                this.state.error.name && (
                                                    <Text style={style.formerror}>{this.state.error.name}</Text>
                                                )
                                            }
                                        </View>
                                    )
                                }
                                {
                                    this.state.user.type != "user" && (
                                        <View style={style.formgroup}>
                                            <Text style={style.label}>{intlData.messages['NOMBRE_E']}</Text>
                                            <TextInput style={style.input} value={this.state.user.name_empresa} onChangeText={(text)=>this.handleChange("name_empresa",text)}></TextInput>
                                            {
                                                this.state.error.name_empresa && (
                                                    <Text style={style.formerror}>{this.state.error.name_empresa}</Text>
                                                )
                                            }
                                        </View>
                                    )
                                }
                                {
                                    this.state.user.type == 'user' && (
                                        <View>
                                            <View style={style.formgroup}>
                                                <Text style={style.label}>{intlData.messages['APELLIDO']}</Text>
                                                <TextInput style={style.input} value={this.state.user.lastname} onChangeText={(text)=>this.handleChange("lastname",text)}></TextInput>
                                                {
                                                    this.state.error.lastname && (
                                                        <Text style={style.formerror}>{this.state.error.lastname}</Text>
                                                    )
                                                }
                                            </View>
                                            <View style={style.formgroup}>
                                                <Text style={style.label}>{intlData.messages['IDIOMA']}</Text>
                                                <View style={style.dropdown}>
                                                    <Picker mode="dropdown" style={{flex:1}} onValueChange={(itemvalue)=>this.handleChange("idioma",itemvalue)} selectedValue={this.state.user.idioma}>
                                                        <Picker.Item value="" label={intlData.messages['IDIOMA']}></Picker.Item>
                                                        {
                                                            this.state.idioma.map((row,index)=>{
                                                                return (
                                                                    <Picker.Item key={index} value={row.code} label={row.name}></Picker.Item>
                                                                )
                                                            })
                                                        }
                                                    </Picker>
                                                </View>
                                                {
                                                    this.state.error.idioma && (
                                                        <Text style={style.formerror}>{this.state.error.idioma}</Text>
                                                    )
                                                }
                                            </View>
                                        </View>
                                    )
                                }
                                {
                                    this.state.user.type != "user" && (
                                        <View style={style.formgroup}>
                                            <View style={{flexDirection:'row'}}>
                                                <View style={{flex:1}}>
                                                    <Text style={style.label}>CIF/NIF*</Text>
                                                </View>
                                                <View style={{flex:2,marginLeft:wp('2%')}}>
                                                    <Text style={style.label}>{intlData.messages['IDIOMA']}</Text>
                                                </View>    
                                            </View> 
                                            <View style={{flexDirection:'row'}}>
                                                <View style={{flex:1}}>
                                                    
                                                    <TextInput style={style.input} value={this.state.user.numero_identificacion} onChangeText={(text)=>this.handleChange("numero_identificacion",text)}></TextInput>
                                                    {
                                                        this.state.error.numero_identificacion && (
                                                            <Text style={style.formerror}>{this.state.error.numero_identificacion}</Text>
                                                        )
                                                    }
                                                </View>
                                                <View style={{flex:2,marginLeft:wp('2%')}}>
                                                    
                                                    <View style={style.dropdown}>
                                                        <Picker mode="dropdown" style={{flex:1}} onValueChange={(itemvalue)=>this.handleChange("idioma",itemvalue)} selectedValue={this.state.user.idioma}>
                                                            <Picker.Item value="" label={intlData.messages['IDIOMA']}></Picker.Item>
                                                            {
                                                                this.state.idioma.map((row,index)=>{
                                                                    return (
                                                                        <Picker.Item key={index} value={row.code} label={row.name}></Picker.Item>
                                                                    )
                                                                })
                                                            }
                                                        </Picker>
                                                    </View>
                                                    {
                                                        this.state.error.idioma && (
                                                            <Text style={style.formerror}>{this.state.error.idioma}</Text>
                                                        )
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                        
                                    )
                                }
                                <View style={style.formgroup}>
                                    <Text style={style.label}>{intlData.messages['DIRECCION']}</Text>
                                    <TextInput style={style.input} value={this.state.user.address} onChangeText={(text)=>this.handleChange('address',text)}></TextInput>
                                    {
                                        this.state.error.address && (
                                            <Text style={style.formerror}>{this.state.error.address}</Text>
                                        )
                                    }
                                </View>
                                <View style={style.formgroup}>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{flex:3,marginRight:wp('2%')}}>
                                            <Text style={style.label}>{intlData.messages['POBLACION']} *</Text>
                                        </View>
                                        <View style={{flex:2}}>
                                            <Text style={style.label}>{intlData.messages['CODIGO2']} *</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{flex:3,marginRight:wp('2%')}}>
                                            
                                            <TextInput style={style.input} value={this.state.user.town} onChangeText={(text)=>this.handleChange("town",text)}></TextInput>
                                            {
                                                this.state.error.town && (
                                                    <Text style={style.formerror}>{this.state.error.town}</Text>
                                                )
                                            }
                                        </View>
                                        <View style={{flex:2}}>
                                            
                                            <TextInput style={style.input} value={this.state.user.cp} onChangeText={(text)=>this.handleChange("cp",text)}></TextInput>
                                            {
                                                this.state.error.cp && (
                                                    <Text style={style.formerror}>{this.state.error.cp}</Text>
                                                )
                                            }
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={style.formgroup}>
                                    <Text style={style.label}>{intlData.messages['PAIS']} *</Text>
                                    <View style={style.dropdown}>
                                        <Picker mode="dropdown" style={{flex:1}} onValueChange={(itemvalue)=>this.handleChange("country",itemvalue)} selectedValue={this.state.user.country}>
                                            <Picker.Item value="" label={intlData.messages['PAIS']}></Picker.Item>
                                            {
                                                this.state.countries.map((row,index)=>{
                                                    return (
                                                        <Picker.Item key={index} value={row.nombre} label={row.nombre}></Picker.Item>
                                                    )       
                                                })
                                            }
                                        </Picker>
                                    </View>
                                    {
                                        this.state.error.country && (
                                            <Text style={style.formerror}>{this.state.error.country}</Text>
                                        )
                                    }
                                </View>
                                {
                                    this.state.user.type != "user" && (
                                        <View>
                                            <View style={style.formgroup}>
                                                <Text style={style.label}>Web</Text>
                                                <TextInput style={style.input} value={this.state.user.web} onChangeText={(text)=>this.handleChange('web',text)}></TextInput>
                                            </View>
                                            <View style={style.formgroup}>
                                                <Text style={style.label}>{intlData.messages['AREA_T']}</Text>
                                                <AutoComplete value={this.state.user.interestedCountries?this.state.user.interestedCountries:[]} selectchange = {(value)=>this.handleChange("interestedCountries",value)} remove={this.remove} intlData={intlData}></AutoComplete>
                                            </View> 
                                        </View>
                                    )
                                }
                                <View style={{flexDirection:'row',...style.formgroup}}>
                                    <View style={{flex:2,marginRight:wp('2%')}}>
                                        <Text style={style.label}>{intlData.messages['PREFIJO']} *</Text>
                                        <View style={style.dropdown}>
                                            <Picker mode="dropdown"  style={{flex:1}} onValueChange={(itemvalue)=>this.handleChange("prefixFix",itemvalue)} selectedValue={this.state.user.prefixFix}>
                                                <Picker.Item value="" label={intlData.messages['PREFIJO']}></Picker.Item>
                                                {
                                                    countrycode.map((row,index)=>{
                                                        return (
                                                            <Picker.Item key={index} label={'+' + row} value={'+' + row}></Picker.Item>
                                                        )
                                                    })
                                                }
                                            </Picker>
                                        </View>
                                    </View>
                                    <View style={{flex:3}}>
                                        <Text style={style.label}>{intlData.messages['TELEFONO_F']} *</Text>
                                        <TextInput keyboardType="number-pad" style={style.input} value={this.state.user.phoneFix} onChangeText={(text)=>this.handleChange("phoneFix",text)}></TextInput>
                                        {
                                            this.state.error.phoneFix && (
                                                <Text style={style.formerror}>{this.state.error.phoneFix}</Text>
                                            )
                                        }
                                    </View>
                                </View>
                                <View style={{flexDirection:'row',...style.formgroup}}>
                                    <View style={{flex:2,marginRight:wp('2%')}}>
                                        <Text style={style.label}>{intlData.messages['PREFIJO']} *</Text>
                                        <View style={style.dropdown}>
                                            <Picker mode="dropdown"  style={{flex:1}} onValueChange={(itemvalue)=>this.handleChange("prefixMob",itemvalue)} selectedValue={this.state.user.prefixMob}>
                                                <Picker.Item value="" label={intlData.messages['PREFIJO']}></Picker.Item>
                                                {
                                                    countrycode.map((row,index)=>{
                                                        return (
                                                            <Picker.Item key={index} label={'+' + row} value={'+' + row}></Picker.Item>
                                                        )
                                                    })
                                                }
                                            </Picker>
                                        </View>
                                    </View>
                                    <View style={{flex:3}}>
                                        <Text style={style.label}>{intlData.messages['TELEFONO_M']} *</Text>
                                        <TextInput keyboardType="number-pad" style={style.input} value={this.state.user.phoneMob} onChangeText={(text)=>this.handleChange("phoneMob",text)}></TextInput>
                                        {
                                            this.state.error.phoneMob && (
                                                <Text style={style.formerror}>{this.state.error.phoneMob}</Text>
                                            )
                                        }
                                    </View>
                                </View>
                                <View style={style.formgroup}>
                                    <Text style={style.label}>Email *</Text>
                                    <TextInput style={style.input} value={this.state.user.email} onChangeText={(text)=>this.handleChange("email",text)}></TextInput>
                                </View>
                                <View style={style.formgroup}>
                                    <Text style={style.label}>{intlData.messages['CONTRASENA']} *</Text>
                                    <TextInput value={this.state.password} style={style.input} secureTextEntry={true}  onChangeText={(text)=>this.handleChangePassword(text)}></TextInput>
                                    {
                                        this.state.error.password && (
                                            <Text style={style.formerror}>{this.state.error.password}</Text>
                                        )
                                    }
                                </View>
                                <View style={style.formgroup}>
                                    <Text style={style.label}>{intlData.messages['CONFIRMAR2']} *</Text>
                                    <TextInput value={this.state.confirmpassword} secureTextEntry={true} style={style.input} onChangeText={(text)=>this.handleConfirmPassword(text)}></TextInput>
                                    {
                                        this.state.error.confirmpassword && (
                                            <Text style={style.formerror}>{this.state.error.confirmpassword}</Text>
                                        )
                                    }
                                </View>
                                <View style={style.btncontainer}>
                                    <TouchableOpacity style={style.btn} onPress={this.deleteaccount}>
                                        <Text style={style.text}>{intlData.messages['ELIMINAR_CUENTA']}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{marginLeft:'auto',...style.btn}} onPress={this.send}>
                                        <Text style={style.text}>{intlData.messages['CONFIRMAR']}</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                        )
                    }
                    {
                        this.state.saved && (
                            <Text style={style.text}>{intlData.messages['EXITO2']}</Text>
                        )
                    }          
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        paddingLeft:wp('10%'),
        paddingRight:wp('10%'),
        paddingTop:hp('3%'),
        paddingBottom:hp('4%')
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
        marginTop:hp('1%'),
        height:hp('6.5%')
    },
    dropdown:{
        backgroundColor:'white',
        borderRadius:5,
        marginTop:hp('1%')
    },
    btncontainer:{
        flexDirection:'row',
        display:'flex',
        marginTop:hp('3%'),
        flexWrap:'wrap'
    },
    btn:{
        paddingLeft:wp('2%'),
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        paddingRight:wp('2%'),
        backgroundColor:'#dd691b',
        borderRadius:5
    },
    text:{
        fontSize:hp('2.3%'),
        color:'white'
    },
    formgroup:{
        marginBottom:hp('2%')
    },
    formerror:{
        color:'#fb0603',
        fontSize:hp('2.3%'),
        textAlign:'center',
        marginTop:hp('1%')
    }
    
})

export default connect(MyProfile);