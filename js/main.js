
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
     if(el.options!=="undefined")
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

// activate the pressed tab
var setActiveTab=function(){
  var tabsList =document.getElementsByClassName("tabs-links");
  // current tab hash
   var active=this.hash;

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

var checkInputs=function(e){

  valid=1;
  currentTab=this.id;
  currentTab=currentTab.substr(0,currentTab.indexOf('-save'));
  var inputFields=all('#'+currentTab+'-feildset-form' +' .report-input');
  for (var i = 0; i < inputFields.length; i +=2) {
     if((inputFields[i].value!="" || inputFields[i].value!=null) && (inputFields[i+1].value=="" || inputFields[i+1].value==null)){
        inputFields[i+1].required=true;
        inputFields[i].required=true;
        inputFields[i+1].focus(function() {
            inputFields[i+1].css('color','red');
        });

        valid=0;
     }
    if((inputFields[i].value=="" || inputFields[i].value==null) && (inputFields[i+1].value!="" || inputFields[i+1].value!=null)){
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
 
  if(valid==1 && $(".setting-form").checkValidity())
  {
    createLocalStorage(currentTab,inputFields);

  }
  return ;
};

/// create localStorage and save the data from the form in it
var createLocalStorage = function(currentTab,inputs){
  //  var data=JSON.parse(localStorage.getItem('formData'));
  // if(data!=null && data!=undefined){
  //   // alert('hi');
  //   localStorage.removeItem('formData');
  // }
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
                    urlKey : inputs.id
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
    // update the frame and the expand icon url
    if(currentTab==="quick-reports")
     setQrFrameExpandURL();
   else
    setTfFrameURL();
    updateFrame();
    // hide setting form
     $('#quickreports-setting').click();
  }

}

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
	document.getElementById("quickreports-setting").addEventListener('click',function(e){
    // set the setting to be active (white background)
  $("#quickreports-setting").classList.toggle('active-setting') ;
    // show the feildset content
    $("#quick-reports-feildset-form").classList.toggle('hidden');
     document.getElementById("name1").focus();

});
  // my-team-folders setting button
document.getElementById("teamfolders-setting").addEventListener('click',function(e){
  // set the setting to be active (white background)
  $("#teamfolders-setting").classList.toggle('active-setting') ;
   // show the feildset content
    $("#my-team-folders-feildset-form").classList.toggle('hidden');
});

// quick reports setting cancel 
document.getElementById("quickreports-cancel").addEventListener('click',function(e){
   e.preventDefault();
   $('#quickreports-setting').click();

});
// my team folders setting cancel 
document.getElementById("teamfolders-cancel").addEventListener('click',function(e){
   e.preventDefault();
   $('#teamfolders-setting').click();

});



// get notifications
 UTILS.getDataRequest();


 };

window.onLoad = initialize();

