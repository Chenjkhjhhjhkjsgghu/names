import $ from 'jquery'


let data = {};


if(sessionStorage.getItem("data")!==null)
{
   data = JSON.parse(sessionStorage.getItem("data"));
}
else{
    $.ajax({
        url:'http://firebird.cc:3000/get_sites',
        type:'get', //GET
        async:false,   
        timeout:5000,    
        dataType:'json',   
        success:function(res){
            data = res;
            sessionStorage.setItem('data',JSON.stringify(res))
        }
    })
    
}
export default data




