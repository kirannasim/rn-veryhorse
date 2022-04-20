import * as firebase from 'firebase';
import {AsyncStorage} from 'react-native';
import axios from 'axios';
import DataService from './dataservice';
export default class UserService
{
    constructor()
    {

    }

    login = (username,password,callback) => {
        firebase.auth().signInWithEmailAndPassword(username,password).then(user=>{
            firebase.database().ref("/users/" + user.user.uid).on("value",snapshot=>{
                let loggedin = snapshot.val();
                loggedin.uid = user.user.uid;
                
                AsyncStorage.setItem("user",JSON.stringify(loggedin));
                callback({success:true,lang:loggedin.idioma});
            })
            
        }).catch(error=>{
            console.log(error.code);
            if(error.code === "auth/user-not-found" || error.code === "auth/wrong-password"){
				callback({success:false})
            }
            else
            {
                callback({success:false,message:error.message});
            }
        })
    }

    forgotpassword = (email) => {
        return new Promise((resolve,reject)=>{
            firebase.auth().sendPasswordResetEmail(email).then(function(){
                resolve({
                    success:true
                })
            }).catch(err=>reject(err))
        })
    }

    phoneexist  = (phone,type) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/users").orderByChild(type).startAt(phone).endAt(phone).on("value",snapshot=>{
                if(snapshot.exists())
                {
                    console.log(snapshot.val());
                    resolve(true);
                }
                else
                {
                    resolve(false);
                }
            })
        })
    }

    registeruser = (user,callback) => {
        firebase.auth().createUserWithEmailAndPassword(user.email,user.password).then(function(firebaseuser){
            user.createdAt = new Date().getTime();
            if(user.type != 'user')
            {
                user.aprobado = false;
            }
            else
            {
                user.aprobado = true;
            }
            
            console.log(firebaseuser.user.uid);
            firebase.database().ref("/users/" + firebaseuser.user.uid).set(user).then(function(ref){
                var mailchimpdata = {
                    name:user.name,
                    lastname:user.lastname,
                    country:user.country,
                    email: user.email,
					type: ''
                };

                console.log(user);

                axios.get('http://admin.veryhorse.com/php/mailchimp/sendSuscription.php',{params:{
                    data:JSON.stringify({data:mailchimpdata}),
                    action:'send_suscription'
                }});

                let dataservice  = new DataService();
                
                if(user.type == 'transportista')
                {
                    dataservice.getcountries().then(countries=>{
                        let paises = [];
                        for(let item in countries)
                        {
                            if(user.interestedCountries.indexOf(countries[item].iso2) > -1)
                            {
                                paises.push(countries[item]);
                            }
                        }  

                        user.paises = paises;

                        axios.get("http://admin.veryhorse.com/php/send.php",{params:{data:JSON.stringify({data:user}),action:"send_new_transportista"}}).then(res=>{

                        })
                    })
                }
                else
                {   
                    axios.get("http://admin.veryhorse.com/php/send.php",{params:{data:JSON.stringify({data:user}),action:"create_new_user"}}).then(res=>{

                    })
                }
                
                callback({success:true});
            })
        },function(error){
            callback({success:false,error:error});
        })
    }

    updateuser = (user,password,callback) => {
        firebase.database().ref("/users/" + user.uid).set(user).then(function(ref){
            if(password)
            {
                var currentUser = firebase.auth().currentUser;
                currentUser.updatePassword(password).then(function(){
                    user.password = password;
                    callback({success:true,user:user})
                }).catch(err=>{
                    if(err.code == 'auth/requires-recent-login')
                    {
                        callback({success:false})
                    }
                })
            }
            else
            {
                callback({success:true,user:user});
            }
        })
    }

    deleteuser = (user,callback) => {
        var currentUser = firebase.auth().currentUser;
        currentUser.delete().then(function(result){
            firebase.database().ref("/users/" + user.uid).remove().then(function(){
                callback({success:true});
            })
        }).catch(err=>{
            callback({success:false})
        })
    }
}