var express = require('express');
const { route } = require('./admin');
var router = express.Router();
const userHelper = require('../helpers/user-helpers');
const { Db } = require('mongodb');
const session = require('express-session');
const adminHelper = require('../helpers/admin-helpers')


const products = [
  {
    name:'MERCEDES BENZ',
    category: 'CAR',
    price: 'Rs: 25,00,00,000',
    image: 'https://d2m3nfprmhqjvd.cloudfront.net/blog/20220228142243/ezgif.com-gif-maker-98-5.jpg'
  },
  {
    name: 'ROLLS ROYCE',
    category: 'CAR',
    price: 'Rs: 9,00,00,00,000',
    image: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/2022-rolls-royce-ghost-black-badge-105-16gg-1643905036.jpeg'
  },
  {
    name: 'LAMBORGHINI',
    category: 'CAR',
    price: 'Rs: 34,00,000',
    image: 'https://gumlet.assettype.com/freepressjournal/2020-01/83dfd536-86d0-4325-bd63-ff4d478ca7a3/Huracan.jpg?format=webp&w=480&dpr=2.6'
  },
  {
    name: 'BUGATTI',
    category: 'CAR',
    price: 'Rs: 2,50,00,00,000',
    image: 'https://cdn.luxe.digital/media/20220718163630/best-luxury-car-brands-bugatti-2022-luxe-digital.jpg'
  }]

  

/* GET USER LOGIN. */
router.get('/', function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect('/home')
  }
  else if(req.session.adminStatus){
  adminHelper.getUsers().then((usersData)=>{
    // console.log(usersData);
    res.render("admin/homeAdmin",{usersData})
  })}
  else{
  // console.log(user);
  res.render('user/loginUser', {loginError : req.session.loginError});
  // ,{loginError:req.session.loginError}
  req.session.loginError = false;
}
});


//TO ADMIN LOGIN
router.get('/admin',(req,res)=>{
  if(req.session.adminStatus){
    adminHelper.getUsers().then((usersData)=>{
      // console.log(usersData);  
      res.render('admin/homeAdmin',{usersData})
    })
  }else{
    res.render('admin/loginAdmin')
  }
})  

router.get('/user',(req,res)=>{
  if(req.session.adminStatus){
    adminHelper.getUsers().then((usersData)=>{
      // console.log(usersData);  
      res.render('admin/homeAdmin',{usersData})
    })
  }else{
    res.render('user/loginUser')
  }
})


//DONT GET HOME PAGE USING '/home'
router.get('/home',(req,res)=>{
  if(req.session.loggedIn){
    res.render('user/home',{products})
  }else{
    res.redirect('/')
  }
})

//GET SIGNUP PAGE
router.get('/create',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/home')
  }else if(req.session.adminStatus){
    adminHelper.getUsers().then((usersData)=>{
      // console.log(usersData);  
      res.render('admin/homeAdmin',{usersData})
    })
  }
  else{
    res.render('user/signup')
  }
  })


//DATA EXPORTING TO USER HELPERS TO CHECK DATA
router.post('/',(req,res)=>{
  // console.log(req.body);
 
    userHelper.addSignup(req.body).then((response)=>{
      // console.log(response);
      res.render('user/loginUser',{products})
    })

 
})


//LOGGING IN
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      console.log(response.user);
      req.session.loggedIn = true;
      
      req.session.userdata = response.user
    
      res.redirect('/home');
    }
    else{
      req.session.loginError = true;
      res.redirect('/');
    }
  })
  // console.log(req.body)
})


//LOGGING OUT
router.get('/logout',(req,res)=>{
  req.session.loggedOut = true;
  if(req.session.loggedOut){
  req.session.destroy()
  res.redirect('/')
}
})
  module.exports = router;
