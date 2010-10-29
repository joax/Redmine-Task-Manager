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
      arrayT[arrayT.length] = [this.lists[i].url, this.lists[i].color, this.lists[i].title];
    }
    return arrayT;
  };

  this.parse = function(array) {
    this.lists = [];
    for(var i=0;i<array.length;i++) {
      this.addList(new List([array[i][0], array[i][1], array[i][2]])); 
    }
  };
}

var listCollection = new ListCollection();
var filterCollection = new FilterCollection();

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

   list: ['#FF5050','#ffd0d0','#50FF50','#d0ffd0','#5050FF','#d0d0ff','#f0f0f0','#ffffff'],
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
    SortList.createCookie('RedmineTasker', JInterface.serializePreferences(listCollection.serializable()), 10);
  },

  retrievePreferences: function() {
    var arrayP = SortList.readCookie('RedmineTasker');
    if(arrayP && arrayP.length > 0) {
      listCollection.lists = [];
      listCollection.parse(JInterface.unserializePreferences(arrayP));
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
                            'width: 1000px; margin: 0px auto; padding: 10px;');
    
    var menuList  = JInterface.menuCanvas('menu_filters','380px', 500);
    var menuAdd   = JInterface.menuCanvas('menu_add','440px', 40);
    var menuSpeed = JInterface.menuCanvas('menu_canvas','200px', 800);
    
    var menuFilterList  = JInterface.menuContent(menuList.id, '80%');
    var menuAddList     = JInterface.menuContent(menuAdd.id, '95%');
    var menuSpeedList   = JInterface.menuContent(menuSpeed.id, '95%');

    menuAdd = JInterface.menuTitle('Add Task',menuAdd);
    menuList = JInterface.menuTitle('Tasks Filters',menuList);
    menuSpeed = JInterface.menuTitle('Speed',menuSpeed);
  
    for(var j=0;j<listCollection.length();j++) {
      var speedC  = JHtml.div('',
                          'float: left; margin: 2px; height: 20px; width: 20px;' + 
                          'font-size: 18px; font-weight: bold');
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
      listCollection = new ListCollection();
      listCollection.parse(newList);
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
        filtersDisplay[filtersDisplay.length] = [listCollection.lists[i].url, listCollection.lists[i].color, listCollection.lists[i].title];
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

  setupList: function(url, color, title) {
    var list = new List([url, color, title]);
    var container = list.container.html;
    $('listsContainer').appendChild(container);
    list.load();
    listCollection.addList(list);
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
    var width = 95 / listCollection.length();
    for(var i=0; i<listCollection.length();i++) { 
      $(listCollection.lists[i].containerName).parentNode.style.width = width + '%'; 
    }
    setTimeout('SortList.doMagic()',2000);
    SortList.addSizeLayer();
  },

  renderListsContainer: function() {
     var listsContainer = JHtml.div('listsContainer', 'width: 99%; margin-top: 20px; display: inline-block');
     $('content').appendChild(listsContainer); 
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

  // --------------- Load and creation -----------------------------

  reload: function() {
    for(var i=0; i<listCollection.length(); i++) {
      listCollection.lists[i].load();
    }
  },

  doMagic: function() { 
    for(var i = 0;i<listCollection.length(); i++) {
      container   = listCollection.lists[i].containerName;
      colorf      = listCollection.lists[i].color;
      task_type   = listCollection.lists[i].taskType;
      Sortable.create(container, { 
        elements: $$('#' + container + ' div'), 
        containment: SortList.getListNames(),
      });
      // And now we do Sortable!
      var tasks   = $(container).childNodes;
      for(var j=0; j<tasks.length; j++) { new Draggable( tasks[j].id ,{revert: true});  }
    }
  },
  
  // --------------------- Individual Task ------------------------------

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

  // ------------------------- List Fill --------------------------------

  /**
   *  obj = iframe object where to pull from information
   *  container = div where to set the tasks
   */
  fill: function(obj, color, task_type, container) {
    if(obj.contentWindow.document.getElementsByTagName('table')[4]) {
      var list = listCollection.getByContainer(container);
      if(list) {
        $(list.containerName).innerHTML = '';
        var iterator = obj.contentWindow.document.getElementsByTagName('table')[4].getElementsByTagName('tr');
        for(var i=1;i<iterator.length && i < 100;i++) { 
          var t = new Task();
          t.type = task_type;
          t.color = color;
          t.parse(iterator[i]);
          $(list.containerName).appendChild(t.html);
          list.tasks[list.tasks.length] = t;
        }
        // Lets add the last element
        var end = JHtml.div();
        end.setAttribute('style','width: 100%; height: 2px; border-top: 1px solid #c0c0c0; ' +
                            ' border-bottom: 1px solid #c0c0c0; font-size: 2px;' +
                            '-moz-box-shadow: 0px 5px 5px 0px #c0c0c0;' +
                            '-webkit-box-shadow: 0px 3px 3px 0px #c0c0c0;');
        end.innerHTML = '&nbsp;';
        $(list.containerName).appendChild(end);
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

