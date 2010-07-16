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
    listDepth = 0;
    oldDepth = 0;

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
      
      var addList = '';
      if (line.search(/^\s*\*\s+/) != -1) { 
        if(!listDepth)
          addList = '<ul>';
        if(listDepth == 2) 
          addList = '</ul>';
        if(listDepth == 3)
          addList = '</ul></ul>';
        line = line.replace(/^\s*\*\s+/,'\t' + addList + '<liu>') + '</liu>'; 
        changed = 2; 
        listDepth = 1;
      } 
      if (line.search(/^\s*\*\*\s+/) != -1) { 
        if(listDepth == 1) 
          addList = '<ul>';
        if(listDepth == 3)
          addList = '</ul>';
        line = line.replace(/^\s*\*\*\s+/,'\t' + addList + '<liu>') + '</liu>'; 
        changed = 2; 
        listDepth = 2;
      } 
      if (line.search(/^\s*\*\*\*\s+/) != -1) { 
        if(listDepth == 2)
          addList = '<ul>';
        line = line.replace(/^\s*\*\*\*\s+/,'\t' + addList + '<liu>') + '</liu>'; 
        changed = 2; 
        listDepth = 3;
      } 
      
      // * for bullet list; make up an liu tag to be fixed later
      if (line.search(/^\s*#\s+/) != -1) { line = line.replace(/^\s*#\s+/,'\t<lio>') + '</lio>'; changed = 1; } 
      // # for numeric list; make up an lio tag to be fixed later

      if(changed != 2 && listDepth) {
        var ul = '';
        for(var z=0;z<listDepth;z++)
          ul += '</ul>';
        line = ul + line;
        listDepth = 0;
      }

      if (!changed && (line.replace(/\s/g,'').length > 0)) { 
        line = '<p>'+line+'</p>';
      }
      lines[i] = line + '\n';
    }
  
    // Second pass to do lists
    inlist = 0; 
    listtype = '';
    for (var i=0;i<lines.length;i++) {
        line = lines[i];
        if (inlist && listtype == 'ol' && !line.match(/^\t<lio/)) { line = '</ol>\n' + line; inlist -= 1; }
        if (!inlist && line.match(/^\t<lio/)) { line = '<ol>' + line; inlist += 1; listtype = 'ol'; }
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
  
  ul: function() {
    return JHtml.createElement('UL');
  },

  li: function() {
    return JHtml.createElement('LI');
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
  
  textarea: function(id, width, value) {
    var t = JHtml.createElement('TEXTAREA')
    t.setAttribute('type','textbox');
    t.setAttribute('style','border: 1px solid #c0c0c0; width: ' + width + '; height: 60px;');
    t.setAttribute('onfocus','this.style.border = "1px solid #606060";');
    t.setAttribute('onblur','this.style.border = "1px solid #c0c0c0";');
    t.setAttribute('id',id);
    t.setAttribute('name',name);
    t.innerHTML = value;
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
             'border: 1px solid ' + border + '; padding: 2px 5px 2px 5px; ' + 
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
    var p = JHtml.div('','float:left; width: 20%;text-align: right; padding-right: 4px; font-weight: bold;');
    p.innerHTML = label;
    return p;
  },

  propertyContent: function(params) {
    var content = params;
    var p = JHtml.div('','float: right; width: 75%;');
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

