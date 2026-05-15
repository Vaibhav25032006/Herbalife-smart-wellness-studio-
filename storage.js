function userStoreKey(){return appState.currentUser?`herbalife_user_${appState.currentUser.id}`:null;}
function loadUserState(){const k=userStoreKey();const base={tasks:{},calendar:{},history:{},userType:'general',conversation:[],skips:[]};if(!k)return base;return {...base,...(JSON.parse(localStorage.getItem(k)||"null")||{})};}
function saveUserState(s){const k=userStoreKey();if(k)localStorage.setItem(k,JSON.stringify(s));}
