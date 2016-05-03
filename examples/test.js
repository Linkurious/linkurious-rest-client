
const Linkurious = require('./../built/index');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'linkurious'});
const lkLog = {
  error : m => log.info(m),
  debug : m => log.warn(m)
};

const linkurious = new Linkurious('http://localhost:3000', 'debug', lkLog);

// log user
// linkurious.userLogin('ma.allex@gmail.com', 'grumeaux').then(() => {
//   console.log('');
//   console.log('');
//   console.log('');
//   console.log('|----------------------------------------------------|');
//   console.log('|                TEST LINKURIOUS USER                |');
//   console.log('|----------------------------------------------------|');
//   console.log('');
//   console.log('\033[31m', '- 1 -', '\x1b[0m');
//   console.log('userLogin : user connected');
//   console.log('');
//   return linkurious.userIsAuth();
// }, function(){
//   console.log('\033[31m', '- 1 -', '\x1b[0m');
//   console.log('userLogin : login failed');
//   console.log('');
// }).then((res) => {
//   if(res === true){
//     console.log('\033[31m', '- 2 -', '\x1b[0m');
//     console.log('userIsAuth : user is authenticated');
//     console.log('');
//     return linkurious.getCurrentUser();
//   } else {
//     console.log('\033[31m', '- 2 -', '\x1b[0m');
//     console.log('userIsAuth : user is not connected');
//     console.log('');
//   }
// }).then((res) => {
//   console.log('\033[31m', '- 3 -', '\x1b[0m');
//   console.log('getCurrentUser : OK');
//   console.log(res);
//   console.log('');
//   return linkurious.userIsAdmin();
// }, () => {
//   console.log('\033[31m', '- 3 -', '\x1b[0m');
//   console.log('getCurrentUser : failed');
//   console.log('');
// }).then((res) => {
//   if(res === true){
//     console.log('\033[31m', '- 4 -', '\x1b[0m');
//     console.log('userIsAdmin : true');
//     console.log('');
//   } else {
//     console.log('\033[31m', '- 4 -', '\x1b[0m');
//     console.log('userIsAdmin : false');
//     console.log('');
//     return linkurious.updateCurrentUser({username : 'Courageviande'});
//   }
// }).then((res) => {
//   console.log('\033[31m', '- 5 -', '\x1b[0m');
//   console.log('updateCurrentUser : user updated');
//   console.log('');
//   console.log(res);
//   return linkurious.logout();
// }, () => {
//   console.log('\033[31m', '- 5 -', '\x1b[0m');
//   console.log('updateCurrentUser : error on updated');
//   console.log('');
// }).then(() => {
//   console.log('\033[31m', '- 6 -', '\x1b[0m');
//   console.log('logout : user logout');
//   console.log('');
//   return linkurious.getCurrentUser();
// }).then((res) => {
//   if(res === true){
//     console.log('\033[31m', '- 7 -', '\x1b[0m');
//     console.log('user still connected');
//     console.log('');
//   } else {
//     console.log('\033[31m', '- 7 -', '\x1b[0m');
//     console.log('user is not connected');
//     console.log('');
//   }
// });


linkurious.userLogin('ma.allex@gmail.com', 'grumeaux').then((res) => {
  console.log('');
  console.log('');
  console.log('');
  console.log('|----------------------------------------------------|');
  console.log('|              TEST LINKURIOUS SOURCES               |');
  console.log('|----------------------------------------------------|');
  console.log('');
  console.log('\033[31m', '- 1 -', '\x1b[0m');
  console.log('userLogin : user connected');
  console.log('');
  return linkurious.setDefaultSource().then((res) => {
    console.log('default source is :');
    console.log(res);
    return linkurious.getAdjacentEdges('e7900d9b', {
      orientation : 'out',
      nodeId : 5980,
      skip : 0,
      limit : 50
    })
  }).then((res) => console.log(res));
});




