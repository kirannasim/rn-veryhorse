import * as firebase from 'firebase';
import {AsyncStorage } from 'react-native';
import axios from 'axios';
export default class DataService
{
    continentsISO = {
        "europe"        : "CT-EU",
        "america"       : "CT-AM",
        "africa"        : "CT-AF",
        "asia"          : "CT-AS",
        "oceania"       : "CT-OC",
        "centroamerica" : "CT-CA", 
        "sudamerica"    : "CT-SA"
    };

    countries = [];
    constructor()
    {

    }

    getlanguages = () => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref().child("languages").on("value",snapshot=>{
                let data = [];
                snapshot.forEach(value=>{
                    data.push(value.val());
                })

                resolve(data);
            })
        })
    } 

    getContinentFromISO = (iso) =>{
        var country = this.getCountryByISO(iso);

        if(country !== null){
            return this.continentsISO[country.continent];
        }else{
            return null;
        }
    }

    getcountries = () => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref().child("countries").on("value",snapshot=>{
                let data = [];
                snapshot.forEach(value=>{
                    data.push(value.val());
                })
                
                this.countries = data;
                resolve(data);
            })
        })
    }
    
    getCountryByISO = (iso) => {
        var country = null;
        
        for(let item in this.countries)
        {
            if(this.countries[item].iso2 == iso)
            {
                return this.countries[item];
            }
        }

        return country;
    }

    getreview = (uid) => {
        console.log(+(new Date()));
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/pending_valoraciones/" + uid).orderByChild("date").endAt(+(new Date())).on("value",snapshot=>{
                let review = [];
                snapshot.forEach(value=>{
                    let data = value.val();
                    data.id = value.key;
                    review.push(data);
                })

                resolve(review);
            })
        })
    }

    getreviewitem = (uid,id) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/pending_valoraciones/" + uid + "/" + id).on('value',snapshot=>{
                let data = snapshot.val();
                if(snapshot.exists)
                {
                    data.id = snapshot.key;
                    resolve(data);
                }
                else{
                    resolve({});
                }
                
                
            })
        })
    }

    addreview = (valoracion,userval) => {
        console.log(valoracion);
        console.log(userval);
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem("user").then(user=>{
                user = JSON.parse(user);
                console.log(user);
                firebase.database().ref("/users/" + valoracion.trans).once('value',snapshot=>{
                    let trans = snapshot.val();
                    console.log(trans);
                    let senddata = {points:userval.rating,desc:userval.desc,user:user.uid,username:user.name + " " + user.lastname,demandName:valoracion.demandName};
                    if(!trans.valoraciones)
                    {
                        trans.valoraciones = [];
                    }
    
                    trans.valoraciones.push(senddata);

                    firebase.database().ref("/users/" + valoracion.trans).set(trans).then(function(){
                        axios.get('http://admin.veryhorse.com/php/send.php',{
                            params:{
                                data:JSON.stringify({user: trans.name_empresa, userEmail: trans.email, demandName:valoracion.demandName, lang: trans.idioma}),
                                action  : "send_valoracion"
                            }
                        });
                        firebase.database().ref('/pending_valoraciones/' + user.uid + "/" +  valoracion.id).remove();
                        resolve(true);
                    }).catch(err=>reject(err))
                   
                })
            }).catch(err=>reject(err))
        })
    }
}