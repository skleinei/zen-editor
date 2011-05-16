/**
 * The main module
 * Background image by Dr. Motte
 *
 * @context page
 */
var $ = require('speakeasy/jquery').jQuery;
var DEFAULT_BACKGROUND_IMG = require('speakeasy/resources').getImageUrl(module, 'wallpaper.jpg');

$(document).ready(function() {
  if($("#wysiwyg").length > 0) {

    var ANIMATION_SPEED = 100;
    var EDITOR_WIDTH = 600;

    var intervalId = null;
    
    var resizeEditor = function() {
      $("#wysiwygTextarea_ifr")
        .css("height", ($(window).height() - 64) + "px")
        .css("width", EDITOR_WIDTH);
    };

    var showTitleToolbar = function(event) {
        $("#editor-precursor, #toolbar").animate({ "top" : "-28px" }, ANIMATION_SPEED );
    };

    var hideTitleToolbar = function(event) {
      if((event.pageY < 0) || (event.pageY >= 115) || (event.pageX < 0) || (event.pageX >= $(window).width())) {
        $("#editor-precursor, #toolbar").animate({ "top" : "-148px" }, ANIMATION_SPEED );
      }
    };

    var showSavePanel = function(event) {
      $("#savebar-container").animate({ "bottom" : "0px" }, ANIMATION_SPEED );
    };

    var hideSavePanel = function(event) {
      if(Confluence.Editor.currentEditMode === Confluence.Editor.MODE_RICHTEXT) {
        $("#savebar-container").animate({ "bottom" : "-76px" }, ANIMATION_SPEED );
      }
    };
    
    var addZen = function() {
      console.log("adding zen");
      $("body").addClass("zen-editor").css("background-image", "url('" + DEFAULT_BACKGROUND_IMG + "')");

      // init mouse over zones
      $("#wysiwyg").prepend("<div id='mo-top'></div>");
      $("#mo-top").bind("mouseover", showTitleToolbar);
      $("#editor-precursor, #toolbar").bind("mouseleave", hideTitleToolbar);
      $("#wysiwyg").append("<div id='mo-bottom'></div>");
      $("#mo-bottom").bind("mouseover", showSavePanel);
      $("#savebar-container").bind("mouseleave", hideSavePanel);

      // setup css
      $("#header, #editor-precursor, #toolbar").css("top", "-148px");
      $("#wysiwyg").css("top", "-146px");
      intervalId = setInterval(resizeEditor, 100);
    }
    
    var removeZen = function() {
      console.log("removing zen");
      $("body").removeClass("zen-editor");
      
      // remove mouseover zones
      $("#mo-top").remove();
      $("#mo-top").unbind("mouseover", showTitleToolbar);
      $("#editor-precursor, #toolbar").unbind("mouseleave", hideTitleToolbar);
      $("#mo-bottom").remove();
      $("#mo-bottom").unbind("mouseover", showSavePanel);
      $("#savebar-container").unbind("mouseleave", hideSavePanel);
      
      // reset css
      $("#header, #editor-precursor, #toolbar").css("top", "");
      $("#savebar-container").css("bottom", "");
      $("#wysiwyg").css("top", "");
      $("#wysiwygTextarea_ifr").css("width", "100%");
      clearInterval(intervalId);
    }


    // add ommmm toggle manually until we have an api for the toolbar
    $("#rte-toolbar .toolbar-split-left").append("<ul class='toolbar-group'><li id='zen-editor-toggle' class='toolbar-item'>" +
      "  <a title='Toggle Ommm mode' href='#' class='toolbar-trigger'>" +
      "    <span class='trigger-text'>Ommm</span>" +
      "  </a></li></ul>");

    $("#zen-editor-toggle").toggle(function() {
      $(this).addClass("active");
      
      $("#rte-button-preview").bind("click", removeZen);
      $("#rte-button-edit").bind("click", addZen);
      
      addZen();

    }, function() {
      $(this).removeClass("active");
      
      $("#rte-button-preview").unbind("click", removeZen);
      $("#rte-button-edit").unbind("click", addZen);

      removeZen();
    });

  }

});
