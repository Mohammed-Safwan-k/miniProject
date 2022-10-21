const { get, response } = require('../app');
const db = require('../config/connection')
const COLLECTIONS = require('../config/user-collections')
const bcrypt = require('bcrypt')
module.exports={

    //SIGNING UP + DATA TO DB - USER
    addSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
           userData.password = await bcrypt.hash(userData.password,10)
           db.get().collection(COLLECTIONS.USER_COLLECTION).insertOne(userData).then((data)=>{
               resolve(data)
               console.log(data);
           })
        })
    },
    
     //USER LOGIN
     doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {}
            let loginStatus = false; 
            let user = await db.get().collection(COLLECTIONS.USER_COLLECTION).findOne({email:userData.email})
            if (user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                     console.log('LOGIN SUCCESS.');
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else{
                        console.log('LOGIN FAILED.');
                        resolve({status: false})
                    }
                })
            }
            else {
                console.log('Login Failed.');
                resolve({status:false})
            }
        })
    }
}