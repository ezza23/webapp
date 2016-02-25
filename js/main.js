
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
                 $(".notifications").innerHTML = res.notifications;
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
    getDataRequest: function(){

        UTILS.ajax('data/config.json');
      
    }
  };
}());




 function setExpandLink() {

     var el=document.getElementById("reports-links");

  $('#expand-url').href=el.options[el.selectedIndex].value;
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

var setActiveTab=function(){
  var tabsList =document.getElementsByClassName("tabs-links");
   var active=this.hash;

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == active) {
          x=tabsList[i].parentNode;
          x.className+=' active-tab';
        } else {
          x=tabsList[i].parentNode;
          x.className='tab';
        $(tabsList[i].hash).classList.add('hidden');
        }
      }
  
     $(active).classList.remove('hidden');



};

// on expand click
document.getElementById("expand-url").addEventListener("click", setExpandLink);
// on tab click
var tabs =document.getElementsByClassName("tabs-links");

for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", setActiveTab);
  };



//// read JSON file 

// var getDataRequest=function(){

//   ajax('data/config.json');
//     };
        //    ajax({

        //     url: 'data/config.json',
        //     dataType: "json"

        // })
        // .done(function (response) {
        //     if (response && response !== '') {
        //         $('.notifications').removeClass('hidden');
        //         $('.notifications').text(response.notification);
        //     }
        // });




function initialize () {
	document.getElementById("quickreports-setting").addEventListener('click',function(e){
  $("#quickreports-setting").classList.toggle('active-setting') ;
    $("#quickreports-feildset-form").classList.toggle('hidden');

});
document.getElementById("teamfolders-setting").addEventListener('click',function(e){
  $("#teamfolders-setting").classList.toggle('active-setting') ;
    $("#teamfolders-feildset-form").classList.toggle('hidden');
});

document.getElementById("quickreports-cancel").addEventListener('click',function(e){

   e.preventDefault();
   $('#quickreports-setting').click();

});

document.getElementById("teamfolders-cancel").addEventListener('click',function(e){
   e.preventDefault();
   $('#teamfolders-setting').click();

});


 UTILS.getDataRequest();


 };

window.onLoad = initialize();

