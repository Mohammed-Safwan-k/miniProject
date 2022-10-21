const { get, response } = require('../app');
const db = require('../config/connection')
const COLLECTIONS = require('../config/user-collections')
const bcrypt = require('bcrypt');
const objectId = require('mongodb').ObjectId

module.exports={

    
     //ADMIN LOGIN
     getAdmin: (adminData)=>{
        return new Promise(async(res,rej)=>{
            let responseData = {};
            let loginStatus = false;
            let admin = await db.get().collection(COLLECTIONS.ADMIN_ID).findOne({email:adminData.email})
            if(admin){
                bcrypt.compare(adminData.password,admin.password).then((status)=>{
                    if(status){
                        console.log('ADMIN LOGGED IN');
                        responseData.admin = admin;
                        responseData.status = true;
                        res(responseData);
                    }
                    else{
                        console.log('FAILED TO LOGIN');
                        res({status:false})
                    }
                })
            }
            else{
                console.log('LOGIN FAILED');
                res({status:false})

            }
        })
     },


     //ADDING USER TO DB - ADMIN
     addUser: (userData,callback)=>{
        // console.log(userData);
        return new Promise(async(resolve,reject)=>{
        userData.password = await bcrypt.hash(userData.password,10)
        db.get().collection(COLLECTIONS.USER_COLLECTION).insertOne(userData).then((data)=>{
            callback(data)
            })
        })
     },
     

     //GETTING USERS DATA FROM DATABASE
     getUsers: ()=>{
        return new Promise(async(resolve,reject)=>{
            let users = await db.get().collection(COLLECTIONS.USER_COLLECTION).find().toArray()
            resolve(users)
        })
     },


     //DELETE USERS
     deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(COLLECTIONS.USER_COLLECTION).remove({ _id: objectId(userId) }).then((response) => {
                // console.log(objectId(userId))
                resolve(true)
            })
        })
    },


    //GETTING USER DETAILS FOR UPDATING
    userDetails: (ID) => {
        return new Promise((resolve,reject)=>{
            db.get().collection(COLLECTIONS.USER_COLLECTION).findOne({_id: objectId(ID)}).then((userDetails) => {
                // console.log(userDetails);
                resolve(userDetails);
            })
        })
    },


    //UPDATE USER DATA AFTER EDITING
    updateUser: (userID,editedData) => {
        // console.log(editedData);
        return new Promise((resolve,reject)=>{
            db.get().collection(COLLECTIONS.USER_COLLECTION).updateOne({_id:objectId(userID)},{$set:{
                name:editedData.name,
                email:editedData.email
            }}).then((response) => {
             resolve(response)
            } )
        })
    }


}