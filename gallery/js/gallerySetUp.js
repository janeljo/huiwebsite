function initialize() {
  constructBasicSections();
  loadFirstSection();
  registerClickEvents();
}

function constructBasicSections() {
  var html = "";
  for (var i = 0; i < sectionData.length; i++) {
    html = html.concat(getSectionTemplate(sectionData[i].sectionName, i));
  }
  $("#gallery").html(html);
}

function getSectionTemplate(sectionName, id) {
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
   return html;
}

function loadFirstSection() {
  loadImages(0);
  updateCollapseGlyphicon($("#0").prev());
}

function registerClickEvents() {
  $(".header").click(function() {
    sectionRespondToClick($(this));
  });

  const GO_LEFT = -1
  const GO_RIGHT = 1
  $("#left").click(function() {
    switchToNeighborImage(GO_LEFT);
  });

  $("#right").click(function() {
    switchToNeighborImage(GO_RIGHT);
  });

}

function sectionRespondToClick(section) {
  var sectionId = section.next().attr("id");
  if (isLoadedAndShowing(sectionId)) {
    hideImage(sectionId);
  } else {
    loadImages(sectionId);
  }
  updateCollapseGlyphicon(section);
}

function isLoadedAndShowing(sectionId) {
  return containsImages(sectionId) && $("#" + sectionId).css("display") == "block";
}

function hideImage(sectionId) {
  $("#" + sectionId).css("display", "none");
}

function loadImages(sectionId) {
  if (!containsImages(sectionId)) {
    insertImage(sectionId);
  } else {
    showImage(sectionId);
  }
}

function containsImages(sectionId) {
  return $("#" + sectionId).html().trim() != "";
}

function insertImage(sectionId) {
  var html = ""
  var pictures = sectionData[sectionId].pictures;
  for (var i = 0; i < pictures.length; i++) {
    html = html.concat('<img src="' + pictures[i].src + '" order="' + i + '"/>');
  }
  var section = "#" + sectionId;
  $(section).html(html);

  $(section + " img").click(function() {
    $("#pic-modal").modal("show");
    newImageForModal(sectionId, $(this).attr("order"));
  });
}

function showImage(sectionId) {
  $("#" + sectionId).css("display", "block");
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

  $('.modal:visible').each(reposition);
}

function switchToNeighborImage(direction) {
  var order = parseInt($("#modal-pic").attr("order"));
  var nextOrder = order + direction;
  var sectionId = findID(order, $("#modal-pic").attr("src"));
  if (nextOrder >= 0 && nextOrder <= sectionData[sectionId].pictures.length - 1) {
    newImageForModal(sectionId, nextOrder);
  }
}

function findID(order, src) {
  for (var i = 0; i < sectionData.length; i++) {
    var pictures = sectionData[i].pictures;
    if (pictures.length > order) {
      if (pictures[order].src == src) {
        return i;
      }
    }
  }
  return -1;
}

function updateCollapseGlyphicon(object) {
  object.find("span").toggleClass("glyphicon-collapse-down");
  object.find("span").toggleClass("glyphicon-collapse-up");
}

function reposition() {
  var modal = $(this),
       dialog = $('.modal-dialog');
  modal.css('display', 'block');
  dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}
