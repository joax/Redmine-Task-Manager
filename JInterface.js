function Favicon() {
  
  this.isChrome = 0;
  this.iframe = null;

  this.init = function() {
    document.head = document.head || document.getElementsByTagName('head')[0];
    // Browser sniffing :`(
    if (/Chrome/.test(navigator.userAgent)) {
      this.isChrome = 1;
      this.iframe = document.createElement('iframe');
      this.iframe.src = 'about:blank';
      this.iframe.style.display = 'none';
      document.body.appendChild(iframe);
    };
  };

  this.changeFavicon = function(src) {
    var link = document.createElement('link'),
    oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
      document.head.removeChild(oldLink);
    };
    document.head.appendChild(link);
    if (this.isChrome) {
      this.iframe.src += '';
    };
  };
};

function FilterCollection() {
  
  this.filters = {};
  this.links = {};

  this.addFilter = function(ids, field, title, link) {

    if(!this.links[link]) {
      this.filters[title] = {};
      this.filters[title].ids = ids;
      this.filters[title].field = field;
      this.links[link] = title;
    } else {
      // Merge the ids with the current one
      for(var i=0;i<ids.length;i++) {
        var found = false;
        for(var j=0;j<this.filters[this.links[link]].ids.length;j++) {
          if(this.filters[this.links[link]].ids[j] == ids[i])
            found = true;
        }
        if(!found)
          this.filters[this.links[link]].ids[this.filters[this.links[link]].ids.length] = ids[i];
      }
    }
  };

  this.getFilters = function(field) {
    var filtered = {};
    if(field) {
      count = 0;
      for(var i in this.filters) {
        if(this.filters[i].field == field) {
          filtered[i] = this.filters[i];
          count++;
        }
      }
      filtered.field = field;
      filtered.length = function() { return count; }
    } else {
      filtered = this.filters;
      filtered.length = this.length;
      filtered.field = '';
    }
    return filtered;
  };

  this.length = function() {
    var length = 0;
    for(var i in this.filters) {
      length ++;
    }
    return length;
  }
};


function ListCollection() {

  this.lists = [];

  this.length = function() {
    return this.lists.length;
  };

  this.task = function(taskId) {
    for(var i=0;i<this.length();i++) {
      if(this.lists[i].task(taskId)) {
        return this.lists[i].task(taskId);
      } 
    }
  };

  this.list = function(title) {
    for(var i=0;i<this.length();i++) {
      if(this.lists[i].title == title) {
        return this.lists[i];
      } 
    }
  };

  this.getByContainer = function(containerName) {
    for(var i=0;i<this.length();i++) {
      if(this.lists[i].containerName == containerName) return this.lists[i]; 
    }
  };

  this.addList = function(list) {
    var found = false;
    for(var i=0;i<this.lists.length;i++) {
      if(this.lists[i].title == list.title) {
        found = true; 
      }
    }

    if(!found) {
      this.lists[this.length()] = list;
      return true;
    }
    return false;
  };

  this.serializable = function() {
    var arrayT = [];
    for(var i=0;i<this.length();i++) {
      arrayT[arrayT.length] = [this.lists[i].url, this.lists[i].color, this.lists[i].title, this.lists[i].isFiltered, this.lists[i].fieldFiltered];
    }
    return arrayT;
  };

  this.parse = function(array) {
    this.lists = [];
    for(var i=0;i<array.length;i++) {
      this.addList(new List([array[i][0], array[i][1], array[i][2], array[i][3], array[i][4]])); 
    }
  };
}

var listCollection = new ListCollection();
var filterCollection = new FilterCollection();

var sortProject = 'projects/1/';
var sortBaseUrl = '';

var sortMe = 0;

var configHeight = window.innerHeight - 200;
var configNumberLists = 3;

var filtersList = [];
var sortSubProjects = [];

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

var TAssignee = {
  code: function(value) {
    for(var i=0;i<TAssignee.list.length;i++) {
      if(value == TAssignee.list[i][0]) {
        return TAssignee.list[i][1];  
      }  
    }  
  },

  decode: function(value) {
    for(var i=0;i<TAssignee.list.length;i++) {
      if(value == TAssignee.list[i][1]) {
        return TAssignee.list[i][0];  
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

  BUG: 1,
  FEATURE: 2,
  SUPPORT: 3,
  TASK: 4
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
    ['QA Feedback', 4],
    ['Closed', 5],
    ['Rejected', 6],
    ['Deferred', 7],
    ['Pushed', 8],
    ['Accepted', 9],
    ['Failing', 10],
    ['Engineering Feedback', 11],
    ],

  NEW: 1,
  IN_PROGRESS: 2,
  FIXED: 3,
  QA_FEEDBACK: 4,
  CLOSED: 5,
  REJECTED: 6,
  DEFERRED: 7,
  PUSHED: 8,
  ACCEPTED: 9,
  FAILING: 10,
  ENGINEERING_FEEDBACK: 11,
};

var Colors = {
   red: "#ffd0d0",
   green: "#d0FFd0",
   blue: "#d0d0FF",
   white: "#ffffff",

   list: ['#FF5050','#ffd0d0','#50FF50','#d0ffd0','#5050FF','#d0d0ff','#f0f0f0','#ffffff'],
 };

var iframesLoaded = [];

var JInterface = {

  favIcon: "/favicon.ico",

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
    SortList.createCookie('RedmineTasker-' + sortProject, JInterface.serializePreferences(listCollection.serializable()), 10);
  },

  retrievePreferences: function() {
    var arrayP = SortList.readCookie('RedmineTasker-' + sortProject);
    if(arrayP && arrayP.length > 0) {
      listCollection.lists = [];
      listCollection.parse(JInterface.unserializePreferences(arrayP));
    }
  },

  getURL: function() {
    var str = new String(document.location);
    if(str.indexOf('projects') != -1) {
      var parts = str.split('projects');
      sortBaseUrl = parts[0];
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

  menuCanvas: function(id, width, left) {
    var m = JHtml.div(id,
                      'position: absolute; top: 30px; left: ' + left + 'px;' +
                      'border: 1px solid #c0c0c0; margin: 5px;' + 
                      '-moz-border-radius: 5px 5px 5px 5px;' + 
                      '-webkit-border-radius: 5px 5px 5px 5px;' + 
                      '-moz-box-shadow: 0px 5px 5px -3px black;' + 
                      '-webkit-box-shadow: 0px 5px 5px -3px black;' + 
                      'margin-top: 10px; margin-bottom: 10px; z-index: 200;' + 
                      'width: ' + width + '; background-color: #ffffff;');
    return m;
  },

  menuRefresh: function(title) {
    var refresh = JHtml.div('',
                        'float: right; width: 90px; text-align: left; padding: 4px; ' +
                        'margin-top: 4px; border: 1px solid #c0c0c0; padding-left: 8px;' +
                        'background-color: #ffffff; -moz-border-radius: 5px; -webkit-border-radius: 5px;');
    refresh.setAttribute('onmouseover','this.background = "#f0f0f0";');
    refresh.setAttribute('onmouseout','this.background = "#ffffff";');
    var linkToRefresh = JHtml.a();
    linkToRefresh.setAttribute('style','cursor: pointer; background-image: url(/images/reload.png); ' +
                        'background-repeat: no-repeat; padding-left: 20px;');
    linkToRefresh.setAttribute('onclick','JInterface.calculateOptions();');
    linkToRefresh.innerHTML = title;
    refresh.appendChild(linkToRefresh);
    return refresh;
  },
  
  menuTitle: function(title, obj) {
    var sectionTitle = JHtml.div('',
                            'width: 99%; font-size: 15px; font-weight: bold; ' + 
                            'text-align: center; margin-top: 5px; margin-bottom: 5px;');
    sectionTitle.innerHTML = title;
    var closeButton = JHtml.div('',
                            'border: 1px solid #606060; background-color: #d0d0d0; ' + 
                            'margin: 2px; width: 12px; height: 12px; float: right; ' +
                            '-moz-border-radius: 3px 3px 3px 3px;' +
                            '-webkit-border-radius: 3px 3px 3px 3px;' +
                            '-moz-box-shadow: 0px 3px 3px 0px #c0c0c0;' +
                            '-webkit-box-shadow: 0px 3px 3px 0px #c0c0c0;' +
                            'cursor: pointer;');
    closeButton.setAttribute('onclick',
                            "$('" + obj.id + "_bottom_layer').style.display=$('" + 
                            obj.id + "_bottom_layer').style.display == '' ? " +
                            "Effect.SlideUp('" + obj.id + "_bottom_layer') : Effect.SlideDown('" + obj.id + "_bottom_layer'); " + 
                            "$('" + obj.id + "_list_layer').style.display = $('" 
                            + obj.id + "_list_layer').style.display == '' ? " + 
                            "Effect.SlideUp('" + obj.id + "_list_layer') : Effect.SlideDown('" + obj.id + "_list_layer');");
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
                            'width: 90%; margin: 0px auto; padding: 10px;');
    
    var menuList  = JInterface.menuCanvas('menu_filters','380px', 500);
    var menuAdd   = JInterface.menuCanvas('menu_add','440px', 40);
    var menuTools = JInterface.menuCanvas('menu_canvas','200px', 900);
    
    var menuFilterList  = JInterface.menuContent(menuList.id, '80%');
    var menuAddList     = JInterface.menuContent(menuAdd.id, '95%');
    var menuToolsList   = JInterface.menuContent(menuTools.id, '95%');

    menuAdd = JInterface.menuTitle('Add Task',menuAdd);
    menuList = JInterface.menuTitle('Tasks Filters',menuList);
    menuTools = JInterface.menuTitle('Tools',menuTools);
 
    if(filterCollection.length) {
      var toolsButtons = JHtml.div();
      toolsButtons.setAttribute('style','width: 90%; padding: 3px; text-align: center;');
      
      var refreshDiv      = JHtml.div('','width: 150px; padding: 4px; border: 1px solid #c0c0c0; margin: 10px;');
      refreshLabel        = JHtml.label('refresh-rate');
      refreshLabel.innerHTML = 'Refresh Rate:';
      var refreshRate     = JHtml.select('refresh-rate','JInterface.refresh()');
      refreshRate.appendChild(JHtml.option(-1,'Not refresh'));
      refreshRate.appendChild(JHtml.option((10*60*1000),'10 Minutes'));
      refreshRate.appendChild(JHtml.option((5*60*1000),'5 Minutes'));
      refreshRate.appendChild(JHtml.option((2*60*1000),'2 Minutes'));
      refreshRate.appendChild(JHtml.option((1*60*1000),'1 Minutes'));
      refreshDiv.appendChild(refreshLabel);
      refreshDiv.appendChild(refreshRate);
     

      var toolDiv      = JHtml.div('','width: 150px; padding: 4px; border: 1px solid #c0c0c0; margin: 10px;');
      var toolPriorities  = JHtml.button('', 'Apply Priority Filter','JInterface.applyFilters(filterCollection.getFilters("priorityId"))');
      var toolVersions    = JHtml.button('', 'Apply Versions Filter','JInterface.applyFilters(filterCollection.getFilters("versionId"))');
      var toolNoVersions  = JHtml.button('', 'No Filters','JInterface.applyFilters(null)');
      toolDiv.appendChild(toolPriorities);
      toolDiv.appendChild(toolVersions);
      toolDiv.appendChild(toolNoVersions);

      toolsButtons.appendChild(refreshDiv);
      toolsButtons.appendChild(toolDiv);
      menuToolsList.appendChild(toolsButtons);
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
    menuTools.appendChild(menuToolsList);

    if($('menu_jhtml')) {
       $('menu_jhtml').parentNode.removeChild($('menu_jhtml'));
    }

    var executeButton   = JHtml.button('','Save Changes','JInterface.calculateOptions()');
    var addTicketButton = JHtml.button('', 'Add Task', 'JInterface.addTask()');
    var toolsButton     = JHtml.span('','');

    menuAdd     = JInterface.menuBottom(addTicketButton, menuAdd);
    menuList    = JInterface.menuBottom(executeButton, menuList);
    menuTools   = JInterface.menuBottom(toolsButton, menuTools);

    menu.appendChild(menuList);
    menu.appendChild(menuAdd);
    menu.appendChild(menuTools);
    menu.appendChild(JInterface.menuRefresh('Refresh'));
    
    if($('content').childNodes.length == 0)
      $('content').appendChild(menu);
    else
      $('content').insertBefore(menu, $('content').childNodes[0]);
  },

  applyFilters: function(filter) {
    if(filter != null) {
       for(var i=0; i<listCollection.length();i++) {
        listCollection.lists[i].groupBy(filter);
      }    
    } else {
      for(var i=0; i<listCollection.length();i++) {
        listCollection.lists[i].isFiltered = 0;
        listCollection.lists[i].load();
      }
    }
    JInterface.storePreferences();
  },

  addTask: function() {
    var tracker = document.getElementById('task-add-tracker').value;
    var version_id = document.getElementById('task-add-version').value;
    var category_id = document.getElementById('task-add-category').value;
    var parent_id = document.getElementById('task-add-parent-id').value;
    var title = escape(document.getElementById('task-add-name').value);
    var text = escape(document.getElementById('task-add-text').value);
    var assignee = document.getElementById('task-add-assignee').value;

    TGrabber.createTask(tracker, parent_id, title, text, version_id, category_id, 1, 1, assignee, '', '', 4, '');

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
      listCollection = new ListCollection();
      listCollection.parse(newList);
      JInterface.storePreferences();
    }
    JInterface.init(configHeight);
  },

  init: function(height) {
    // Set the favicon!!
    //favicon = new Favicon();
    //favicon.changeFavicon(this.favIcon);
    var screenHeight = window.innerHeight - 200;
    JInterface.clean();
    JInterface.getURL();
    JInterface.retrievePreferences();
    configHeight = screenHeight; 
    TGrabber.getVersions(sortProject);
    TGrabber.getSubProjects();
    TGrabber.getFilters();
  },

  clean: function() {
    if($('listsContainer')) {
      $('listsContainer').innerHTML = '';
    }
    listCollection = new ListCollection();
  },

  start: function() {
    
    JInterface.preparePage(); 
    JInterface.menu();
    var filtersDisplay = [];
    var counter = 0;
    if(listCollection.length() == 0) {
      for(var i=0;i<filtersList.length;i++) {
        if(counter < configNumberLists) {
          filtersDisplay[filtersDisplay.length] = [filtersList[i][1], Colors.white, filtersList[i][0]];
          counter+=1;
        }
      }
    } else {
      for(var i=0;i<listCollection.length();i++){
        filtersDisplay[filtersDisplay.length] = new List([listCollection.lists[i].url, listCollection.lists[i].color, listCollection.lists[i].title, listCollection.lists[i].isFiltered, listCollection.lists[i].fieldFiltered]);
      }
    }
    SortList.init(filtersDisplay);
    JInterface.refresh(true);
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

  refresh: function(init) {
    if(!init) {
      for(var i=0;i<listCollection.lists.length;i++)
        listCollection.lists[i].softLoad();
      // And we do some garbage collection

      setTimeout("TGrabber.garbageCollect()",2000);
    }
    // TODO: 
    // - Refresh options in 'Tools'
    // - Timer options in 'Tools'
    var rate = $('refresh-rate').value
    if(rate > 0) {
      setTimeout("JInterface.refresh(false)",rate);
    }
  },
}

var SortList = {
  version: '0.1.1',

  // --------------- List Management -------------------------------
  
  getListNames: function() {
    returnList = [];
    for(var i = 0;i<listCollection.length();i++) { 
      returnList[i] = listCollection.lists[i].containerName; 
    }
    return returnList;
  },

  setListsHeight: function(height) {
    for(var i=0;i<listCollection.length();i++) {
      listCollection.lists[i].container.style.height = (height - 16) + 'px';
      listCollection.lists[i].container.style.height = height + 'px';
    }
  },

  // --------------- Lists Creation --------------------------------

  setupList: function(list) {
    var container = list.container.html;
    $('listsContainer').appendChild(container);
    list.load();
    listCollection.addList(list);
  },

  init: function(arrayLists) {
    SortList.renderListsContainer();
    for(var i=0;i < arrayLists.length;i++) {
      SortList.setupList(arrayLists[i]);
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
      for(var i=0; i<listCollection.length(); i++ ){
        $(SortList.bucketContainerName(listCollection.lists[i].title)).style.height = (mouseY - heightMenu - 85) + 'px';
        $(SortList.containerName(listCollection.lists[i].title)).style.height = (mouseY - heightMenu - 85) + 'px';
        configHeight = (mouseY - heightMenu - 85);
      }
    }
  },

  // ---------------------- Lists Renderization -------------------------

  containerName: function(title) { return title.split(' ').join('-') + '-title'; },
  bucketContainerName: function(title) { return title.split(' ').join('-') + '-bucket-container'; },
  ticketContainerName: function(ticket) { return ticket + '-container'},
  taskTypeName: function(title) { return title.split(' ').join('-'); },

  reorderLists: function() {
    var width = 97 / listCollection.length();
    for(var i=0; i<listCollection.length();i++) { 
      $(listCollection.lists[i].containerName).parentNode.style.width = width + '%'; 
    }
    setTimeout('SortList.doMagic()',2000);
    SortList.addSizeLayer();
  },

  renderListsContainer: function() {
    if(!$('listsContainer')) {
      var listsContainer = JHtml.div('listsContainer', 'width: 99%; margin-top: 10px; display: inline-block');
      $('content').appendChild(listsContainer); 
    }
  },
 
  // --------------- Tasks Creation --------------------------------
  
  renderTextBox: function(name, width) {
    var tb = JHtml.textbox(name, width + '%','');
    return tb;
  },
  
  renderTextArea: function(name, width) {
    var ta = JHtml.textarea(name, width + '%','');
    return ta;
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
    var add = JHtml.div('','width: 90%; margin: 0px auto; text-align: center;  margin-top: 20px; padding: 10px;');
    var addSpacer = JHtml.space();   
    var addNameBoxLabel = JHtml.label('task-add-subject');
    addNameBoxLabel.innerHTML = 'Subject: ';
    var addNameBox = SortList.renderTextBox('task-add-name','80%');
    var addParentBoxLabel = JHtml.label('task-add-parent-id');
    addParentBoxLabel.innerHTML = 'Parent Task: ';
    var addParentBox = SortList.renderTextBox('task-add-parent-id','20%');
    var addTextBoxLabel = JHtml.label('task-add-text');
    addTextBoxLabel.innerHTML = 'Description: ';
    var addTextBox = SortList.renderTextArea('task-add-text','100%');
    var addTrackerLabel = JHtml.label('task-tracker');
    addTrackerLabel.innerHTML = 'Tracker: ';
    var addTracker = SortList.renderDropDown('task-add-tracker',TTracker.list);
    var addVersionLabel = JHtml.label('task-version');
    addVersionLabel.innerHTML = 'Version: ';
    var addVersion = SortList.renderDropDown('task-add-version',TVersion.list);
    var addCategoryLabel = JHtml.label('task-category');
    addCategoryLabel.innerHTML = 'Category: ';
    var addCategory = SortList.renderDropDown('task-add-category',TCategory.list);
    var addAssigneeLabel = JHtml.label('task-assigned-to');
    addAssigneeLabel.innerHTML = 'Assign to: ';
    var addAssignee = SortList.renderDropDown('task-add-assignee',TAssignee.list);
 
    add.appendChild(addTrackerLabel);
    add.appendChild(addTracker);
    add.appendChild(addSpacer);
        
    var addSpacer = JHtml.space();   

    add.appendChild(addNameBoxLabel);
    add.appendChild(addNameBox);
    add.appendChild(addSpacer); 
     
    var addSpacer = JHtml.space();   

    add.appendChild(addParentBoxLabel);
    add.appendChild(addParentBox);
    add.appendChild(addSpacer); 

    var addSpacer = JHtml.space();

    add.appendChild(addAssigneeLabel);
    add.appendChild(addAssignee);
    add.appendChild(addSpacer); 
   
    var addSpacer = JHtml.space();   

    add.appendChild(addTextBoxLabel);
    add.appendChild(addTextBox);
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

  // --------------- Load and creation -----------------------------

  reload: function() {
    for(var i=0; i<listCollection.length(); i++) {
      listCollection.lists[i].load();
    }
  },
  
  softReload: function() {
    for(var i=0; i<listCollection.length(); i++) {
      listCollection.lists[i].softLoad();
    }
  },

  doMagic: function() { 
    for(var i = 0;i<listCollection.length(); i++) {

      list        = listCollection.lists[i];
      container   = listCollection.lists[i].containerName;
      colorf      = listCollection.lists[i].color;
      task_type   = listCollection.lists[i].taskType;
      
      var tasks   = $(container).childNodes;
      
      Sortable.create(container, { 
        tag: 'div', 
        only: 'joax-redmine-task',
        containment: SortList.getListNames(),
        dropOnEmpty: true,
      });
      
      if(tasks.length > 0 && $(tasks[0]).id != 'no-elements') { 
        for(var j=0; j<tasks.length; j++) { 
          new Draggable( 
            tasks[j].id ,
            {
              revert: true, 
              onEnd: function(d) {
                list.reordered(d.element.parentNode, list.fieldFiltered);
              }
            }
          );  
        }
      }
    }
  },
  
  // --------------------- Individual Task ------------------------------

  renderFullTask: function( oArg ) {

    var d = JHtml.div('', 
                    'width: 95%; float: left; padding: 5px; margin: 0 auto;');

    if( oArg.dependencies.length ) {
      var l = JHtml.div('','width: 99%; margin: 0px; display: inline-block; margin-bottom: 10px;');
      var p = JHtml.propertyLabel('Dependencies');
      var t = JHtml.table();
      t.setAttribute('style','width: 100%');
      for(var i=0;i<oArg.dependencies.length;i++) {
        var when = oArg.dependencies[i].getElementsByTagName('td')[oArg.dependencies[i].getElementsByTagName('td').length - 1];
        oArg.dependencies[i].removeChild(when);
        var when = oArg.dependencies[i].getElementsByTagName('td')[oArg.dependencies[i].getElementsByTagName('td').length - 1];
        oArg.dependencies[i].removeChild(when);
        var when = oArg.dependencies[i].getElementsByTagName('td')[oArg.dependencies[i].getElementsByTagName('td').length - 1];
        oArg.dependencies[i].removeChild(when);
        var text = oArg.dependencies[i].getElementsByTagName('td')[0].innerHTML;
        text = text.replace('related to ','');
        text = text.replace('Feature','<img src="/images/package.png" />');
        text = text.replace('Task','');
        oArg.dependencies[i].getElementsByTagName('td')[0].innerHTML = text;

        t.appendChild(oArg.dependencies[i]);
      }
      var aux = JHtml.div();
      aux.appendChild(t);
      var s = JHtml.propertyContent(aux.innerHTML);
      l.appendChild(p);
      l.appendChild(s);
      d.appendChild(l);
    }
    
    var l = JHtml.div('','width: 99%; margin: 0px; display: inline-block; margin-bottom: 10px;');
    var p = JHtml.propertyLabel('Description');
    var s = JHtml.propertyContent(oArg.description == '' ? 'No description.' : JTextile.textile2html(oArg.description));
    l.appendChild(p);
    l.appendChild(s);
    d.appendChild(l);
   
    if ( oArg.attachments.length ) {
      var l = JHtml.div('','width: 99%; margin: 0px; display: inline-block; margin-bottom: 10px;');
      var p = JHtml.propertyLabel('Attachments');
      var s = JHtml.propertyContent( oArg.attachments[0].innerHTML);
      l.appendChild(p);
      l.appendChild(s);
      d.appendChild(l);
    }

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

  // ------------------------- List Fill --------------------------------

  /**
   *  obj = iframe object where to pull from information
   *  container = div where to set the tasks
   */
  fill: function(obj, color, task_type, container) {
    var list = listCollection.getByContainer(container);
    if(obj.contentWindow.document.getElementsByTagName('table')[4]) {
      if(list) {
        $(list.containerName).innerHTML = '';
        var iterator = obj.contentWindow.document.getElementsByTagName('table')[4].getElementsByTagName('tr');
        for(var i=1;i<iterator.length && i < 1000;i++) { 
          var t = new Task();
          t.type = task_type;
          t.color = color;
          t.parse(iterator[i]);
          list.tasks[list.tasks.length] = t;
        }
        if(parseInt(list.isFiltered) == 2) {
          list.groupBy(filterCollection.getFilters(list.fieldFiltered));
        }
      }
    }
    if (list) {
      list.reloadSubTitle();
      list.render();
    }
    TGrabber.garbageCollectOne(obj);
    SortList.doMagic();
    $(container + '-loading').fade();
  }
};

