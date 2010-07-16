
function ListContainer(title) {
  
  this.title = title;
  
  this.createList = function() {
     var container = this.renderContainer();
     container.appendChild(this.renderLoad());
     container.appendChild(this.renderBucketContainer());
     return container;
  };


  this.renderBucket = function(id) {
    var bucket = JHtml.div(id,'');
    return bucket;
  };

  this.renderBucketContainer = function() {
    var bucketc = JHtml.div(SortList.bucketContainerName(this.title),  
                                'width: 100%; margin: 0px; ' + 
                                'padding: 0px;  height: ' + (configHeight - 38) + 'px; ' + 
                                '-moz-box-shadow: 0px -3px 5px 0px #c0c0c0 inset;' + 
                                '-webkit-box-shadow: 0px -3px 5px 0px #c0c0c0 inset;' + 
                                'overflow: auto;' +
                                '-webkit-box-shadow: 0px 0px 0px 0px #c0c0c0; ');
    return bucketc;
  };

  this.renderLoad = function() {
    var loadLayer = JHtml.div(SortList.bucketContainerName(this.title) + '-loading');
    loadLayer.setAttribute('style','position: absolute; width: 100%; height: 100%;' +  
                                'opacity: 0.4; background-color: #000000; ' + 
                                'float: left; z-index: 200;');
    var loadingText = JHtml.div();
    loadingText.setAttribute('style','width: 150px; margin: 200px auto; color: white; ' + 
                                'border: 2px solid white; text-align: center; padding: 10px;');
    loadingText.innerHTML = "Loading...";
    loadLayer.appendChild(loadingText);
    return loadLayer;
  };

  this.renderContainer = function() {
    var newContainer = JHtml.div(SortList.containerName(this.title), 
                                'overflow: hidden; background-color: #ffffff; ' +
                                'border: 1px solid #c0c0c0; padding: 0px; ' +
                                '-webkit-border-radius:15px 15px 0px 0px; ' + 
                                'float: left; width: 12%; margin-left: 10px; ' + 
                                'margin-right: 0px; -moz-border-radius:15px 15px 0px 0px; ' + 
                                'height: ' + configHeight + 'px; padding-top: 0px; position: relative');
    var titleContainer = JHtml.div('',  
                                'width: 95%; margin-top: 0px; ' + 
                                'font-size: 12px; height: 20px; font-weight: bold; ' + 
                                'padding-top: 2px; padding-bottom: 2px; ' +
                                'text-align: left; padding-left: 20px;');
    var subTitleContainer = JHtml.div('subtitle-' + this.title,
                                '-moz-box-shadow: 0px 5px 5px 0px #c0c0c0;' + 
                                '-webkit-box-shadow: 0px 5px 5px 0px #c0c0c0;' + 
                                'background-image: -webkit-gradient(linear, left top, left bottom, from(white), to(#e0e0e0));' + 
                                'width: 100%; margin-top: 0px; font-size: 12px;' +
                                'padding-top: 2px; padding-bottom: 2px; height: 20px;' +
                                'padding-left: 10px;' +
                                'border-bottom: 1px solid #c0c0c0;');
    var bugs = JHtml.div('bugs-count-' + this.title,
                                'padding-left: 20px; padding-top: 2px;' +
                                'background-image: url(/images/warning.png); ' +
                                'background-repeat: no-repeat; float: left;');
    var features = JHtml.div('features-count-' + this.title,
                                'padding-left: 20px; padding-top: 2px; margin-left: 10px;' +
                                'background-image: url(/images/package.png); ' +
                                'background-repeat: no-repeat; float: left;');
    var tasks = JHtml.div('tasks-count-' + this.title,
                                'padding-top: 2px; float: left; margin-left: 10px;');
    subTitleContainer.appendChild(bugs);
    subTitleContainer.appendChild(features);
    subTitleContainer.appendChild(tasks);
  
    var titleH = JHtml.span();
    titleH.setAttribute('style','width: 36%; cursor: text; font-size: 14px; ' + 
                                'font-weight: bold; margin: 0px; padding: 0px;');
    titleH.setAttribute('onclick','listCollection.list("' + title + '").editTitle(this)');
    titleH.innerHTML = this.title;
    var rawOptions = JHtml.div('raw-options-' + this.title, 
                                'font-size: 10px; float: right; width: 10%; padding-top: 4px;');
    var rawLink = JHtml.a();
    rawLink.setAttribute('style', 'padding-left: 20px; background-image: url(/images/copy.png); ' + 
                                'background-repeat: no-repeat; cursor: pointer;');
    rawLink.setAttribute('onclick', 'listCollection.list("' + this.title + '").getRawList();');
    rawLink.innerHTML = 'Copy';
    rawOptions.appendChild(rawLink);
    
    var colorOptions = JHtml.div('',
                                'font-size: 10px; float: right; width: 50%; ' + 
                                'height: 14px; padding-right: 15px; padding-top: 2px; text-align: right;');
    colorOptions.innerHTML = 'color:';
    for(var i=0; i<Colors.list.length;i++) {
      var color = Colors.list[i];
      var colorPick = JHtml.div('',
                                'cursor: pointer; float: right; width: 10px; height: 10px; ' + 
                                'margin: 1px; border: 1px solid #c0c0c0; background-color: ' + color + ';');
      colorPick.setAttribute('onclick','listCollection.list("' + this.title + '").setColor("' + color + '")');
      colorOptions.appendChild(colorPick);
    }
    titleContainer.appendChild(titleH);
    titleContainer.appendChild(colorOptions);
    titleContainer.appendChild(rawOptions);
    newContainer.appendChild(titleContainer);
    newContainer.appendChild(subTitleContainer);
    return newContainer;
  };

  this.html = this.createList();
}


function List(list) {
  
  this.url = list[0];
  this.color = list[1];
  this.title = list[2];
  this.tasks = [];
  this.template = [];

  // Properties are the ones we set to the
  // items integrated to the list.
  // For example, when a bug is moved to a task
  // list, then the bug becomes... task!
  this.properties = [];

  // Helpers to containers names
  this.taskTypeName = function() { return this.title.split(' ').join('-'); };
  this.containerName = function() { return this.title.split(' ').join('-') + '-title'; };
  this.bucketContainerName = function() { return this.title.split(' ').join('-') + '-bucket-container'; };
  this.ticketContainerName = function(ticket) { return ticket + '-container'};
  
  // And now the variables
  this.containerName = this.bucketContainerName();
  this.taskType = this.taskTypeName();
  this.container = new ListContainer(this.title);

  this.task = function(taskId) {
    for(var i=0;i<this.tasks.length;i++) {
      if(this.tasks[i].taskId == taskId) {
        return this.tasks[i];  
      }  
    }
  };

  // ------------------ Generate Html List -----------------------

  // This function generates a list to be sent in email (i.e. Changelog)

  this.getRawList = function() {
    if($('raw-representation-' + this.containerName)) {
      var raw = $('raw-representation-' + this.containerName);
      raw.show();
    } else {
      var raw = JHtml.div('raw-representation-' + this.containerName);
      raw.setAttribute('style', 'position: absolute; width: 100%; height: 100%; background-color: #ffffff;' + 
                                  'padding: 10px; z-index: 201; top: 20px; left: 0px;');
    }
    var divClose = JHtml.div();
    var closeLink = JHtml.a();
    closeLink.setAttribute('style', 'padding-left: 20px; background-image: url(/images/close_hl.png); ' + 
                                'background-repeat: no-repeat; cursor: pointer;');
    closeLink.setAttribute('onclick', 'listCollection.list("' + this.title + '").closeRawList();');
    closeLink.innerHTML = 'Close';
    divClose.appendChild(closeLink);
      
    var text = divClose.innerHTML;

    text += '<table style="width: 100%; border: 0px;">';
    text += '<thead>';
    text += '<tr>';
    text += '<th style="text-align: left;">ID</th>';
    text += '<th style="text-align: left;">Tracker</th>';
    text += '<th style="text-align: left;">Status</th>';
    text += '<th style="text-align: left;">Priority</th>';
    text += '<th style="text-align: left;">Subject</th>';
    text += '</tr>';
    text += '</thead><tbody>';

    for(var i=0; i<this.tasks.length; i++) {
      text += '<tr>';
      text += '<td>#' + this.tasks[i].taskId  + '</td>';
      text += '<td>' + TTracker.decode(this.tasks[i].trackerId)  + '</td>';
      text += '<td>' + TStatus.decode(this.tasks[i].statusId)  + '</td>';
      text += '<td>' + TPriority.decode(this.tasks[i].priorityId)  + '</td>';
      text += '<td>' + this.tasks[i].subject  + '</td>';
      text += '</tr>'  
    }

    text += '</tbody></table>';
  
    text += divClose.innerHTML;

    raw.innerHTML = text;
    $(this.containerName).parentNode.style.overflow = 'scroll';
    $(this.containerName).parentNode.appendChild(raw);
  };

  this.closeRawList = function() {
    if($('raw-representation-' + this.containerName)) {
      $('raw-representation-' + this.containerName).fade();
      $('raw-representation-' + this.containerName).innerHTML = '';
      $(this.containerName).parentNode.style.overflow = 'hidden';
    }
  };

  // ------------------ Modifiers ---------------------------------

  this.editTitle = function(obj) {
    var edit = JHtml.textbox('', '150px', obj.innerHTML);
    edit.setAttribute('style',  'border: 0px; height: 16px;' +
                                'padding-top: 0px; padding-bottom: 2px; ' +
                                'font-size: 14px; font-weight: bold;');
    edit.setAttribute('onblur', 'listCollection.list("' + this.title + '").setTitle(this.value); ' + 
                                'this.style.display = "none"; ' + 
                                'this.parentNode.childNodes[0].style.display = "";');
    obj.parentNode.insertBefore(edit, obj.parentNode.childNodes[1]); 
    edit.focus();
    obj.style.display = 'none';
  },


  this.setTitle = function(title) {
    this.title = title;
    $(this.containerName).parentNode.childNodes[0].childNodes[0].innerHTML = title;
    JInterface.storePreferences();
  };

  this.setColor = function(color) {
    this.color = color;
    for(var i=0;i<this.tasks.length;i++) {
      this.tasks[i].setColor(color);  
    }
    JInterface.storePreferences();
  },

  // ------------------ Information ------------------------------

  this.dificulty = function() {
    var total = 0;
    for(var i=0;i<this.tasks.length;i++) {
      total += this.tasks[i].dificulty;
    }
    return total;
  };

  this.bugsCounter = function() {
    var total = 0;
    for(var i=0;i<this.tasks.length;i++) {
      total += this.tasks[i].trackerId == TTracker.BUG ? 1 : 0;
    }
    return total;
  };

  this.featuresCounter = function() {
    var total = 0;
    for(var i=0;i<this.tasks.length;i++) {
      total += this.tasks[i].trackerId == TTracker.FEATURE ? 1 : 0;
    }
    return total;
   
  };

  this.tasksCounter = function() {
    var total = 0;
    for(var i=0;i<this.tasks.length;i++) {
      total += this.tasks[i].trackerId == TTracker.TASK ? 1 : 0;
    }
    return total;
  };

  this.reloadSubTitle = function() {
    $('bugs-count-' + this.title).innerHTML = this.bugsCounter() + ' bug' + (this.bugsCounter() == 1 ? "" : "s");     
    $('features-count-' + this.title).innerHTML = this.featuresCounter() + ' feature' + (this.featuresCounter() == 1 ? "" : "s");     
    $('tasks-count-' + this.title).innerHTML = this.tasksCounter() + ' task' + (this.tasksCounter() == 1 ? "" : "s");     
  };

  // ------------------ Iframe load -------------------------------

  this.load = function() {
    $(this.containerName + '-loading').show();
    this.tasks = [];
    TGrabber.getTasks(this.url, "SortList.fill(this,'" + this.color + "','" + this.taskType + "','" + this.containerName + "')")
  };

}

function Task() {

  this.taskId = null;
  this.subject = null;
  this.projectId = null;
  this.assigned = '';
  this.categoryId = null;
  this.versionId = null;
  this.priorityId = null;
  this.trackerId = null;
  this.dificulty = 1;
  this.startDate = null;
  this.dueDate = null;
  this.updated = null;
  this.hours = null;
  this.description = null;

  // Full task view
  this.fullContainerId = null;

  // status vars
  this.isAssigned = false;
  this.type = null;
  this.id = null;
  this.color = '#ffffff';

  // HTML to return back
  this.html = null;

  this.setId = function() {
    this.id = this.type + '-issue-' + this.taskId;
    this.fullContainerId = this.id + '-full-container';
    this.html.id = this.id;
  };

  this.setColor = function(color) {
    this.color = color;
    this.html.style.background = color;
  };
 
  this.parse = function(task) {
    
    var aux = JHtml.div();
    aux.innerHTML =  '<table border="0" width="100%" style="font-size: 11px;">' + task.innerHTML + '</table>';
    var tds = aux.getElementsByTagName('TD');
    var notAssigned = false;
    var dificulty = 1;

    for(var j=0;j<tds.length;j++) {
      if(tds[j].className == 'checkbox') {
        tds[j].innerHTML = '';
        tds[j].style.width = '3%';
        var menuFull = tds[j];
      } else if(tds[j].className == 'updated_on') {
        var updated = tds[j].innerHTML;
        this.updated = new Date(updated);
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'author') {
        var author = tds[j].innerHTML;
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'tracker') {
        var tracker = tds[j].innerHTML;
        this.trackerId = TTracker.code(tracker);
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'priority') {
        var priority = tds[j].innerHTML;
        this.priorityId = TPriority.code(priority);
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'project') {
        var project = tds[j].innerHTML;
        this.projectId = project;
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'cf_3') {
        dificulty = tds[j].innerHTML;
        this.dificulty = parseInt(dificulty ? dificulty : 0);
        tds[j].parentNode.removeChild(tds[j]);
        j-=1;
      } else if(tds[j].className == 'status') {
        var status_id = TStatus.code(tds[j].innerHTML);
        this.statusId = status_id;
        tds[j].parentNode.removeChild(tds[j]);
        j -= 1;
      } else if(tds[j].className == 'subject') {
        this.subject = tds[j].innerHTML;
      } else if(tds[j].className == 'assigned_to') {
        tds[j].setAttribute('width','8%');
        tds[j].setAttribute('align','center');
        if(tds[j].innerHTML == '') {
          this.isAssigned = false;
        } else {
          this.isAssigned = true;
          this.assigned = tds[j].innerHTML;
          tds[j].innerHTML = this.formatAssignedName(tds[j].childNodes[0]);
        }
      } else if (tds[j].innerHTML.indexOf('/issues/') != -1) {
        tds[j].setAttribute('width','10%');
        tds[j].setAttribute('align','center');
        var link = tds[j].getElementsByTagName('A')[0].innerHTML;
        this.taskId = link;
        tds[j].getElementsByTagName('A')[0].innerHTML = '#' + link;
        this.linkToTask = tds[j].getElementsByTagName('A')[0];
      }
    }
    
    if(this.trackerId == TTracker.FEATURE) {
      this.linkToTask.setAttribute('style','background-image: url(/images/package.png);' + 
                                'background-repeat: no-repeat; padding-left: 20px;');
    } else if (this.trackerId == TTracker.BUG){
      this.linkToTask.setAttribute('style','background-image: url(/images/warning.png);' + 
                               'background-repeat: no-repeat; padding-left: 20px;');
    }

    var dificultyOps = JHtml.td();
    dificultyOps.setAttribute('width','8%');
    dificultyOps.appendChild(this.dificultyMenu(dificulty));
    aux.getElementsByTagName('TR')[0].appendChild(dificultyOps);   
 
    var taskButtons = JHtml.td();
    taskButtons.appendChild(this.taskOptions());
    taskButtons.setAttribute('width','10%');
    taskButtons.setAttribute('align','right');
    aux.getElementsByTagName('TR')[0].appendChild(taskButtons);  
    aux.setAttribute('style',
            'cursor: pointer; border-top: 1px solid #c0c0c0; padding-top: 2px; padding-bottom: 2px;');

    this.html =  aux;

    this.setColor(this.color);
    this.setId();

    menuFull.appendChild(this.fullTaskMenu());
  };
 
  this.taskOptions = function() {
    var options = JHtml.span();
    options.setAttribute('style','padding-right: 5px;');
    options.setAttribute('align','right');
    if(!this.isAssigned) {
      var buttonAccept = JHtml.greenButton('Accept','listCollection.task("' + this.taskId + '").setAssigned(' + sortMe + ')');
      options.appendChild(buttonAccept);
    }
      
    if(this.statusId == TStatus.NEW || this.statusId == TStatus.ACCEPTED) {
      var buttonAccept = JHtml.greyButton('Start','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.IN_PROGRESS + ')');
      options.appendChild(buttonAccept);
    } else if (this.statusId == TStatus.IN_PROGRESS) {
      var buttonStop = JHtml.redButton('Stop','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.NEW + ')');
      var buttonFinish = JHtml.greenButton('Fixed','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.FIXED + ')');
      options.appendChild(buttonStop);
      options.appendChild(buttonFinish);
    } else if (this.statusId == TStatus.ENGINEERING_FEEDBACK) {
      var buttonReopen = JHtml.greyButton('Reopen','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.NEW + ')');
      var buttonPush = JHtml.greenButton('Push','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.PUSH + ')');
      options.appendChild(buttonReopen);
      options.appendChild(buttonPush);
    } else if (this.statusId == TStatus.PUSHED ) {
      var buttonFailing = JHtml.redButton('Failing','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.FAILING + ')');
      var buttonClose = JHtml.greenButton('Close','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.CLOSED + ')');
      options.appendChild(buttonClose);
      options.appendChild(buttonFailing);
    } else if (this.statusId == TStatus.CLOSED ) {
      var buttonReopen = JHtml.greyButton('Reopen','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.NEW + ')');
      options.appendChild(buttonReopen);
    } else if (this.statusId == TStatus.FAILING || this.statusId == TStatus.QA_FEEDBACK) {
      var buttonReopen = JHtml.greyButton('Reopen','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.NEW + ')');
      options.appendChild(buttonReopen);
    } else if (this.statusId == TStatus.FIXED || this.statusId == TStatus.REJECTED || this.statusId == TStatus.DEFERRED) {
      var buttonReopen = JHtml.greyButton('Reopen','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.NEW + ')');
      var buttonPush = JHtml.greenButton('Push','listCollection.task("' + this.taskId + '").setStatus(' + TStatus.PUSHED + ')');
      options.appendChild(buttonReopen);
      options.appendChild(buttonPush);
    }
    return options;
  };

  this.showFull = function(menu) {
    if($(this.fullContainerId)) {
      $(this.id).removeChild($(this.fullContainerId));
      menu.setAttribute('style','background-image: url(/images/arrow_collapsed.png); background-repeat: no-repeat;');
    } else {
      menu.setAttribute('style','background-image: url(/images/arrow_expanded.png); background-repeat: no-repeat;');
      var c = JHtml.div(this.fullContainerId,'width: 99%; display: inline-block;');
      $(this.id).appendChild(c);
      TGrabber.getFullTask(this.taskId, this.fullContainerId);
    }
  };

  this.fullTaskMenu = function(id) {
    var d = JHtml.div();
    d.setAttribute('style','background-image: url(/images/arrow_collapsed.png); background-repeat: no-repeat;');
    d.innerHTML = '&nbsp;';
    d.setAttribute('onclick','listCollection.task("' + this.taskId + '").showFull(this);');
    return d;
  };
  
  this.formatAssignedName = function(name) {
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
  };

  this.dificultyMenu = function(dificulty) {
    var menu = JHtml.span();
    menu.setAttribute('style','padding: 2px;');
    dificulty = dificulty ? dificulty : 0;
    for (var ii=0;ii<dificulty; ii++) {
      var dif = parseInt(ii) + 1;
      var bar = JHtml.divDif('dif-' + ii, 
                          '-moz-border-radius:4px 4px 4px 4px; margin: 1px; ' + 
                          '-webkit-border-radius:4px 4px 4px 4px; ' + 
                          'float: left; width: 3px; height: 12px; font-size: 10px; ' + 
                          'border: 1px solid #808080; background-color: #808080; cursor: pointer;');
      bar.setAttribute('onclick','listCollection.task("' + this.taskId + '").setDificulty(' + dif + ')');
      bar.innerHTML = '&nbsp;';
      menu.appendChild(bar);
    }
    for (var i=dificulty; i<3; i++){
      var dif = parseInt(i) + 1;
      var bar = JHtml.divDif('dif-' + i, 
                          '-moz-border-radius: 4px 4px 4px 4px; margin: 1px; ' + 
                          '-webkit-border-radius: 4px 4px 4px 4px; ' + 
                          'float: left; width: 3px; height: 12px; font-size: 10px; ' + 
                          'border: 1px solid #808080; cursor: pointer;');
      bar.setAttribute('onclick','listCollection.task("' + this.taskId + '").setDificulty(' + dif + ')');
      bar.innerHTML = '&nbsp;';
      menu.appendChild(bar);
    }
    return menu;
  };

  this.setStatus = function(statusId) {
    var params = '[[TGrabber.issueStatusId, ' + statusId + ']';
    if(parseInt(statusId) == TStatus.FIXED || parseInt(statusId) == TStatus.CLOSED || parseInt(statusId) == TStatus.REJECTED) {
      var today = new Date();
      params += ',[TGrabber.issueDueDate, "' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '"]'
    } else if(parseInt(statusId) == TStatus.IN_PROGRESS) {
      var today = new Date();
      params += ',[TGrabber.issueStartDate, "' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '"]'
    }

    params += ']';
    TGrabber.editTask(this.taskId,'TGrabber.ticketChangeValue(this, ' + params + ', true)');
  };

  this.setAssigned = function(assigned) {
    TGrabber.editTask(this.taskId,'TGrabber.ticketChangeValue(this, [[TGrabber.issueAssignedTo, ' + assigned +']], true)');
  };

  this.setDificulty = function(dificulty) {
    this.dificulty = dificulty;

    TGrabber.editTask(this.taskId,'TGrabber.ticketChangeValue(this, [[TGrabber.issueDificulty, ' + dificulty +']], false)');

    var task = $(this.id);
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
  };
}


