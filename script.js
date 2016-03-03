'use strict';

Number.parseInt = Number.parseInt || window.parseInt;

var day = $('.calDay');

function createTimes(){
  for(var items = [],minutes,hours,meridiem,i = 0;i < 720;i += 30){
    minutes = (i % 60 || '00').toString();
    hours = Math.floor(i / 60) + 1;
    meridiem = minutes === '00' ? (hours < 9 || hours === 12 ? 'PM' : 'AM') : '';

    items.push(hours + ':' + minutes + meridiem);
  }
  items = items.concat(items.splice(0,16),'9:00PM');
  return items;
}

function buildTimesDom(times){
  var template = '<li>{{content}}</li>',
    template2 = '<span>{{time}}</span>{{meridiem}}',
    content;

  for(var hours = [],i = 0;i<times.length;i++){
    if(/00/.test(times[i])){
      template2 = template2
        .replace(/\{\{time\}\}/,'$1')
        .replace(/\{\{meridiem\}\}/,'$2');

      content = times[i].replace(/(\d{1,2}:00)([A|P]M)/i,template2);
    }else
      content = times[i];

    content = template.replace(/\{\{\w*\}\}/g,content);
    hours.push(content);
  }

  $(hours.join('')).appendTo($('ul.hours',day));
}



function setupEvents(events){
  var cols = [];

  for(var i = 0,j,obj,l,col;i < events.length;i++){
    obj = {
      start: events[i].start,
      end: events[i].end,
      width: 1,
      overlapIndex: -1
    };
    for(j = 0,col = cols[j];j < cols.length;col = cols[++j]){
      if(obj.start > col[col.length-1].end){
        break;
      }
      obj.width++;
      obj.overlapIndex = col.length-1;
    }
    if(j === cols.length){
      cols.push([obj]);
    }else{
      cols[j].push(obj);
      for(var g = j+1;g < cols.length;g++){
        if(obj.start <= cols[g][cols[g].length-1].end){
          obj.width = cols[g][cols[g].length-1].width;
          break;
        }
      }
    }
    l = cols[j][cols[j].length-1].overlapIndex;
    if(l > -1){
      for(var k = j-1,h = l,end = cols[j][cols[j].length-1].end;
          k > -1;
          end = cols[k][l].end,l = cols[k--][l].overlapIndex,h = l){
        while(h < cols[k].length && cols[k][h].start <= end){
          cols[k][h++].width = obj.width;
        }
      }
    }
  }

  return cols;
}

function buildDom(cols){
  var elements = [],
    template = '<li style="height:{{height}}px;top:{{top}};width:{{width}}px;left:{{left}};" ' +
      '<h3>Sample Item</h3><h4>Sample Location</h4>' +
      'start:{{start}},end:{{end}}</li>';

  for(var a = 0,width = 600,spacingWidth = 14;a < cols.length;a++){
    for(var b = 0;b < cols[a].length;b++){
      elements.push(template
        .replace(/\{\{start\}\}/g,cols[a][b].start)
        .replace(/\{\{end\}\}/g,cols[a][b].end)
        .replace(/\{\{top\}\}/g,cols[a][b].start)
        .replace(/\{\{height\}\}/,cols[a][b].end - cols[a][b].start - 12)
        .replace(/\{\{width\}\}/,(width / cols[a][b].width) - spacingWidth)
        .replace(/\{\{left\}\}/,(a * (width / cols[a][b].width)) + 10)
        );
    }
  }

  $(elements.join('')).appendTo($('ul.events',day));
}

function layOutDay(events){
  buildDom(setupEvents(events));
}

var data = [{
  start: 30,
  end: 150},
{start: 540,
  end: 600},
{start: 560,
  end: 720},
{start: 601,
  end: 650},
{start: 640,
  end: 690},
{start: 660,
  end: 700},
{start: 695,
  end: 720}];
/*
var data = [{
  start: 30,
  end: 150},
{start: 540,
  end: 600},
{start: 560,
  end: 620},
{start: 610,
  end: 670}];
*/


buildTimesDom(createTimes());

layOutDay(data);
