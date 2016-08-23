var id = 0;

function initialize() {

  var html = "";
  for (var i = 0; i < sectionData.length; i++) {
    html = html.concat(getSectionTemplate(sectionData[i].sectionName));
  }
  $("#gallery").html(html);

  $(".header").click(function() {
    var header = $(this);
    var id = header.next().attr("id");
    if (isLoadedAndShowing(id)) {
      hideImage(id);
    } else {
      loadImages(id);
    }
    updateCollapseGlyphicon(header);
  });

  $("#left").click(function() {
    switchToNeighborImage(-1);
  });

  $("#right").click(function() {
    switchToNeighborImage(1);
  });
}


function getSectionTemplate(sectionName) {
  var html =
   '<div class="row row-eq-height">\
     <div class="col-sm-12">\
       <div class="header">\
         <p>' + sectionName + ' <span class="glyphicon glyphicon-collapse-down"></p>\
       </div>\
       <div class="content" id="' + id + '">\
       </div>\
     </div>\
   </div>';
   id ++;
   return html;
}

function loadImages(id) {
  if (!containsImages(id)) {
    insertImage(id);
  } else {
    showImage(id);
  }
}

function insertImage(id) {
  var html = ""
  var pictures = sectionData[id].pictures;
  for (var i = 0; i < pictures.length; i++) {
    html = html.concat('<img src="' + pictures[i] + '" order="' + i + '"/>');
  }
  $("#" + id).html(html);

  $(".content img").click(function() {
    newImageForModal(id, $(this).attr("order"));
    $("#pic-modal").modal("show");
  });
}

function hideImage(id) {
  $("#" + id).css("display", "none");
}

function showImage(id) {
  $("#" + id).css("display", "block");
}

function containsImages(id) {
  return $("#" + id).html().trim() != "";
}

function isLoadedAndShowing(id) {
  return containsImages(id) && $("#" + id).css("display") == "block";
}

function newImageForModal(id, order) {
  var picArray = sectionData[id].pictures;
  var imgSrc = picArray[order];
  $("#modal-pic").attr("src", imgSrc);
  $("#modal-pic").attr("order", order);

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
  var id = findID(order, $("#modal-pic").attr("src"));
  if (nextOrder >= 0 && nextOrder <= sectionData[id].pictures.length - 1) {
    newImageForModal(id, nextOrder);
  }
}

function updateCollapseGlyphicon(object) {
  object.find("span").toggleClass("glyphicon-collapse-down");
  object.find("span").toggleClass("glyphicon-collapse-up");
}

function findID(order, src) {
  for (var i = 0; i < sectionData.length; i++) {
    if (sectionData[i].pictures[order] == src) {
      return i;
    }
  }
  return -1;
}
