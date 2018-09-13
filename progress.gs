/**
 * Copyright Google LLC
 * Modifications copyright (C) 2018 gbosetti
 * (https://github.com/gbosetti)
 *
 * The content of this file was modified by gbosetti ( https://github.com/gbosetti ) 
 * It is an extension of the Progress bar add-on for Google Slides project 
 * ( https://github.com/gsuitedevs/apps-script-samples/tree/master/slides/progress 
 * commit 5444187e0e76ada8e15a4c22f856b75191538971 ),
 * explained in the Quickstart section of the G Suite team
 * ( https://developers.google.com/gsuite/add-ons/editors/slides/quickstart/progress-bar ).
 * This extended version improves the addon by allowing end users to customize 
 * the progress bar through a UI, and also adding page numbers in any of the 4 corners of the slides.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var presentation = SlidesApp.getActivePresentation();
var BAR_ID = 'progress_bar';
var BOX_ID = 'page_number';

function onInstall(e) {
  onOpen();
}

function onOpen(e) {
  SlidesApp.getUi().createAddonMenu()
      .addItem('Show editor', 'openEditor')
      .addToUi();
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 */
function openEditor(){
  var ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('Slides progress and numbers');
  SlidesApp.getUi().showSidebar(ui);
}

/**
 * Create the "progress bar" elements across all the slides in the document
 */
function createBars(barHeight, barColor, skipLatestSlides, bottomPosition) {
  deleteBars(); 
  
  var slides = presentation.getSlides();
  var numSlides = slides.length - skipLatestSlides;
      
  for (var i = 0; i < numSlides; ++i) {
    var ratioComplete = (i / (numSlides - 1));
    var x = 0;
    var y = bottomPosition=="true"? presentation.getPageHeight() - barHeight : 0;
    var barWidth = presentation.getPageWidth() * ratioComplete;
    
    if (barWidth > 2) {
      var bar = slides[i].insertShape(SlidesApp.ShapeType.RECTANGLE, x, y, barWidth, barHeight);
      bar.getFill().setSolidFill(barColor);
      bar.getBorder().setTransparent();
      bar.setLinkUrl(BAR_ID);
    }
  }
}

/**
 * Delete the "progress bar" elements across all the slides in the document
 */
function deleteBars() {
  var slides = presentation.getSlides();
  for (var i = 0; i < slides.length; ++i) {
    var elements = slides[i].getPageElements();
    for (var j = 0; j < elements.length; ++j) {
      var el = elements[j];
      if (el.getPageElementType() === SlidesApp.PageElementType.SHAPE && el.asShape().getLink() && el.asShape().getLink().getUrl() === BAR_ID) {
          el.remove();
      }
    }
  }
}

/**
 * Create the page number elements across all the slides in the document
 */
function createPageNumbers(fontColor, fontSize, boxHeight, boxWidth, skipLatestSlides, barPosition) {
  removePageNumbers();
  
  var boxFont = "Alegreya";
  var slides = presentation.getSlides();
  var boxX = barPosition.indexOf("right") != -1? presentation.getPageWidth() - boxWidth : boxWidth / 2;
  var boxY = barPosition.indexOf("Top") != -1? 0 : presentation.getPageHeight() - (boxHeight*2);
  var numSlides = slides.length - skipLatestSlides;
  
  for (var i = 1; i < numSlides; ++i) {
      
      var shape = slides[i].insertShape(SlidesApp.ShapeType.TEXT_BOX, boxX, boxY, boxWidth, boxHeight);
      shape.getText().setText(i+1);
      shape.getText().getTextStyle().setFontFamily(boxFont);
      shape.getText().getTextStyle().setFontSize(fontSize);
      shape.getText().getTextStyle().setForegroundColor(fontColor);
      shape.setLinkUrl(BOX_ID);
  }
}

/**
 * Removes the page number elements across all the slides in the document
 */
function removePageNumbers() {
  
  var slides = presentation.getSlides();
  for (var i = 0; i < slides.length; ++i) {
    var elements = slides[i].getPageElements();
    
    for (var j = 0; j < elements.length; ++j) {
      if (elements[j].getPageElementType() === SlidesApp.PageElementType.SHAPE &&
          elements[j].asShape().getLink() &&
          elements[j].asShape().getLink().getUrl() === BOX_ID) {
        elements[j].remove();
      }
    }
  }
}
