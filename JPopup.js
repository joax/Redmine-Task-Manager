// We don't want multiple instances of JPopup running 
// anywhere...

var JPopup = {
  // Big Popups are the ones that cover the whole
  // screen asking the user for a full response
  // on them.
  // Small Popups are the ones attached to a DOM
  // element and are displayed right beneath them
  // asking the user for an action. If the user
  // clicks outside of the box, the Popup just
  // dissapears and needs to be regenerated.
  bigPopup: false,

  // This is the holder of the popup DOM element
  div: null,

  // title:   title of the popup
  // text:    text displayed on the popup
  // actions: hash with all the possible
  //          actions that can be done:
  //          - Ok: Ok button
  //          - NOk: No Ok button
  //          - Input: Some input form
  set: function(params) {
    JPopup.div = JHtml.div('jpopup');
    JPopup.div.setAttribute( 'style', 
                      'border: 1px solid black; padding: 10px; position: absolute;' +
                      '-moz-box-shadow: 0px 0px 5px gray; -webkit-box-shadow: gray 0px 0px 5px;' + 
                      '-moz-border-radius: 5px; -webkit-border-radius: 5px;' +
                      'background-image: -moz-linear-gradient(top left, white, lightgray);' +
                      'background-image: -webkit-gradient(linear, left top, right bottom, from(white), to(lightgray));' +
                      'color: black;');
    JPopup.div.setAttribute('onclick', 'function clicked() { if(event) event.stopPropagation(); else e.stopPropagation(); }; clicked();');
    if(params.title) {
      var ptitle = JHtml.h2();
      ptitle.innerHTML = params.title;
      JPopup.div.appendChild(ptitle);
      var spacer = JHtml.space();
      JPopup.appendChild(spacer);
    }

    if(params.text) {
      var ptext = JHtml.span();
      ptext.innerHTML = params.text;
      JPopup.div.appendChild(ptext);
    }
   
    if(params.actions) {
      
      var middlediv = JHtml.div();
      middlediv.setAttribute('style', 'width: 100%; margin: 0px auto;');
      
      var bottomdiv = JHtml.div();
      bottomdiv.setAttribute('style', 'width: 100%; margin: 0px auto; text-align: right;');

      var spacer = JHtml.space();

      // And now the actions:
      if(params.actions.input) middlediv.appendChild(params.actions.input);
      if(params.actions.ok) bottomdiv.appendChild(params.actions.ok);
      if(params.actions.nook) bottomdiv.appendChild(params.actions.input);

      JPopup.div.appendChild(middlediv);
      JPopup.div.appendChild(spacer);
      JPopup.div.appendChild(bottomdiv);
    }

    window.addEventListener('click', function() { JPopup.reset(); }, false);

    document.body.appendChild(JPopup.div);
  },

  getPosition: function(who){
      var T= 0,L= 0;
      while(who){
          L+= who.offsetLeft;
          T+=who.style.position == 'relative' ? who.offsetTop : 0;
          T-=who.scrollTop;
          who= who.parentElement;
      }
      return { x: L, y: T};    
  },
  
  relateTo: function(obj) {
    var position = JPopup.getPosition(obj);
    var topY = position.y + obj.offsetHeight;
    var leftX = position.x + 
                  Math.floor(obj.offsetWidth / 2) + 
                  Math.floor(JPopup.div.offsetWidth / 2) + 
                  30;
    if(leftX + JPopup.div.offsetWidth > window.innerWidth) {
      leftX -= Math.floor(JPopup.div.offsetWidth / 2) + 30;  
    }
    
    JPopup.div.style.left = leftX + 'px';
    JPopup.div.style.top = topY + 'px';
  },

  reset: function() {
    if(JPopup.div) {
      document.body.removeChild(JPopup.div);
      JPopup.div = null;
      window.removeEventListener('click', function() { JPopup.reset();  }, false);
    }
  },

};
