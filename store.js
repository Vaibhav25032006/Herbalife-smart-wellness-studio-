function userStoreKey(){return appState.currentUser?`herbalife_user_${appState.currentUser.id}`:null;}
function loadUserState(){const k=userStoreKey();if(!k)return {tasks:{},calendar:{},history:{}};return JSON.parse(localStorage.getItem(k)||"null")||{tasks:{},calendar:{},history:{}};}
function saveUserState(s){const k=userStoreKey();if(k)localStorage.setItem(k,JSON.stringify(s));}
