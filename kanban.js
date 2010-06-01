var sortLists = [];
var sortListsTemplates = [];
var sortListsDificulty = [];
var sortProject = 'projects/data-products/';
var sortBaseUrl = 'https://wiki.borderstylo.com/';
var sortMe = 0;

var configHeight = 600;
var configNumberLists = 3;

var filtersList = [];

var TPriority = {
  code: function(value) {
    for(var i=0;i<TPriority.list.length;i++) {
      if(value == TPriority.list[i][0]) {
        return TPriority.list[i][1];  
      }  
    }  
  },

  decode: function(value) {
    for(var i=0;i<TPriority.list.length;i++) {
      if(value == TPriority.list[i][1]) {
        return TPriority.list[i][0];  
      }  
    }  
  },

  list: [],

};

var TCategory = {
  code: function(value) {
    for(var i=0;i<TCategory.list.length;i++) {
      if(value == TCategory.list[i][0]) {
        return TCategory.list[i][1];  
      }  
    }  
  },

  decode: function(value) {
    for(var i=0;i<TCategory.list.length;i++) {
      if(value == TCategory.list[i][1]) {
        return TCategory.list[i][0];  
      }  
    }  
  },

 list: [],

};

var TVersion = {
  code: function(value) {
    for(var i=0;i<TVersion.list.length;i++) {
      if(value == TVersion.list[i][0]) {
        return TVersion.list[i][1];  
      }  
    }  
  },

  decode: function(value) {
    for(var i=0;i<TVersion.list.length;i++) {
      if(value == TVersion.list[i][1]) {
        return TVersion.list[i][0];  
      }  
    }  
  },

 list: [],

};

var TTracker = {
  code: function(value) {
    for(var i=0;i<TTracker.list.length;i++) {
      if(value == TTracker.list[i][0]) {
        return TTracker.list[i][1];  
      }  
    }  
  },
  
  decode: function(value) {
    for(var i=0;i<TTracker.list.length;i++) {
      if(value == TTracker.list[i][1]) {
        return TTracker.list[i][0];  
      }  
    }  
  },


  list: [
    ['Bug',1],
    ['Feature',2],
    ['Support',3],
    ['Task',4]
  ],
};

var TStatus = {

  code: function(value) {
    for(var i=0;i<TStatus.list.length;i++) {
      if(value == TStatus.list[i][0]) {
        return TStatus.list[i][1];  
      }
    }
    return -1;
  },

  decode: function(value) {
    for(var i=0;i<TStatus.list.length;i++) {
      if(value == TStatus.list[i][1]) {
        return TStatus.list[i][0];  
      }
    }
    return -1;
  },

  list: [
    ['New',1],
    ['In Progress', 2],
    ['Fixed', 3],
    ['Feedback', 4],
    ['Closed', 5],
    ['Rejected', 6],
    ['Deferred', 7],
    ['Pushed', 8],
    ['Accepted', 9],
    ['Failing', 10],
    ],

  NEW: 1,
  IN_PROGRESS: 2,
  FIXED: 3,
  FEEDBACK: 4,
  CLOSED: 5,
  REJECTED: 6,
  DEFERRED: 7,
  PUSHED: 8,
  ACCEPTED: 9,
  FAILING: 10,
};

var Colors = {
   red: "#ffd0d0",
   green: "#d0FFd0",
   blue: "#d0d0FF",
   white: "#ffffff",

   list: ['#FF5050','#ffd0a0','#50FF50','#d0ffd0','#5050FF','#d0d0ff','#f0f0f0','#ffffff'],
 };

var iframesLoaded = [];

var JInterface = {

  serializePreferences: function(arrayT) {
    var str = arrayT[0].join("^#^");
    for(var i = 1; i<arrayT.length; i++) {
      var list = arrayT[i][0];
      for(var j=1; j<arrayT[i].length; j++) {
        list += '^#^' + arrayT[i][j];
      }
      str += '$#$' + list;
    }
    return str;
  },

  unserializePreferences: function(str) {
    var parts = str.split('$#$');
    var arrayT = [];
    for(var i=0;i<parts.length;i++) {
       arrayT[i] = parts[i].split("^#^");
    }
    return arrayT;
  },

  storePreferences: function() {
    SortList.createCookie('RedmineTasker', JInterface.serializePreferences(sortLists), 10);
  },

  retrievePreferences: function() {
    var arrayP = SortList.readCookie('RedmineTasker');
    if(arrayP && arrayP.length > 0) {
      sortLists = JInterface.unserializePreferences(arrayP);
      if(sortLists.length > 0) {
        for(var i=0; i<sortLists.length;i++) {
          sortListsTemplates[sortListsTemplates.length] = [];  
        }  
      }
    }
  },

  getURL: function() {
    var str = new String(document.location);
    if(str.indexOf('projects') != -1) {
      var parts = str.split('projects');
      sortBaseURL = parts[0];
      var project = parts[1].split('/');
      sortProject = 'projects/' + project[1] + '/';
    }
  },

  menuContent: function(id, width) {
    var m = JHtml.div(id + '_list_layer',
                      'display: none; width: ' + width + '; margin: 0px auto; ' + 
                      'padding: 10px; padding-top: 0px');
    return m;
  },

  menuCanvas: function(id, width) {
    var m = JHtml.div(id,
                      'float: left;' +
                      'border: 1px solid #c0c0c0; margin: 5px;' + 
                      'margin-top: 10px; margin-bottom: 10px; ' + 
                      'width: ' + width + '; background-color: #ffffff;');
    return m;
  },

  menuTitle: function(title, obj) {
    var sectionTitle = JHtml.div('',
                            'width: 99%; font-size: 15px; font-weight: bold; ' + 
                            'text-align: center; margin-top: 5px; margin-bottom: 5px;');
    sectionTitle.innerHTML = title;
    var closeButton = JHtml.div('',
                            'border: 1px solid #606060; background-color: #d0d0d0; ' + 
                            'margin: 2px; width: 12px; height: 12px; float: right; ' + 
                            'cursor: pointer; -moz-box-shadow: 2px 2px 2px #c0c0c0;');
    closeButton.setAttribute('onclick',
                            "$('" + obj.id + "_bottom_layer').style.display=$('" + 
                            obj.id + "_bottom_layer').style.display == '' ? Effect.SlideUp('" + obj.id + "_bottom_layer') : Effect.SlideDown('" + obj.id + "_bottom_layer'); " + 
                            "$('" + obj.id + "_list_layer').style.display = $('" 
                            + obj.id + "_list_layer').style.display == '' ? Effect.SlideUp('" + obj.id + "_list_layer') : Effect.SlideDown('" + obj.id + "_list_layer');");
    obj.appendChild(sectionTitle);
    sectionTitle.appendChild(closeButton);
    return obj;
  },

  menuBottom: function(button, obj) {
    var bottomLayer     = JHtml.div(obj.id + '_bottom_layer',
                            'display: none; width: 90%; margin: 10px; text-align: center;');
    bottomLayer.appendChild(button);
    obj.appendChild(bottomLayer);
    return obj;
  },

  menu: function() {
    var menu      = JHtml.div('menu_jhtml',
                            'width: 1000px; margin: 0px auto; padding: 10px;');
    
    var menuList  = JInterface.menuCanvas('menu_filters','380px');
    var menuAdd   = JInterface.menuCanvas('menu_add','440px');
    var menuSpeed = JInterface.menuCanvas('menu_canvas','200px');
    
    var menuFilterList  = JInterface.menuContent(menuList.id, '80%');
    var menuAddList     = JInterface.menuContent(menuAdd.id, '95%');
    var menuSpeedList   = JInterface.menuContent(menuSpeed.id, '95%');

    menuAdd = JInterface.menuTitle('Add Task',menuAdd);
    menuList = JInterface.menuTitle('Tasks Filters',menuList);
    menuSpeed = JInterface.menuTitle('Speed',menuSpeed);
  
    for(var j=0;j<sortLists.length;j++) {
      var speedC  = JHtml.div('',
                          'float: left; margin: 2px; height: 20px; width: 20px;' + 
                          'font-size: 18px; font-weight: bold');
      speedC.innerHTML = sortListsDificulty[j];
      menuSpeedList.appendChild(speedC);
    }

    for(var i=0;i<filtersList.length;i++) {
      var menuFilterLayer = JHtml.div('','width: 99%;');
      var menuFilter = JHtml.checkbox('filter_check_' + i);
      menuFilter.setAttribute('value',filtersList[i][1]);
      var menuFilterLabel = JHtml.label('filter_check_' + i);
      menuFilterLabel.innerHTML = filtersList[i][0];
      menuFilterLayer.appendChild(menuFilter);
      menuFilterLayer.appendChild(menuFilterLabel);
      menuFilterList.appendChild(menuFilterLayer);
    }

    TGrabber.getEnvironmentVars(menuAddList.id);

    menuList.appendChild(menuFilterList);
    menuAdd.appendChild(menuAddList);
    menuSpeed.appendChild(menuSpeedList);

    if($('menu_jhtml')) {
       $('menu_jhtml').parentNode.removeChild($('menu_jhtml'));
    }

    var executeButton   = JHtml.button('','Save Changes','JInterface.calculateOptions()');
    var addTicketButton = JHtml.button('', 'Add Task', 'JInterface.addTask()');
    var speedButton     = JHtml.span('','');

    menuAdd     = JInterface.menuBottom(addTicketButton, menuAdd);
    menuList    = JInterface.menuBottom(executeButton, menuList);
    menuSpeed   = JInterface.menuBottom(speedButton, menuSpeed);

    menu.appendChild(menuList);
    menu.appendChild(menuAdd);
//    menu.appendChild(menuSpeed);
    
    if($('content').childNodes.length == 0)
      $('content').appendChild(menu);
    else
      $('content').insertBefore(menu, $('content').childNodes[0]);
  },

  addTask: function() {
    var tracker = document.getElementById('task-add-tracker').value;
    var version_id = document.getElementById('task-add-version').value;
    var category_id = document.getElementById('task-add-category').value;
    var title = document.getElementById('task-add-name').value;
 
    TGrabber.createTask(tracker, title, version_id, category_id, 1, 1, '', '', 4, '');

    $('menu_add_list_layer').innerHTML = '';
    $('menu_add_list_layer').appendChild(SortList.renderAddTask());
    $('menu_add_list_layer').style.display = 'none';
    $('menu_add_bottom_layer').style.display = 'none';
  },

  calculateOptions: function() {
    
    var newList = [];
    for(var i=0;i<filtersList.length;i++) {
      if($('filter_check_' + i).checked) {
        newList[newList.length] = [filtersList[i][1], Colors.white, filtersList[i][0]];
      }
    }
    if(newList.length > 0) {
      sortLists = newList;
      JInterface.storePreferences();
    }
    JInterface.init(configHeight);
  },

  init: function(height) {
    JInterface.clean();
    JInterface.getURL();
    JInterface.retrievePreferences();
    configHeight = height; 
    TGrabber.getFilters();
  },

  clean: function() {
    if($('listsContainer')) {
      $('listsContainer').innerHTML = '';
    }
    sortLists = [];
    sortListsTemplates = [];
    sortListsDificulty = [];
  },

  start: function() {
    
    JInterface.preparePage(); 
    JInterface.menu();
    var filtersDisplay = [];
    var counter = 0;
    if(sortLists.length == 0) {
      for(var i=0;i<filtersList.length;i++) {
        if(counter < configNumberLists) {
          filtersDisplay[filtersDisplay.length] = [filtersList[i][1], Colors.white, filtersList[i][0]];
          counter+=1;
        }
      }
    } else {
      for(var i=0;i<sortLists.length;i++){
        filtersDisplay[filtersDisplay.length] = [sortLists[i][0], sortLists[i][1], sortLists[i][2]];
      }
    }
    SortList.init(filtersDisplay);
  },

  detectMe: function() {
    var logged = document.getElementById('loggedas').getElementsByTagName('a');
    var url = logged[0].href.split('/');
    sortMe = url[4];
  },

  preparePage : function() {
    $('header').style.display = 'none';
    $('sidebar').style.display = 'none';
    $('content').style.width = '99%';
    $('content').style.margin = '0px auto';
    $('content').style.paddingRight = '0px';
    $('content').style.paddingLeft = '0px';
    $('content').style.background = '#f0f0f0';
    JInterface.detectMe();
    var attachments = document.getElementsByTagName('div'); 
    for(var i=0;i<attachments.length;i++) { 
      if (attachments[i].className == 'attachments') { attachments[i].style.display = 'none'; } 
    }
    $('wiki_add_attachment').style.display = 'none';
    for(var i =0; i<document.getElementsByTagName('P').length;i++) {
      if(document.getElementsByTagName('P')[i].className == 'other-formats') {
        document.getElementsByTagName('P')[i].style.display =  'none';
      }
    } 
    for(var i=0; i<$('main').getElementsByTagName('DIV').length; i++) {  
      if($('main').getElementsByTagName('DIV')[i].className == 'contextual')
        $('main').getElementsByTagName('DIV')[i].style.display = 'none';
    }
  },
 
}

/*
 * This is the orginial function from Stuart Langridge at http://www.kryogenix.org/
 */
 
/*
 * This is the update function from Jeff Minard - http://www.jrm.cc/
 */

/*
 * This an adapted version from Joaquin Ayuso de Paul at http://www.borderstylo.com/
 */
var JTextile = {
  superTextile: function(s) {

    var r = s;
    // quick tags first
    qtags = [['\\*', 'strong'],
             ['\\?\\?', 'cite'],
             ['\\+', 'ins'],  //fixed
             ['~', 'sub'],   
             ['\\^', 'sup'], // me
             ['@', 'code']];
    for (var i=0;i<qtags.length;i++) {
        ttag = qtags[i][0]; htag = qtags[i][1];
        re = new RegExp(ttag+'\\b(.+?)\\b'+ttag,'g');
        r = r.replace(re,'<'+htag+'>'+'$1'+'</'+htag+'>');
    }
    // underscores count as part of a word, so do them separately
    re = new RegExp('\\b_(.+?)_\\b','g');
    r = r.replace(re,'<em>$1</em>');
  
    //jeff: so do dashes
    re = new RegExp('[\s\n]-(.+?)-[\s\n]','g');
    r = r.replace(re,'<del>$1</del>');
 
    // links
    re = new RegExp('"\\b(.+?)\\(\\b(.+?)\\b\\)":([^\\s]+)','g');
    r = r.replace(re,'<a href="$3" title="$2">$1</a>');
    re = new RegExp('"\\b(.+?)\\b":([^\\s]+)','g');
    r = r.replace(re,'<a href="$2">$1</a>');
 
    // images
    re = new RegExp('!\\b(.+?)\\(\\b(.+?)\\b\\)!','g');
    r = r.replace(re,'<img src="$1" alt="$2">');
    re = new RegExp('!\\b(.+?)\\b!','g');
    r = r.replace(re,'<img src="$1">');
    
    // block level formatting
  
    // Jeff's hack to show single line breaks as they should.
    // insert breaks - but you get some....stupid ones
      re = new RegExp('(.*)\n([^#\*\n].*)','g');
      r = r.replace(re,'$1<br />$2');
    // remove the stupid breaks.
      re = new RegExp('\n<br />','g');
      r = r.replace(re,'\n');
  
    lines = r.split('\n');
    nr = '';
    for (var i=0;i<lines.length;i++) {
        line = lines[i].replace(/\s*$/,'');
        changed = 0;
        if (line.search(/^\s*bq\.\s+/) != -1) { 
      line = line.replace(/^\s*bq\.\s+/,'\t<blockquote>')+'</blockquote>'; 
      changed = 1; 
    }
    
    // jeff adds h#.
        if (line.search(/^\s*h[1|2|3|4|5|6]\.\s+/) != -1) { 
        re = new RegExp('h([1|2|3|4|5|6])\.(.+)','g');
        line = line.replace(re,'<h$1>$2</h$1>');
      changed = 1; 
    }
    
    if (line.search(/^\s*\*\s+/) != -1) { line = line.replace(/^\s*\*\s+/,'\t<liu>') + '</liu>'; changed = 1; } 
        // * for bullet list; make up an liu tag to be fixed later
        if (line.search(/^\s*#\s+/) != -1) { line = line.replace(/^\s*#\s+/,'\t<lio>') + '</lio>'; changed = 1; } 
          // # for numeric list; make up an lio tag to be fixed later
        if (!changed && (line.replace(/\s/g,'').length > 0)) line = '<p>'+line+'</p>';
        lines[i] = line + '\n';
    }
  
    // Second pass to do lists
    inlist = 0; 
    listtype = '';
    for (var i=0;i<lines.length;i++) {
        line = lines[i];
        if (inlist && listtype == 'ul' && !line.match(/^\t<liu/)) { line = '</ul>\n' + line; inlist = 0; }
        if (inlist && listtype == 'ol' && !line.match(/^\t<lio/)) { line = '</ol>\n' + line; inlist = 0; }
        if (!inlist && line.match(/^\t<liu/)) { line = '<ul>' + line; inlist = 1; listtype = 'ul'; }
        if (!inlist && line.match(/^\t<lio/)) { line = '<ol>' + line; inlist = 1; listtype = 'ol'; }
        lines[i] = line;
    }
 
    r = lines.join('\n');
    // jeff added : will correctly replace <li(o|u)> AND </li(o|u)>
    r = r.replace(/li[o|u]>/g,'li>');
 
    return r;
  },

  textile2html: function(str) {
    var con = JTextile.superTextile(str);
    return con;
  },
};

var JHtml = {
 
  createElement: function(elem) {
    return document.createElement(elem);
  },

  div: function(id, style) {
    var d = JHtml.createElement('div');
    d.setAttribute('id',id);
    d.setAttribute('style',style);
    return d;
  },

  span: function() {
    return JHtml.createElement('SPAN');
  },

  h1: function() {
    return JHtml.createElement('H1');
  },
  
  a: function() {
    return JHtml.createElement('A');
  },

  p: function() {
    return JHtml.createElement('P');
  },

  label: function(forWho) {
    var l = JHtml.createElement('LABEL');
    l.setAttribute('for',forWho);
    return l;
  },

  td: function() {
    return JHtml.createElement('TD');
  },

  tr: function() {
    return JHtml.createElement('TR');
  },

  table: function() {
    return JHtml.createElement('TABLE');
  },

  textbox: function(id, width, value) {
    var t = JHtml.createElement('INPUT')
    t.setAttribute('type','textbox');
    t.setAttribute('style','border: 1px solid #c0c0c0; width: ' + width + ';');
    t.setAttribute('onfocus','this.style.border = "1px solid #606060";');
    t.setAttribute('onblur','this.style.border = "1px solid #c0c0c0";');
    t.setAttribute('id',id);
    t.setAttribute('name',name);
    t.setAttribute('value',value);
    return t;
  },

  checkbox: function(id) {
    var c = JHtml.createElement('INPUT');
    c.setAttribute('type','checkbox');
    c.setAttribute('id',id);
    return c;
  },

  select: function(id, onchange) {
    var s = JHtml.createElement('SELECT');
    s.setAttribute('id',id);
    s.setAttribute('name',id);
    s.setAttribute('onchange',onchange);
    return s;
  },

  option: function(value, content) {
    var o = JHtml.createElement('OPTION');
    o.setAttribute('value',value);
    o.innerHTML = content;
    return o;
  },

  button: function(id, value, onclick) {
    var c = JHtml.createElement('INPUT');
    c.setAttribute('type','button');
    c.setAttribute('value',value);
    c.setAttribute('id',id);
    c.setAttribute('name',id);
    c.setAttribute('onclick',onclick);
    return c;
  },

  space: function() {
    var s = JHtml.div('','width: 100%; height: 12px; font-size: 12px;');
    s.innerHTML = '&nbsp;';
    return s;
  },

  divDif: function(id, style) {
    var d = JHtml.createElement('DIV');
    d.setAttribute('id',id);
    d.setAttribute('style',style);
    return d;
  },
 
  redButton: function(value, onclick) {
    var gb = JHtml.styledButton('#885050', '#aa7070', '#ffffff', '#ffffff', '#806060');
    gb.innerHTML = value;
    gb.setAttribute('onclick', onclick);
    return gb;
  },

  greenButton: function(value, onclick) {
    var gb = JHtml.styledButton('#508850', '#70aa70', '#ffffff', '#ffffff', '#608060');
    gb.innerHTML = value;
    gb.setAttribute('onclick', onclick);
    return gb;
  },

  greyButton: function(value, onclick) {
    var gb = JHtml.styledButton('#a0a0a0', '#d0d0d0', '#ffffff', '#ffffff', '#808080');
    gb.innerHTML = value;
    gb.setAttribute('onclick', onclick);
    return gb;
  },

  styledButton: function(bcolor, hbcolor, fcolor, hfcolor, border) {
    var b = JHtml.createElement('SPAN');
    b.setAttribute('style',
             'font-size: 11px; color: ' + fcolor + '; background-color: ' + bcolor + '; ' + 
             'border: 1px solid ' + border + '; padding: 0 5px 0 5px; ' + 
             '-moz-border-radius: 5px 5px 5px 5px; ' + 
             '-webkit-border-radius: 5px 5px 5px 5px; ' + 
             '-moz-box-shadow: 0px 10px 10px ' + border + ' inset; margin-left: 3px;' + 
             '-webkit-box-shadow: 0px 10px 10px ' + border + ' inset;');
    b.setAttribute('onmouseover',
              "this.style.background = '" + hbcolor + "'; " + 
              "this.style.color = '" + hfcolor + "';");
    b.setAttribute('onmouseout',
              "this.style.background = '" + bcolor + "'; " + 
              "this.style.color = '" + fcolor + "';");
    return b;
  },

  propertyLabel: function(label) {
    var p = JHtml.div('','float:left; width: 30%;text-align: right; padding-right: 4px; font-weight: bold;');
    p.innerHTML = label;
    return p;
  },

  propertyContent: function(content) {
    var p = JHtml.div('','float: right; width: 65%;');
    p.innerHTML = content;
    return p;
  },

  iframe: function(id, src, onload) {
    var i =  JHtml.createElement('IFRAME');
    i.setAttribute('id',id);
    i.setAttribute('src',src);
    i.setAttribute("style","border: 0px; height: 0px; width: 10%;");
    i.setAttribute('onload', onload);
    return i;
  },
};

var TGrabber = {

  // ---------------------- Iframes management -----------------------

  setIframe: function(url, onload) {
    if(url.indexOf('?') != -1) {
      url += '&_=' + Math.random();
    } else {
      url += '?_=' + Math.random();  
    }
    var iframe = JHtml.iframe('iframe' + Math.random(), url, onload);
    document.body.appendChild(iframe);

    iframesLoaded[iframesLoaded.length] = iframe.id;
  },
 
  garbageCollectOne: function(obj) {
    var iframes = document.getElementsByTagName('iframe');
    for(var i=0;i<iframes.length;i++) {
      if(iframes[i].id == obj.id)
        document.body.removeChild(iframes[i]);
    }
  },

  garbageCollect: function() {
     var iframes = document.getElementsByTagName('iframe');
     for(var i=0; i<iframes.length; i++) {
       for(var j=0; j<iframesLoaded.length; j++) {
         if(iframesLoaded[j] == iframes[i].id) {
           document.body.removeChild(iframes[i]);
           iframesLoaded[j] = null;
         }
       }
     }
  },

  // --------------------- Worker methods -----------------------------

  grabFilters: function(iframe) {
    var filters = [];
    var content = iframe.contentWindow.document.getElementById('sidebar');
    var afterTitle = false;
    for(var i=0;i<content.childNodes.length;i++) {
      if(content.childNodes[i].tagName == 'H3' && content.childNodes[i].innerHTML == 'Custom queries') {
        afterTitle = true; 
      }
      if(afterTitle && content.childNodes[i].tagName == 'A') {
        filters[filters.length] = [content.childNodes[i].innerHTML, content.childNodes[i].href];
      }
    }
    filtersList = filters;
    TGrabber.garbageCollectOne(iframe);
  },

  waitFilters: function() {
    if(filtersList.length == 0) {
      setTimeout('TGrabber.waitFilters()',1000);
    } else {
      JInterface.start();
    }
  },

  // ------------- Template information --------------------------------

  grabVars: function(iframe, container) {
    var c           = iframe.contentWindow.document;
    var trackers    = c.getElementById(TGrabber.issueTrackerId).getElementsByTagName('option');
    var statuses    = c.getElementById(TGrabber.issueStatusId).getElementsByTagName('option');
    var priorities  = c.getElementById(TGrabber.issuePriorityId).getElementsByTagName('option');
    var categories  = c.getElementById(TGrabber.issueCategoryId).getElementsByTagName('option');
    var versions    = c.getElementById(TGrabber.issueTargetVersion).getElementsByTagName('option');
  
    for(var i=0;i<trackers.length;i++) {
      TTracker.list[i] = [trackers[i].innerHTML, trackers[i].value];  
    }

    for(var i=0;i<categories.length;i++) {
      TCategory.list[i] = [categories[i].innerHTML, categories[i].value];  
    }

    for(var i=0;i<versions.length;i++) {
      TVersion.list[i] = [versions[i].innerHTML, versions[i].value];  
    }
    
    for(var i=0;i<statuses.length;i++) {
      TStatus.list[i] = [statuses[i].innerHTML, statuses[i].value];  
    }

    for(var i=0;i<priorities.length;i++) {
      TPriority.list[i] = [priorities[i].innerHTML, priorities[i].value];  
    }

    $(container).appendChild(SortList.renderAddTask());
  },

  grabListTemplate: function(iframe) {
    var template = [];
    var rows = iframe.contentWindow.document.getElementById('filters').getElementsByTagName('table')[0].getElementsByTagName('table')[0].getElementsByTagName('tr');
    for(var e=0;e<rows.length;e++) {
      if(rows[e].style.display != 'none') {
        var name = rows[e].id.split('tr_')[1];
        var field = iframe.contentWindow.document.getElementById('values_' + name);
        if(field.multiple == true) {
          var value = [];
          for(var i=0; i<field.options.length;i++) {
            if(field.options[i].selected)
              value.push(field.options[i].value)
          }
        } else {
          var value = [field.value];
        }
        template[template.length] = [name, value];
      } 
    }
    for(var s=0; s<sortLists.length;s++) {
      if(iframe.src.indexOf(sortLists[s][0]) != -1) {
        sortListsTemplates[s] = template;
      }
    }
  },

  // ------------- Ticket visualization --------------------------------

  grabFullTicket: function(iframe, container) {
    var c               = iframe.contentWindow.document;
    var tracker_id      = c.getElementById(TGrabber.issueTrackerId).value;
    var status_id       = c.getElementById(TGrabber.issueStatusId).value;
    var subject         = c.getElementById(TGrabber.issueSubject).value;
    var description     = c.getElementById(TGrabber.issueDescription).value;
    var priority_id     = c.getElementById(TGrabber.issuePriorityId).value;
    var category_id     = c.getElementById(TGrabber.issueCategoryId).value;
    var assigned_to     = c.getElementById(TGrabber.issueAssignedTo).value; 
    var target_version  = c.getElementById(TGrabber.issueTargetVersion).value;
    var start_date      = c.getElementById(TGrabber.issueStartDate).value;
    var due_date        = c.getElementById(TGrabber.issueDueDate).value;
    var hours           = c.getElementById(TGrabber.issueEstimatedHours).value;
    var done_ratio      = c.getElementById(TGrabber.issueDoneRatio).value;
    var dificulty       = c.getElementById(TGrabber.issueDificulty).value;

    $(container).innerHTML = '';
    $(container).appendChild(SortList.renderFullTask( {
        trackerId: tracker_id,
        statusId: status_id,
        subject: subject,
        description: description,
        priorityId: priority_id,
        categoryId: category_id,
        assignedTo: assigned_to,
        targetVersion: target_version,
        startDate: start_date,
        dueDate: due_date,
        hours: hours,
        doneRatio: done_ratio,
        dificulty: dificulty
      } ));
  },

  // ------------- Ticket modification ---------------------------------

  issueForm: 'issue-form',
  issueTrackerId: 'issue_tracker_id',
  issueSubject: 'issue_subject',
  issueDescription: 'issue_description',
  issueStatusId: 'issue_status_id',
  issuePriorityId: 'issue_priority_id',
  issueAssignedTo: 'issue_assigned_to_id',
  issueCategoryId: 'issue_category_id',
  issueTargetVersion: 'issue_fixed_version_id',
  issueStartDate: 'issue_start_date',
  issueDueDate: 'issue_due_date',
  issueEstimatedHours: 'issue_estimated_hours',
  issueDoneRatio: 'issue_done_ratio',
  issueDificulty: 'issue_custom_field_values_3',
  issueNotes: 'notes',
  
  addTicketSetValues: function(iframe, status_id, title, tracker, target_version, category, priority,  dificulty, hours, notes) {
    iframe.contentWindow.document.getElementById(TGrabber.issueTrackerId).value = tracker;
    iframe.contentWindow.document.getElementById(TGrabber.issueStatusId).value = status_id;
    iframe.contentWindow.document.getElementById(TGrabber.issueSubject).value = title;
    if(priority) iframe.contentWindow.document.getElementById(TGrabber.issuePriorityId).value = priority;
    if(notes) iframe.contentWindow.document.getElementById(TGrabber.issueDescription).value = notes;
    if(target_version) iframe.contentWindow.document.getElementById(TGrabber.issueTargetVersion).value = target_version;
    if(hours) iframe.contentWindow.document.getElementById(TGrabber.issueEstimatedHours).value = hours;
    if(category) iframe.contentWindow.document.getElementById(TGrabber.issueCategoryId).value = category;
    if(dificulty) iframe.contentWindow.document.getElementById(TGrabber.issueDificulty).value = dificulty;
    
    TGrabber.ticketSubmitUpdates(iframe, true);
  },

  ticketChangeValue: function(iframe, field, value, reload) {
    iframe.contentWindow.document.getElementById(field).value = value;
    TGrabber.ticketSubmitUpdates(iframe, reload);
  },

  ticketSubmitUpdates: function(iframe, reload) {
    if (reload) iframe.setAttribute('onload','SortList.reload()');
    else iframe.setAttribute('onload','');
    iframe.contentWindow.document.getElementById(TGrabber.issueForm).submit();
  },
  
  editTask: function(task, onload) {
    if(sortBaseUrl != '' && sortProject != '') {
      var url = sortBaseUrl + 'issues/' + task;
      TGrabber.setIframe(url, onload);
    } else {
      alert('No base URL setup!');
    }
  },

  createTask: function(tracker, title, target_version, category, priority, dificulty, start_date, due_date, hours, notes) {
    var onload = 'TGrabber.addTicketSetValues(this, 1,"' + title + '",' + tracker + ',' + target_version + ',' + category + ',' + priority + ',1' + ',' + hours + ',"' + notes + '")';

    if(sortBaseUrl != '' && sortProject != '') {
      var url = sortBaseUrl + sortProject + 'issues/new';
      TGrabber.setIframe(url, onload);
    } else {
      alert('No base URL setup!');
    }
  },

  // ------------- Getters --------------------------------------------

  getListsTemplate: function(iframe) {
    for(var i=0;i<sortLists.length;i++) {
      TGrabber.setIframe(sortLists[i][0], "TGrabber.grabListTemplate(this)"); 
    }
  }, 

  getEnvironmentVars: function(container) {
    if(sortBaseUrl != '' && sortProject != '') {
      var url = sortBaseUrl + sortProject + 'issues/new';
      TGrabber.setIframe(url, "TGrabber.grabVars(this, '" + container + "')");
    } else {
      alert('No base URL setup!');
    }
  },

  splitTaskId: function(url) {
    var sp = url.split('/');
    var taskId = sp[sp.length - 1];
    return taskId;
  },
   
  getFullTask: function(ticket) {
    var container = SortList.ticketContainerName(ticket);
    var ticket_id = ticket.split('-')[1];
    if(sortBaseUrl != '' && sortProject != '') {
      var url = sortBaseUrl + 'issues/' + ticket_id;
      TGrabber.setIframe(url, "TGrabber.grabFullTicket(this, '" + container + "')");
    } else {
      alert('No base URL setup!');
    }

  },


  getTasks: function(url, onload) {
    TGrabber.setIframe(url, onload);
  },

  getFilters: function() {
    if(sortBaseUrl != '' && sortProject != '') {
      var url = sortBaseUrl + sortProject + 'issues';
      TGrabber.setIframe(url, "TGrabber.grabFilters(this)");
      TGrabber.waitFilters();
    } else {
      alert('No base URL setup!');
    }
  }
};



var SortList = {
  version: '0.1.1',

  // --------------- List Management -------------------------------

  addList: function(url, color, title) {
    var found = false;
    for(var i = 0; i<sortLists.length;i++) {
      if(sortLists[i][2] == title) { found = true; }
    } 
    if(!found) {
      sortLists[sortLists.length] = [url, color, title];
      sortListsTemplates[sortListsTemplates.length] = [];
      sortListsDificulty[sortListsDificulty.length] = 0;
    }
  },

  getListNames: function() {
    returnList = [];
    for(var i = 0;i<sortLists.length;i++) { returnList[i] = SortList.bucketContainerName(sortLists[i][2]); }
    return returnList;
  },

  setListTitle: function(container, title) {
    for(var i=0; i<sortLists.length; i++) {
      if(SortList.bucketContainerName(sortLists[i][2]) == container) {
        sortLists[i][2] = title;
      }
    }
    JInterface.storePreferences();
    $(container).parentNode.childNodes[0].childNodes[0].innerHTML = title;
  },

  setListColor: function(color, title) {
    var container = $(SortList.bucketContainerName(title));
    for(var i=0; i<container.childNodes.length; i++) {
      container.childNodes[i].style.background = color;
    }
    for(var i =0; i<sortLists.length; i++) {
      if(sortLists[i][2] == title) {
        sortLists[i][1] = color;
      }
    }
    JInterface.storePreferences();
  },

  setListsHeight: function(height) {
    for(var i=0;i<sortLists.length;i++) {
      $(SortList.bucketContainerName(sortLists[i][2])).style.height = (height - 16) + 'px';
      $(SortList.containerName(sortLists[i][2])).style.height = height + 'px';
    }
  },

  // --------------- Lists Creation --------------------------------

  taskTypeName: function(title) { return title.split(' ').join('-'); },

  setupList: function(url, color, title) {
    var bucket = SortList.createList(title);
    SortList.load(url, bucket.id, color, SortList.taskTypeName(title));
    SortList.addList(url, color, title);
  },

  init: function(arrayLists) {
    SortList.renderListsContainer();
    for(var i=0;i < arrayLists.length;i++) {
      SortList.setupList(arrayLists[i][0], arrayLists[i][1], arrayLists[i][2]);
    }
    SortList.reorderLists();
  },

  // ---------------- Size Bar -------------------------------------

  releasedSizeBar: true,
  oldYPosition: 0,

  addSizeLayer: function() {
    if(!$('sizeBar')) {
      var sizebar = JHtml.div('sizeBar',
                                'cursor: ns-resize; float: left; width: 100%; ' + 
                                'margin: 0px auto; margin-top: 20px; margin-bottom: 20px; ' + 
                                'font-size: 3px; padding: 0px; height: 3px; ' + 
                                'border: 1px solid #d0d0d0; background-color: #f0f0f0;');
      sizebar.setAttribute('onmousedown','SortList.grabSizeBar(event)');
      document.body.setAttribute('onmouseup','SortList.releaseSizeBar(event)');
      document.body.setAttribute('onmousemove','SortList.moveSizeBar(event)');
      sizebar.innerHTML = '';
      $('content').appendChild(sizebar);
    }
  },

  grabSizeBar: function(event) {
    var posY = event.clientY;
    SortList.oldYPosition = posY;
    SortList.releasedSizeBar = false;
    $('sizeBar').style.background = '#303030';
  },

  releaseSizeBar: function(event) {
    var posY = event.clientY;
    SortList.releasedSizeBar = true;
    $('sizeBar').style.background = '#f0f0f0';
  },

  moveSizeBar: function(event) {
   if(!SortList.releasedSizeBar) {
      var mouseY = event.pageY || event.clientY + document.documentElement.scrollTop;
      var heightMenu = parseInt($('menu_filters').offsetHeight);
      $('sizeBar').style.background = '#303030';
      $('listsContainer').style.height = (mouseY - 85 - heightMenu) + 'px';
      for(var i=0; i<sortLists.length; i++ ){
        $(SortList.bucketContainerName(sortLists[i][2])).style.height = (mouseY - heightMenu - 85) + 'px';
        $(SortList.containerName(sortLists[i][2])).style.height = (mouseY - heightMenu - 85) + 'px';
        configHeight = (mouseY - heightMenu - 85);
      }
    }
  },

  // ---------------------- Lists Renderization -------------------------

  containerName: function(title) { return title.split(' ').join('-') + '-title'; },
  bucketContainerName: function(title) { return title.split(' ').join('-') + '-bucket-container'; },
  ticketContainerName: function(ticket) { return ticket + '-container'},

  reorderLists: function() {
    var width = 95 /  sortLists.length;
    for(var i=0; i<sortLists.length;i ++) { $(SortList.bucketContainerName(sortLists[i][2])).parentNode.style.width = width + '%'; }
    setTimeout('SortList.doMagic()',2000);
    SortList.addSizeLayer();
  },

  renderListsContainer: function() {
     var listsContainer = JHtml.div('listsContainer', 'width: 99%; margin-top: 20px; display: inline-block');
     $('content').appendChild(listsContainer); 
  },

  createList: function(title) {
     var container = SortList.renderContainer(title);
     $('listsContainer').appendChild(container);
     $(container.id).appendChild(SortList.renderBucketContainer(title));
     return $(SortList.bucketContainerName(title));
  },

  renderTitleTextbox: function(obj) {
    var edit = JHtml.textbox('', '150px', obj.innerHTML);
    edit.setAttribute('style',  'border: 0px; height: 16px;' +
                                'padding-top: 0px; padding-bottom: 2px; ' +
                                'font-size: 14px; font-weight: bold;');
    edit.setAttribute('onblur', 'SortList.setListTitle(this.parentNode.parentNode.childNodes[1].id, this.value); ' + 
                                'this.style.display = "none"; ' + 
                                'this.parentNode.childNodes[0].style.display = "";');
    obj.parentNode.insertBefore(edit, obj.parentNode.childNodes[1]); 
    edit.focus();
    obj.style.display = 'none';
  },

  renderBucket: function(id) {
    var bucket = JHtml.div(id,'');
    return bucket;
  },

  renderBucketContainer: function(title) {
    var bucketc = JHtml.div(SortList.bucketContainerName(title),  
                                'width: 100%%; margin: 0px; ' + 
                                'padding: 0px;  height: ' + (configHeight - 16) + 'px; ' + 
                                'overflow: auto; -moz-box-shadow: 0px 0px 10px 0px #c0c0c0;' +
                                '-webkit-box-shadow: 0px 0px 10px 0px #c0c0c0;');
    return bucketc;
  },

  renderContainer: function(title) {
    var newContainer = JHtml.div(SortList.containerName(title), 
                                'overflow: hidden; background-color: #ffffff; ' +
                                'border: 1px solid #c0c0c0; padding: 0px; ' +
                                'float: left; width: 12%; margin-left: 10px; ' + 
                                'margin-right: 0px; -moz-border-radius:15px 15px 0px 0px; ' + 
                                '-webkit-border-radius:15px 15px 0px 0px; ' + 
                                'height: ' + configHeight + 'px; padding-top: 0px;');
    var titleContainer = JHtml.div('',  
                                'style","width: 90%; margin-top: 0px; ' + 
                                'font-size: 12px; height: 20px; font-weight: bold; ' + 
                                'padding-top: 2px; padding-bottom: 2px; ' + 
                                'text-align: left; padding-left: 20px;');
    var titleH = JHtml.span();
    titleH.setAttribute('style','width: 40%; cursor: text; font-size: 14px; ' + 
                                'font-weight: bold; margin: 0px; padding: 0px;');
    titleH.setAttribute('onclick','SortList.renderTitleTextbox(this)');
    titleH.innerHTML = title;
    var colorOptions = JHtml.div('',
                                'font-size: 10px; float: right; width: 50%; ' + 
                                'height: 14px; padding-right: 10px; text-align: right;');
    colorOptions.innerHTML = 'color:';
    for(var i=0; i<Colors.list.length;i++) {
      var color = Colors.list[i];
      var colorPick = JHtml.div('',
                                'cursor: pointer; float: right; width: 10px; height: 10px; ' + 
                                'margin: 1px; border: 1px solid #c0c0c0; background-color: ' + color + ';');
      colorPick.setAttribute('onclick','SortList.setListColor("' + color + '","' + title + '")');
      colorOptions.appendChild(colorPick);
    }
    titleContainer.appendChild(titleH);
    titleContainer.appendChild(colorOptions);
    newContainer.appendChild(titleContainer);
    return newContainer;
  },
  
  // --------------- Tasks Creation --------------------------------

  renderTextBox: function(name, width) {
    var tb = JHtml.textbox(name, width + '%','');
    return tb;
  },
  
  renderDropDown: function(name, content) {
    var dd = JHtml.select(name, '');
    for(var i=0;i<content.length;i++) {
      var option = JHtml.option(content[i][1], content[i][0]);
      dd.appendChild(option);
    }
    return dd;
  },

  renderAddTask: function() {
    var add = JHtml.div('','width: 80%; margin: 0px auto; text-align: center;  margin-top: 20px; padding: 10px;');
    var addSpacer = JHtml.space();   
    var addNameBoxLabel = JHtml.label('task-add-subject');
    addNameBoxLabel.innerHTML = 'Subject: ';
    var addNameBox = SortList.renderTextBox('task-add-name','80%');
    var addTrackerLabel = JHtml.label('task-tracker');
    addTrackerLabel.innerHTML = 'Tracker: ';
    var addTracker = SortList.renderDropDown('task-add-tracker',TTracker.list);
    var addVersionLabel = JHtml.label('task-version');
    addVersionLabel.innerHTML = 'Version: ';
    var addVersion = SortList.renderDropDown('task-add-version',TVersion.list);
    var addCategoryLabel = JHtml.label('task-category');
    addCategoryLabel.innerHTML = 'Category: ';
    var addCategory = SortList.renderDropDown('task-add-category',TCategory.list);
    
    add.appendChild(addTrackerLabel);
    add.appendChild(addTracker);
    add.appendChild(addSpacer);
        
    var addSpacer = JHtml.space();   

    add.appendChild(addNameBoxLabel);
    add.appendChild(addNameBox);
    add.appendChild(addSpacer); 

    var addSpacer = JHtml.space();

    add.appendChild(addCategoryLabel);
    add.appendChild(addCategory);
    add.appendChild(addSpacer); 

    add.appendChild(addVersionLabel);
    add.appendChild(addVersion);

    return add;
  },

  // --------------- Cookies Management ----------------------------

  createCookie: function(name, value, days) {
    if(days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = '; expires=' + date.toGMTString();
    } else {
      var expires = '';
    }
    document.cookie=name+'='+value+expires+'; path=/';
  },

  readCookie: function(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0;i<ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },

  deleteCookie: function(name) { 
    createCookie(name, '', -1); 
  },

  // --------------- Tasks changes ---------------------------------

  setTaskStatus: function(task_id, status_id) {
    var taskId = task_id.split('-')[1];
    TGrabber.editTask(taskId,'TGrabber.ticketChangeValue(this, TGrabber.issueStatusId, ' + status_id +', true)');
  },

  setTaskAssigned: function(task_id, assigned) {
    var taskId = task_id.split('-')[1];
    TGrabber.editTask(taskId,'TGrabber.ticketChangeValue(this, TGrabber.issueAssignedTo, ' + assigned +', true)');
  },

  setTaskDificulty: function(task_id, dificulty) {
    var taskId = task_id.split('-')[1];
    TGrabber.editTask(taskId,'TGrabber.ticketChangeValue(this, TGrabber.issueDificulty, ' + dificulty +', false)');
    for(var i=0;i<sortLists.length;i++) {
      var task = document.getElementById(SortList.taskTypeName(sortLists[i][2]) + '-' + task_id);
      if(task) {
        var difs = task.getElementsByTagName('DIV');
        for(var j=0; j<difs.length;j++) {
          for(var d=0;d<dificulty;d++) {
            if(difs[j].id == 'dif-' + d)
              difs[j].style.background = '#606060';
          }
          for(var d=dificulty;d<3;d++) {
            if(difs[j].id == 'dif-' + d)
              difs[j].style.background = '';
          }
        }
      }
    }
  },

  // --------------- Load and creation -----------------------------

  load: function(url, obj, color, task_type) {
    TGrabber.getTasks(url, "SortList.fill(this,'" + color + "','" + task_type + "','" + obj + "')")
  },

  reload: function() {
    for(var i=0; i<sortLists.length; i++) {
      SortList.reloadList(sortLists[i]);  
    }
  },

  reloadList: function(list) {
    var url = list[0];
    var color = list[1];
    var task_type = SortList.taskTypeName(list[2]);
    var obj = SortList.bucketContainerName(list[2]);
    SortList.load(url, obj, color, task_type);
  },

  doMagic: function() { 
    for(var i = 0;i<sortLists.length; i++) {
      container = SortList.bucketContainerName(sortLists[i][2]);
      colorf = sortLists[i][1];
      task_type = SortList.taskTypeName(sortLists[i][2]);
      Sortable.create(container, { 
        elements: $$('#' + container + ' div'), 
        containment: SortList.getListNames(),
      });
      // And now we do Sortable!
      var tasks = $(container).childNodes;
      for(var j=0; j<tasks.length; j++) { new Draggable( tasks[j].id ,{revert: true});  }
    }
  },
  
  // --------------------- Individual Task ------------------------------

  showTaskFull: function(task,menu) {
    var ticket_id = task.split('-');
    ticket_id = ticket_id[ticket_id.length -2] + '-' + ticket_id[ticket_id.length - 1];
    if($(SortList.ticketContainerName(ticket_id))) {
      $(SortList.ticketContainerName(ticket_id)).parentNode.removeChild($(SortList.ticketContainerName(ticket_id)));
      menu.innerHTML = '&gt;';
    } else {
      menu.innerHTML = '&lt;';
      var c = JHtml.div(SortList.ticketContainerName(ticket_id),'width: 99%; display: inline-block;');
      $(task).appendChild(c);
      TGrabber.getFullTask(ticket_id);
    }
  },

  renderFullTask: function( oArg ) {
    var d = JHtml.div('', 
                    'width: 80%; float: left; padding: 5px; margin: 0 auto;');
    var l = JHtml.div('','width: 99%; margin: 0px; display: inline-block; margin-bottom: 10px;');
    var p = JHtml.propertyLabel('Description');
    var s = JHtml.propertyContent(oArg.description == '' ? 'No description.' : JTextile.textile2html(oArg.description));
    l.appendChild(p);
    l.appendChild(s);
    d.appendChild(l);
   
    var l = JHtml.div('','width: 99%; margin: 0px; display: inline-block; margin-bottom: 10px;');
    var p = JHtml.propertyLabel('Target Version');
    var s = JHtml.propertyContent(TVersion.decode(oArg.targetVersion));
    l.appendChild(p);
    l.appendChild(s);
    d.appendChild(l);

    var l = JHtml.div('','width: 99%; margin: 0px; display: inline-block; margin-bottom: 10px;');
    var p = JHtml.propertyLabel('Status');
    var s = JHtml.propertyContent(TStatus.decode(oArg.statusId));
    l.appendChild(p);
    l.appendChild(s);
    d.appendChild(l);

    var l = JHtml.div('','width: 99%; margin: 0px; display: inline-block; margin-bottom: 10px;');
    var p = JHtml.propertyLabel('Priority');
    var s = JHtml.propertyContent(TPriority.decode(oArg.priorityId));
    l.appendChild(p);
    l.appendChild(s);
    d.appendChild(l);

    var p = JHtml.propertyLabel('Category');
    var s = JHtml.propertyContent(TCategory.decode(oArg.categoryId));
    d.appendChild(p);
    d.appendChild(s);

    return d;
  },

  // --------------------- Tasks treatment ------------------------------

  taskOptions: function(tid,ticketAssigned,ticketStatus) {
    var options = JHtml.span();
    options.setAttribute('style','padding-right: 5px;');
    options.setAttribute('align','right');
    if(ticketAssigned == SortList.NOT_ASSIGNED) {
      var buttonAccept = JHtml.greenButton('Accept','SortList.setTaskAssigned("' + tid + '", ' + sortMe + ')');
      options.appendChild(buttonAccept);
      if(ticketStatus == TStatus.CLOSED || ticketStatus == TStatus.FIXED) {
        var buttonReopen = JHtml.greyButton('Reopen','SortList.setTaskStatus("' + tid + '", ' + TStatus.NEW + ')');
        options.appendChild(buttonReopen);
      } else if(ticketStatus == TStatus.NEW || ticketStatus == TStatus.ACCEPTED){
        var buttonStart = JHtml.greyButton('Start','SortList.setTaskStatus("' + tid + '", ' + TStatus.IN_PROGRESS + ')');
        options.appendChild(buttonStart);
      }
    } else if (ticketAssigned == SortList.ASSIGNED) {
      if(ticketStatus == TStatus.NEW || ticketStatus == TStatus.ACCEPTED) {
        var buttonAccept = JHtml.greyButton('Start','SortList.setTaskStatus("' + tid + '", ' + TStatus.IN_PROGRESS + ')');
        options.appendChild(buttonAccept);
      } else if (ticketStatus == TStatus.IN_PROGRESS) {
        var buttonStop = JHtml.redButton('Stop','SortList.setTaskStatus("' + tid + '", ' + TStatus.NEW + ')');
        var buttonFinish = JHtml.greenButton('Fixed','SortList.setTaskStatus("' + tid + '", ' + TStatus.FIXED + ')');
        options.appendChild(buttonStop);
        options.appendChild(buttonFinish);
      } else if (ticketStatus == TStatus.CLOSED || ticketStatus == TStatus.FIXED || ticketStatus == TStatus.REJECTED || ticketStatus == TStatus.FAILING) {
        var buttonReopen = JHtml.greyButton('Reopen','SortList.setTaskStatus("' + tid + '", ' + TStatus.NEW + ')');
        options.appendChild(buttonReopen);
      }
    }
    return options;
  },

  NOT_ASSIGNED: 1, 
  ASSIGNED: 2, 

  formatAssignedName: function(name) {
    var smallName = name.innerHTML;
    if(smallName != null) {
      smallName = smallName.split(' ');
      var nameStr = '';
      for(var i=0;i<smallName.length;i++) {
        nameStr += smallName[i][0];
      }
      var p = JHtml.p();
      var link = JHtml.a();
      link.setAttribute('href',name.href);
      link.setAttribute('title',name.innerHTML);
      link.setAttribute('alt',name.innerHTML);
      link.innerHTML = nameStr;
      p.appendChild(link);
      return p.innerHTML;
    } else {
      return '';
    }
  },

  fullTaskMenu: function(task) {
    var d = JHtml.span('','text-align: center;');
    d.innerHTML = '&gt;';
    d.setAttribute('onclick','SortList.showTaskFull("' + task + '",this);');
    return d;
  },

  formatTask: function(task, color, task_id, list) {
    
    var tds = task.getElementsByTagName('TD');
    var subjectWidth = 90 * (1 - (tds.length/5));
    var notAssigned = false;
    var dificulty = 1;
    
    for(var j=0;j<tds.length;j++) {
      if(tds[j].className == 'checkbox') {
        tds[j].innerHTML = '';
        tds[j].style.width = '3%';
        tds[j].appendChild(SortList.fullTaskMenu(task.id));
      } else if(tds[j].className == 'updated_on') {
        var updated = tds[j].innerHTML;
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'author') {
        var author = tds[j].innerHTML;
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'tracker') {
        var tracker = tds[j].innerHTML;
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'priority') {
        var priority = tds[j].innerHTML;
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'project') {
        var project = tds[j].innerHTML;
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'cf_3') {
        var dificulty = tds[j].innerHTML;
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'status') {
        var status_id = TStatus.code(tds[j].innerHTML);
        tds[j].parentNode.removeChild(tds[j]);
        j -= 1;
      } else if(tds[j].className == 'subject') {
        //tds[j].setAttribute('width',subjectWidth + '%');
      } else if(tds[j].className == 'assigned_to') {
        tds[j].setAttribute('width','8%');
        tds[j].setAttribute('align','center');
        if(tds[j].innerHTML == '') {
          notAssigned = true;
        } else { 
          tds[j].innerHTML = SortList.formatAssignedName(tds[j].childNodes[0]);
        }
      } else if (tds[j].innerHTML.indexOf('/issues/') != -1) {
        tds[j].setAttribute('width','10%');
        tds[j].setAttribute('align','center');
        var link = tds[j].getElementsByTagName('A')[0].innerHTML;
        tds[j].getElementsByTagName('A')[0].innerHTML = '#' + link;
      }
    }
    
    if(!sortListsDificulty[list])
      sortListsDificulty[list] = 0;
    sortListsDificulty[list] += parseInt(dificulty);

    var dificultyOps = JHtml.td();
    dificultyOps.setAttribute('width','8%');
    dificultyOps.appendChild(SortList.generateDificultyMenu(task_id, dificulty));
    task.getElementsByTagName('TR')[0].appendChild(dificultyOps);   
 
    var taskOptions = JHtml.td();
    if (notAssigned) {
      taskOptions.appendChild(SortList.taskOptions(task_id, SortList.NOT_ASSIGNED, status_id));
    } else {
      taskOptions.appendChild(SortList.taskOptions(task_id, SortList.ASSIGNED, status_id));
    }
    taskOptions.setAttribute('width','10%');
    taskOptions.setAttribute('align','right');
    task.getElementsByTagName('TR')[0].appendChild(taskOptions);  
 
    return task;  
  },

  generateDificultyMenu: function(task_id, defDif) {
    var menu = JHtml.span();
    menu.setAttribute('style','padding: 2px;');
    defDif = defDif ? defDif : 0;
    for (var ii=0;ii<defDif; ii++) {
      var dif = parseInt(ii) + 1;
      var bar = JHtml.divDif('dif-' + ii, 
                          '-moz-border-radius:4px 4px 4px 4px; margin: 1px; ' + 
                          '-webkit-border-radius:4px 4px 4px 4px; ' + 
                          'float: left; width: 3px; height: 12px; font-size: 10px; ' + 
                          'border: 1px solid #808080; background-color: #808080; cursor: pointer;');
      bar.setAttribute('onclick','SortList.setTaskDificulty("' + task_id + '",' + dif + ')');
      bar.innerHTML = '&nbsp;';
      menu.appendChild(bar);
    }
    for (var i=defDif; i<3; i++){
      var dif = parseInt(i) + 1;
      var bar = JHtml.divDif('dif-' + i, 
                          '-moz-border-radius: 4px 4px 4px 4px; margin: 1px; ' + 
                          '-webkit-border-radius: 4px 4px 4px 4px; ' + 
                          'float: left; width: 3px; height: 12px; font-size: 10px; ' + 
                          'border: 1px solid #808080; cursor: pointer;');
      bar.setAttribute('onclick','SortList.setTaskDificulty("' + task_id + '",' + dif + ')');
      bar.innerHTML = '&nbsp;';
      menu.appendChild(bar);
    }
    return menu;
  },

  // ------------------------- List Fill --------------------------------

  /**
   *  obj = iframe object where to pull from information
   *  container = div where to set the tasks
   */
  fill: function(obj, color, task_type, container) {
    if(obj.contentWindow.document.getElementsByTagName('table')[4]) {
      var list = -1;

      for(var d=0;d<sortLists.length;d++){
        if(SortList.bucketContainerName(sortLists[d][2]) == container) {
          list = d;  
        }
      }

      $(container).innerHTML = '';
      var iterator = obj.contentWindow.document.getElementsByTagName('table')[4].getElementsByTagName('tr');
      for(var i=1;i<iterator.length && i < 100;i++) { 
        var task = JHtml.div(); 
        task.id = task_type + '-' + iterator[i].id; 
        task.className = task_type; 
        task.innerHTML = '<table border="0" width="100%" style="font-size: 11px;">' + iterator[i].innerHTML + '</table>';
        task = SortList.formatTask(task,color, iterator[i].id, list);
        task.style.borderRight = '0px'; 
        if(i<iterator.length - 1) {
          task.setAttribute('style',
                          'cursor: pointer; border-top: 1px solid #c0c0c0;');
        } else {
          task.setAttribute('style',
                          'cursor: pointer; border-top: 1px solid #c0c0c0; '+ 
                          'border-bottom: 1px solid #c0c0c0;');
        }
        task.style.background = color;
        $(container).appendChild(task);  
      }
    } else {
      var noElementsDiv = JHtml.div('',
                          'padding: 20px; text-align: center; width: 100%;');
      noElementsDiv.innerHTML = 'There is no elements';
      $(container).innerHTML = '';
      $(container).appendChild(noElementsDiv); 
    }
    TGrabber.garbageCollectOne(obj);
    SortList.doMagic();
  }
};
