
var fns={
	formateDate:function(date){
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    var hours=date.getHours();
    var minutes=date.getMinutes();
    var str=year+"-"+month+"-"+day+" "+hours+":"+minutes;
    return str;
  }
}

module.exports=fns