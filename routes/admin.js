var express = require('express');
const { addUser } = require('../helpers/user-helpers');
var router = express.Router();
const adminHelper = require('../helpers/admin-helpers');
const { response } = require('express');
const { getAdmin, getUsers } = require('../helpers/admin-helpers');
const session = require('express-session');






/* GET ADMIN LOGIN PAGE. */
router.get('/', function(req, res, next) {
  if(req.session.adminStatus){
    res.redirect('/adminHome')
  }else if(req.session.loggedIn){
    res.render('user/home',{products})
  }
  else
  {
  res.render('admin/loginAdmin')
}
});

router.get('/adminHome',(req,res)=>{
  if(req.session.adminStatus){
    adminHelper.getUsers().then((usersData)=>{
      res.render('admin/homeAdmin',{usersData})
    })
  }
  else{
    res.redirect('/admin')
  }
})
//TO USER LOGIN
router.get('/userLogin',(req,res)=>{
  if(req.session.adminStatus){
    adminHelper.getUsers().then((usersData)=>{
      // console.log(usersData);  
      res.render('admin/homeAdmin',{usersData})
    })
  }else if (req.session.loggedIn){
    res.render('user/home',{products})
  }else{
    res.render('user/loginUser')
  }
})

//TO ADMIN HOME
router.post('/adminHome',(req,res)=>{
  console.log(req.body);
  adminHelper.getAdmin(req.body).then((response)=>{
    if(response.status){
      console.log(response.status);
      req.session.adminStatus = true;
      req.session.adminData = response.admin;
      adminHelper.getUsers().then((usersData)=>{
        // console.log(usersData);  
        res.render('admin/homeAdmin',{usersData})
      })
    }
    else{
      req.session.adminOut = true;
      res.redirect('/admin')
    }    
  })
})

//ON CLICK ADD USER
router.get('/add-user',(req,res)=>{
  if(req.session.adminOut){
    res.redirect('/admin')
  }else {
    res.render('admin/add-user')
  }
})

//ADDING USER TO COLLECTION
router.post('/user-created',(req,res)=>{
  // console.log(req.body);
  adminHelper.addUser(req.body,()=>{
    res.redirect('/admin/add-user')
  })
})


//DELETE USER
router.get('/delete-user/',(req,res)=>{
  let userId = req.query.ID
      // let name = req.query.name
      // console.log(req.query.name);
  console.log(req.query.ID);
  adminHelper.deleteUser(userId).then((response)=>{
    res.redirect('/admin/adminHome')
  })
})


//GET UPDATE USER
router.get('/update-user/:ID', async(req,res)=>{
  let ID = req.params.ID
  const userData = await adminHelper.userDetails(ID)
    // console.log(userData);
    res.render('admin/edit-users',{userData})
    // console.log(userData);
})


//UPDATE USER
router.post('/update/:id',(req,res)=>{
  const ID = req.params.id
  console.log(ID);
  // console.log(':)');
  console.log(req.body);
  adminHelper.updateUser(ID,req.body).then((response)=>{
    // console.log(res);
    res.redirect('/admin/adminHome')
  })
})


//LOGOUT
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
})

module.exports = router;
