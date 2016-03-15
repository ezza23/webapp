
//General function to select DOM elements
function $ (selector) {
  return document.querySelector(selector);
}

function all (selector) {
  return document.querySelectorAll(selector);
}
/**
 * JS Library v2
 */

var UTILS = (function () {

  return {
    /**
     * Check if a given value is a plain Object
     *
     * @param  {*}       o Any value to be checked
     * @return {Boolean}   true if it's an Object
     */
    isObject: function (o) {
      var toString = Object.prototype.toString;
      return (toString.call(o) === toString.call({}));
    },

    /**
     * AJAX helper function (similar to jQuery, but far from it!)
     *
     * @param {string} url     URL for the ajax request
     * @param {Object} options AJAX settings
     */
    ajax: function (url, options) {

      var xhr = new XMLHttpRequest(),
        method = 'GET',
        options = UTILS.isObject(options) ? options : {};

      // Check if "method" was supplied
      if (options.method) {

        method = options.method;
      }

      // Setup the request
      xhr.open(method.toUpperCase(), url);

      xhr.onreadystatechange = function () {
        var status;

        // If request finished
        if (xhr.readyState === 4) {

          status = xhr.status;

          // If response is OK or fetched from cache
          if ((status >= 200 && status < 300) || status === 304) {

            var res = xhr.responseText,
              contentType = xhr.getResponseHeader('Content-Type');

            // If server sent a content type header, handle formats
            if (contentType) {
              // Handle JSON format
              if (contentType === 'text/json' ||
                contentType === 'application/json') {

                // JSON throws an exception on invalid JSON
                try {
                  res = JSON.parse(res);
                } catch (err) {
                  // Trigger "fail" callback if set
                  if (options.fail) {
                    options.fail.call(xhr, err);
                    return;
                  }
                }
                 $(".notifications").innerHTML = res.notification;
              // Handle XML format
              } else if (contentType === 'text/xml' ||
                contentType === 'application/xml') {
                // responseXML returns a document object
                res = xhr.responseXML;

                // if XML was invalid, trigger fail callback
                if (res === null && options.fail) {
                  options.fail.call(xhr, 'Bad XML file');
                  return;
                }
              }
            }

            // Trigger done callback with the proper response
            if (options.done) {
              options.done.call(xhr, res);
            }

          }

        }
      };

      // Fire the request
      xhr.send(null);
     
    },
    // make ajax GET request and read json file for notifications
    getDataRequest: function(){

        UTILS.ajax('data/config.json');
      
    }
  };
}());

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

var fillMenu=function(data){
  var quickActions=data.quickActions;
  //set menus backgrounds and headers
  var navSections = all(".nav-section");
  for (var i = 0; i < navSections.length; i++) {
    navSections[i].innerHTML = "<p>" + quickActions[i].label + "</p>" + navSections[i].innerHTML;
    navSections[i].style.background = "url(./img/icons/" + quickActions[i].icon + ".png) center top 60px no-repeat";
  }

  //set menu captions
  var menuCaptions = all(".menu-caption");
  for (var i = 0; i < menuCaptions.length; i++) {
    menuCaptions[i].innerHTML = "<p>" + quickActions[i].actionsLabel + "</p>";
  }

  //set links for quick actions menus
  var actionLists = all(".action-list");
  for (var i = 0; i < actionLists.length; i++) {
    actions = quickActions[i].actions;
    for (var j = 0; j < actions.length; j++) {
      actionLists[i].innerHTML += "<li class=\"action-list-item\"><a href=\"" + actions[j].url + "\">" + actions[j].label + "</a></li>"
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
                  // alert(curr[3]);
                 curr=curr.replace(curr[3],parseInt(curr[3]) - 1);
                  // alert(curr[3]);
                window.location.hash = $('#'+curr).children[0].rel;
                // alert( $('#'+curr).children[0].rel);
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
     if((inputFields[i].value!="" && inputFields[i].value!=null) && (inputFields[i+1].value=="" || inputFields[i+1].value==null)){
        inputFields[i+1].required=true;
        inputFields[i].required=true;

        inputFields[i+1].focus(function() {
            inputFields[i+1].css('color','red');

        });

        valid=0;
     }
    if((inputFields[i].value==="" || inputFields[i].value===null) && (inputFields[i+1].value!=="" && inputFields[i+1].value!==null)){
            inputFields[i].required=true;
            inputFields[i+1].required=true;
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
    createLocalStorage(currentTab,inputFields);

  }
  return ;
};

/// create localStorage and save the data from the form in it
var createLocalStorage = function(currentTab,inputs){

  localStorage.clear();
    var dataArr=[];
   var form = $('#'+currentTab+'-feildset-form');
  // check localStorage support
 if (localStorage) {
    for (var i = 0; i < inputs.length; i+=2) {
        // if(inputs[i]!=null && inputs[i]!=""){
         dataArr.push({
                    name: inputs[i].value,
                    nameKey: inputs[i].id,
                    url: inputs[i+1].value,
                    urlKey : inputs[i+1].id
                });
        }
      // }
    localStorage.setItem('formData', JSON.stringify(dataArr));
    // tryget=JSON.parse(localStorage.getItem('formData'));
    // alert(tryget[0].name);
    submitFormData(currentTab);

 }
else{
  console.log('ERROR: localStorage is not supported');
}  
}

var submitFormData=function(currentTab){

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
  // get the data from the local storage
  var data=JSON.parse(localStorage.getItem('formData'));
  if(data!=null && data!=undefined){

    // create options
    for(var i=0; i<data.length; i++){
            if(data[i].name!=='' && data[i].url!==''){

         var opt = document.createElement('option');
            
            opt.value = data[i].url;
            opt.innerHTML = data[i].name;
            linkList.appendChild(opt);
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
    $('#'+currentTab+'-links').classList.toggle('hidden');
    $('#'+currentTab +' .frame-content').classList.toggle('hidden');
    $('.expand').classList.toggle('hidden');
   }
}
}

var loadDataFromStorage=function(e){
  // var forms=document.getElementsByClassName("feildset-form")[0];
  var inputFields1=all('#quick-reports-feildset-form' +' .report-input');
  var inputFields2=all('#my-team-folders-feildset-form' +' .report-input');
   var data=JSON.parse(localStorage.getItem('formData'));
   if(data!=null && data!=undefined){
    
  for (var i = 0,j=0; i < inputFields.length; i+=2,j++) {

      inputFields1[i].value=data[j].name;
      inputFields1[i+1].value=data[j].url;
      inputFields2[i].value=data[j].name;
      inputFields2[i+1].value=data[j].url;
  }

}
submitFormData("quick-reports");
submitFormData("my-team-folders");
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




// on expand click
// document.getElementById("expand-url").addEventListener("click", setExpandLink);
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

