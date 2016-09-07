var sectionCounter = 0;

function initialize() {

  var html = "";
  for (var i = 0; i < sectionData.length; i++) {
    html = html.concat(getSectionTemplate(sectionData[i].sectionName));
  }
  $("#gallery").html(html);

  loadSection($("#0").prev());

  $(".header").click(function() {
    loadSection($(this));
  });

  $("#left").click(function() {
    switchToNeighborImage(-1);
  });

  $("#right").click(function() {
    switchToNeighborImage(1);
  });
}

function loadSection(section) {
  var header = section;
  var sectionId = header.next().attr("id");
  if (isLoadedAndShowing(sectionId)) {
    hideImage(sectionId);
  } else {
    loadImages(sectionId);
  }
  updateCollapseGlyphicon(header);
}


function getSectionTemplate(sectionName) {
  var html =
   '<div class="row row-eq-height">\
     <div class="col-sm-12">\
       <div class="header">\
         <p>' + sectionName + ' <span class="glyphicon glyphicon-collapse-down"></p>\
       </div>\
       <div class="content" id="' + sectionCounter + '">\
       </div>\
     </div>\
   </div>';
   sectionCounter ++;
   return html;
}

function loadImages(sectionId) {
  if (!containsImages(sectionId)) {
    insertImage(sectionId);
  } else {
    showImage(sectionId);
  }
}

function insertImage(sectionId) {
  var html = ""
  var pictures = sectionData[sectionId].pictures;
  for (var i = 0; i < pictures.length; i++) {
    html = html.concat('<img src="' + pictures[i].src + '" order="' + i + '"/>');
  }
  $("#" + sectionId).html(html);

  $("#" + sectionId + " img").click(function() {
    newImageForModal(sectionId, $(this).attr("order"));
    $("#pic-modal").modal("show");
  });
}

function hideImage(sectionId) {
  $("#" + sectionId).css("display", "none");
}

function showImage(sectionId) {
  $("#" + sectionId).css("display", "block");
}

function containsImages(sectionId) {
  return $("#" + sectionId).html().trim() != "";
}

function isLoadedAndShowing(sectionId) {
  return containsImages(sectionId) && $("#" + sectionId).css("display") == "block";
}

function newImageForModal(sectionId, order) {
  var picArray = sectionData[sectionId].pictures;
  var imgSrc = picArray[order].src;
  var imgCaption = picArray[order].caption;

  $("#modal-pic").attr("src", imgSrc);
  $("#modal-pic").attr("order", order);
  $("#picture-caption").text(imgCaption);

  if (order == 0) {
    $("#left").css("color", "#a6a6a6");
  } else {
    $("#left").css("color", "black");
  }

  if (order == picArray.length - 1) {
    $("#right").css("color", "#a6a6a6");
  } else {
    $("#right").css("color", "black");
  }
}

function switchToNeighborImage(direction) {
  var order = parseInt($("#modal-pic").attr("order"));
  var nextOrder = order + direction;
  var sectionId = findID(order, $("#modal-pic").attr("src"));
  if (nextOrder >= 0 && nextOrder <= sectionData[sectionId].pictures.length - 1) {
    newImageForModal(sectionId, nextOrder);
  }
  $('.modal:visible').each(reposition);
}

function updateCollapseGlyphicon(object) {
  object.find("span").toggleClass("glyphicon-collapse-down");
  object.find("span").toggleClass("glyphicon-collapse-up");
}

function findID(order, src) {
  for (var i = 0; i < sectionData.length; i++) {
    if (sectionData[i].pictures[order].src == src) {
      return i;
    }
  }
  return -1;
}
