
//General function to select DOM elements
function $ (selector) {
  return document.querySelector(selector);
}

function all (selector) {
  return document.querySelectorAll(selector);
}


// update the frame according to the selected option
function updateFrame(){
 
  $('#quick-reports-links').addEventListener('change',setQrFrameExpandURL);
 $('#my-team-folders-links').addEventListener('change',setTfFrameURL);
}
// set quick-reports  relevant link for the expand button and frame section
 function setQrFrameExpandURL() {

     var el=document.getElementById("quick-reports-links");

  $('#quickreports-expand-url').href=el.options[el.selectedIndex].value;
  $('#quickreports-frame').src=el.options[el.selectedIndex].value;
    return false;

}
// set team folders the relevant link for the expand button and frame section
 function setTfFrameURL() {

     var el=document.getElementById("my-team-folders-links");
     if(el.options!==undefined)
  $('#tfolders-frame').src=el.options[el.selectedIndex].value;
    return false;

}



var addEventListener = function(obj, evt, fnc) {
if (document.addEventListener) {
    var addEvent = function(elem, type, handler) {
        elem.addEventListener(type, handler, false)
    }
    var removeEvent = function(elem, type, handler) {
        elem.removeEventListener(type, handler, false)
    }
} else {
    var addEvent = function(elem, type, handler) {
        elem.attachEvent("on" + type, handler)
    }
    var removeEvent = function(elem, type, handler) {
        elem.detachEvent("on" + type, handler)
    }
}

};

/// load data for nav-sections from JSON file
var fillMenu=function(data){
  var quickActions=data.quickActions;
 
  var navSections = all(".nav-section");
  for (var i = 0; i < navSections.length; i++) {
    // set header for every nav-section
    navSections[i].innerHTML = "<p>" + quickActions[i].label + "</p>" + navSections[i].innerHTML;
    // set background for every nav-section
    navSections[i].style.background = "black url(./img/icons/" + quickActions[i].icon + ".png)  left 50% top 70px no-repeat";
  }

 
  var menuCaptions = all(".menu-caption");
  for (var i = 0; i < menuCaptions.length; i++) {
    // menu header
    menuCaptions[i].innerHTML = "<p>" + quickActions[i].actionsLabel + "</p>";
  }

  var actionLists = all(".action-list");
  for (var i = 0; i < actionLists.length; i++) {
    actions = quickActions[i].actions;
    for (var j = 0; j < actions.length; j++) {
      // set links
      actionLists[i].innerHTML += "<li><a href=\"" + actions[j].url + "\">" + actions[j].label + "</a></li>"
    }
  }

}

// activate the pressed tab
var setActiveTab=function(){
  

  var tabsList =document.getElementsByClassName("tabs-links");
  // current tab hash
   var active=this.hash || window.location.hash;

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == active) {
          x=tabsList[i].parentNode;
          // set the tab toggle class to be active-tab
          x.className+=' active-tab';
        } else {
          // remove the active-tab class from the other tabs
          x=tabsList[i].parentNode;
           // remove the active-tab class from the other tabs
          x.className='tab';
          // hide the other tabs content
        $(tabsList[i].hash).classList.add('hidden');
        }
      }
    // show current tab content
     $(active).classList.remove('hidden');
};

// tab navigation using keyboard
TabsNavigation= function(e) {
    var curr;
    var tabsList = document.getElementsByClassName("tab");
    // check which tab is active
    for (var i = 0; i < tabsList.length; i++) {
    
        if(tabsList[i].className === 'tab active-tab'){
           curr=tabsList[i].id;
        }
      }

    // var selectedTabIndex = UTILS.getSelectedTabIndex(tabslist);
    switch (e.keyCode) {
        case 37:{
                if(parseInt(curr[3])>1){
               
                 curr=curr.replace(curr[3],parseInt(curr[3]) - 1);
              
                window.location.hash = $('#'+curr).children[0].rel;
             
                setActiveTab();
                }
            break;
            }
        case 39:{
                if(parseInt(curr[3]) < tabsList.length){
                curr=curr.replace(curr[3],parseInt(curr[3]) + 1);
                window.location.hash = $('#'+curr).children[0].rel;
                setActiveTab();
                }
            break;
            }
       }
        }

var checkInputs=function(e){

  valid=1;
  currentTab=this.id;
  currentTab=currentTab.substr(0,currentTab.indexOf('-save'));
  var inputFields=all('#'+currentTab+'-feildset-form' +' .report-input');
  for (var i = 0; i < inputFields.length; i +=2) {
     if((inputFields[i].value!=="" && inputFields[i].value!==null) && (inputFields[i+1].value==="" || inputFields[i+1].value===null)){

        inputFields[i+1].required=true;
        inputFields[i].required=true;
        errorFocus(inputFields[i+1].id);
        valid=0;
     }
    if((inputFields[i].value==="" || inputFields[i].value===null) && (inputFields[i+1].value!=="" && inputFields[i+1].value!==null)){
            inputFields[i].required=true;
            inputFields[i+1].required=true;
            errorFocus(inputFields[i].id);
            valid=0;


      }
      if((inputFields[i].value=="" || inputFields[i].value==null) && (inputFields[i+1].value=="" || inputFields[i+1].value==null) ){
            inputFields[i].required=false;
            inputFields[i+1].required=false;

            valid=1;
      }
  }
 
  if(valid==1 && $('#'+currentTab+'-feildset-form' +' .setting-form').checkValidity())
  {
    submitFormData(currentTab,inputFields);

  }
  return ;
};

var errorFocus=function(id){
   $('#'+id).addEventListener('focus',function(){
            // this.value="a";
       this.style.outline="none";
        this.style.boxShadow="inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6)";
           });
         $('#'+id).addEventListener('blur',function(){
            // this.value="a";
        this.style.borderColor="blue";
          this.style.boxShadow="none";
          });

};

/// create localStorage and save the data from the form in it
var createLocalStorage = function(){

   localStorage.clear();
    var dataArr=[];
    var forms=all('.feildset-form');
  // check localStorage support
 if (localStorage) {
  for(j=0; j<2; j++){
    formid=forms[j].id;
  
    thisForm=formid.substr(0,formid.indexOf('-feildset-form'));
    
     var inputs=all('#'+thisForm+'-feildset-form' +' .report-input')
   for (var i = 0; i < inputs.length; i+=2) {
         if(inputs[i].value!==null && inputs[i].value!==""){
         dataArr.push({
                    name: inputs[i].value,
                    nameKey: inputs[i].id,
                    url: inputs[i+1].value,
                    urlKey : inputs[i+1].id
                });
        }
       }

      };
      // }
    localStorage.setItem('formData', JSON.stringify(dataArr));
    // tryget=JSON.parse(localStorage.getItem('formData'));
   
 }
else{
  console.log('ERROR: localStorage is not supported');
}  
return;
}

var submitFormData=function(currentTab,inputs){

  // list of the links
  var linkList=$('#'+currentTab+'-links');
  // check if the list is empty
  if(linkList.length!==0){
    // delete all old links
    for(var i=linkList.options.length-1;i>=0;i--)
    {
       linkList.remove(i);
    }
  }

  for (var i = 0; i < inputs.length; i+=2) {
         if(inputs[i].value!==null && inputs[i].value!=="" && inputs[i+1].value!==null && inputs[i+1].value!==""){
          var opt = document.createElement('option');
            
            opt.value = inputs[i+1].value;
            opt.innerHTML = inputs[i].value;
            linkList.appendChild(opt);
            // alert(inputs[i+1].value);
      
        }
      }
    if(linkList.length!==0){
 
     
    // update the frame and the expand icon url
    if(currentTab==="quick-reports"){
     setQrFrameExpandURL();
     // show expand icon
      $('.expand').classList.remove('hidden');
    }
   else
    setTfFrameURL();
    updateFrame();
    // hide setting form
     $('#'+currentTab+'-setting').click();

     // show select elemnt and iframe
    $('#'+currentTab +' .frame-content').classList.remove('hidden');
    $('#'+currentTab+'-links').classList.remove('hidden');
     // $('#'+currentTab+' .content-section').style.height="55em";
  }
  
  else{
  // if the frame is empty.. // hide everything (revert to the initial state)
  // if(linkList.length===0){
    // alert('please fill in the reports you like and save or else press cancel');
    $('#'+currentTab+'-links').classList.add('hidden');
    $('#'+currentTab +' .frame-content').classList.add('hidden');
    $('.expand').classList.add('hidden');
   }
  createLocalStorage();

}

var loadDataFromStorage=function(e){
  // var forms=document.getElementsByClassName("feildset-form")[0];
  var inputFields1=all('#quick-reports-feildset-form' +' .report-input');
  var inputFields2=all('#my-team-folders-feildset-form' +' .report-input');
   var data=JSON.parse(localStorage.getItem('formData'));
   if(data!==null && data!==undefined){
    
  for (var i = 0; i < data.length;i++) {
      $('#'+data[i].nameKey).value=data[i].name;
      $('#'+data[i].urlKey).value=data[i].url;
  }
  submitFormData("quick-reports",inputFields1);
  submitFormData("my-team-folders",inputFields2);
}
}

// when pressing enter in the input feild

var inputFields=all('#quick-reports-feildset-form' +' .report-input');
for (var i = 0; i < inputFields.length; i++) {
 inputFields[i].addEventListener("keydown",function(event) {
  // save when click Enter
        if (event.keyCode == 13) {
            event.preventDefault();
             $('#quick-reports-save').click();
            return false;
         }
         // cancel when click esc
         if(event.keyCode == 27){

          event.preventDefault();
            $('#quickreports-cancel').click();
            return false;
         }
    });
};

var inputs=all('#my-team-folders-feildset-form' +' .report-input');
for (var i = 0; i < inputs.length; i++) {
 inputs[i].addEventListener("keydown",function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
             $('#my-team-folders-save').click();
            return false;
         }
         if(e.keyCode == 27){

          e.preventDefault();
          $('#teamfolders-cancel').click();
          return false;
         }
    });
};



// on every tab click
var tabs =document.getElementsByClassName("tabs-links");

for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", setActiveTab);
  };



document.getElementById("quick-reports-save").addEventListener('click',checkInputs);
document.getElementById("my-team-folders-save").addEventListener('click',checkInputs);



function initialize () {

  // quick-reports setting button
  document.getElementById("quick-reports-setting").addEventListener('click',function(e){
    // set the setting to be active (white background)
  $("#quick-reports-setting").classList.toggle('active-setting') ;
    // show the feildset content
    $("#quick-reports-feildset-form").classList.toggle('hidden');
     document.getElementById("report1").focus();

});
  // my-team-folders setting button
document.getElementById("my-team-folders-setting").addEventListener('click',function(e){
  // set the setting to be active (white background)
  $("#my-team-folders-setting").classList.toggle('active-setting') ;
   // show the feildset content
    $("#my-team-folders-feildset-form").classList.toggle('hidden');
});

// quick reports setting cancel 
document.getElementById("quickreports-cancel").addEventListener('click',function(e){
   e.preventDefault();
   $('#quick-reports-setting').click();

});
// my team folders setting cancel 
document.getElementById("teamfolders-cancel").addEventListener('click',function(e){
   e.preventDefault();
   $('#my-team-folders-setting').click();

});
if(window.location.hash)
setActiveTab();
loadDataFromStorage();

// get notifications
 UTILS.getDataRequest();
 UTILS.ajax("data/config.json", {done: fillMenu});
// document.onkeydown = TabsNavigation();
document.addEventListener("keydown",TabsNavigation);
 };

window.onLoad = initialize();

