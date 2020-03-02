module.exports.function = function plusOperation (sido,gugun,monthOperand) {
  var http=require('http');
  var console=require('console');

  var festivals=[];//festival의 이름, imageurl, 시도, 구군의 정보를 담는 리스트
  var numberOfFestivals; //festival 개수
  var imageurl; // festival의 image url
  var i=0; //while문 안에서 사용할 변수(festival 개수 세는거)
  var festTitle;//축제 이름
  var realmName;//축제 분야
  var startDate;
  var endDate;
  var seq;
  var seqList=[];
    var today;
  var dd;
  var yyyy;
  var sDate;
  var eDate;
  
  if (gugun == null){
    gugun = '';
  }
  if(monthOperand==null){
    sDate='';
    eDate='';
  }else{
    today = new Date();
    yyyy = today.getFullYear();
    if(monthOperand<10) {
      monthOperand='0'+monthOperand;
    } 
    sDate=yyyy+monthOperand+"01";
    eDate=yyyy+monthOperand+"31";
  }
  
  var len=sido.length();

  
  var url = 'http://www.culture.go.kr/openapi/rest/publicperformancedisplays/area'; /*URL*/
  var queryParams = '?' + encodeURIComponent('ServiceKey') + '='+'U%2FGshTg04%2FJXM3REnCkf9H8c%2F2pd3rlsqb4d4S%2B9bo7zjaz5jmouQnbhOjum6EI3eDoUHnpBmlzyRMVIwAhOxQ%3D%3D'; /*Service Key*/
  queryParams += '&' + encodeURIComponent('ComMsgHeader') + '=' + encodeURIComponent(''); /**/
 queryParams += '&' + encodeURIComponent('RequestTime') + '=' + encodeURIComponent('20190506:23003422'); /*Optional 필드*/
queryParams += '&' + encodeURIComponent('CallBackURI') + '=' + encodeURIComponent(''); /*Optional 필드*/
queryParams += '&' + encodeURIComponent('MsgBody') + '=' + encodeURIComponent(''); /**/
queryParams += '&' + encodeURIComponent('sido') + '=' + encodeURIComponent(sido); /**/
queryParams += '&' + encodeURIComponent('gugun') + '=' + encodeURIComponent(gugun); /**/
queryParams += '&' + encodeURIComponent('from') + '=' + encodeURIComponent(sDate); /**/
queryParams += '&' + encodeURIComponent('to') + '=' + encodeURIComponent(eDate); /**/
// queryParams += '&' + encodeURIComponent('place') + '=' + encodeURIComponent('1'); /**/
// queryParams += '&' + encodeURIComponent('gpsxfrom') + '=' + encodeURIComponent('129.101'); /*경도 범위검색 중 하한*/
// queryParams += '&' + encodeURIComponent('gpsyfrom') + '=' + encodeURIComponent('35.142'); /*위도 범위검색 중 하한*/
// queryParams += '&' + encodeURIComponent('gpsxto') + '=' + encodeURIComponent('129.101'); /*경도 범위검색 중 상한*/
// queryParams += '&' + encodeURIComponent('gpsyto') + '=' + encodeURIComponent('35.142'); /*위도 범위검색 중 상한*/
// queryParams += '&' + encodeURIComponent('cPage') + '=' + encodeURIComponent('1'); /**/
// queryParams += '&' + encodeURIComponent('rows') + '=' + encodeURIComponent('10'); /**/
// queryParams += '&' + encodeURIComponent('keyword') + '=' + encodeURIComponent(''); /**/

  var res=http.getUrl(url+queryParams,{
    format:'xmljs'
  });
   var perforList = JSON.stringify(res.response.msgBody.perforList);
  
     //공연이 없을 때
  if(perforList==null)
    {
      throw fail.checkedError(sido, "NoResult");
    }


  //API에서 제공하는 축제 개수->안맞음
  // numberOfFestivals=JSON.stringify(res.response.msgBody.totalCount);
  // numberOfFestivals=numberOfFestivals.replace('"',"");
  // numberOfFestivals=numberOfFestivals.replace('"',"");
  
  //축제 갯수(직접 세어 봄)
  while(true){
    try{
      seq=JSON.stringify(res.response.msgBody.perforList[i].seq); 
    }catch(err){
      break;
    }
    seq=seq.replace(/\"/gi, "");
    seqList.push(seq);
    i++;
  }
  numberOfFestivals=i+1;
  i=0;
  
  //상세정보 찾기
  var response;
  var realUrl;
  
  while(true){
    try{
         realUrl = "http://www.culture.go.kr/openapi/rest/publicperformancedisplays/d/?serviceKey=7HV1NXTJ8tcE1U05EbiPpI0yLe%2B2wdOr5JuUREEoLRfIOXcwb5HTAM%2FDSQHysU3Fi1052eihywetgrI9HWnjrQ%3D%3D&RequestTime=20100810%3A23003422&seq=" + String(seqList[i]);
 console.log("번호 " + String(seqList[i]));
     response = http.getUrl(realUrl, {
                 format: 'xmljs'
        });

    var title = JSON.stringify(response.response.msgBody.perforInfo.title);  //제목
    //var subTitle = JSON.stringify(response.response.msgBody.perforInfo.subTitle);  //부제목
    var startDate = JSON.stringify(response.response.msgBody.perforInfo.startDate); //시작날짜
    var endDate = JSON.stringify(response.response.msgBody.perforInfo.endDate); //종료날짜
    var place = JSON.stringify(response.response.msgBody.perforInfo.place); //장소이름
    var realmName = JSON.stringify(response.response.msgBody.perforInfo.realmName);  //분류명
    var price = JSON.stringify(response.response.msgBody.perforInfo.price); //가격
    //var contents1 = JSON.stringify(response.response.msgBody.perforInfo.contents1);  //내용1
    //var contents2 = JSON.stringify(response.response.msgBody.perforInfo.contents2);  //내용2
    var imgUrl = JSON.stringify(response.response.msgBody.perforInfo.imgUrl); //이미지Url
    var placeAddr = JSON.stringify(response.response.msgBody.perforInfo.placeAddr); //상세주소
    var placeUrl = JSON.stringify(response.response.msgBody.perforInfo.placeUrl); //장소주소
    var phone = JSON.stringify(response.response.msgBody.perforInfo.phone); //전화번호
    var url = JSON.stringify(response.response.msgBody.perforInfo.url); //싸이트 주소
    if(placeAddr == '{}'){
      placeAddr = '홈페이지 참조'
    }
    if(placeUrl == '{}'){
      placeUrl = '-'
    }
    if(url == '{}'){
      url = '-'
    }
      
    }catch(err){
      break;
    }
    //console.log("번호 " + String(seqList[i]));
    //contents1 = contents1.replace(/(<([^>]+)>)/ig,"");  //html 요소 제거
    //contents1 = contents1.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,"");
    //contents1 = contents1.replace(/rn/g,"");
    //contents1 = contents1.replace(/middot/g,"·");
    title = title.replace(/\"/gi, "");  //따옴표 제거
    imgUrl = imgUrl.replace(/\"/gi, "");
    realmName=realmName.replace(/\"/gi, ""); 
    startDate=startDate.replace(/\"/gi, ""); 
    endDate=endDate.replace(/\"/gi, ""); 
    placeAddr=placeAddr.replace(/\"/gi, "");
    url=url.replace(/\"/gi, "");
    phone=phone.replace(/\"/gi, "");
    placeUrl=placeUrl.replace(/\"/gi, "");
    price=price.replace(/\"/gi, "");
    place=place.replace(/\"/gi, "");
     


    festivals.push({
      title: title,
      //subTitle: subTitle,
      startDate: startDate,
      endDate: endDate,
      place: place,
      realmName: realmName,
      price: price,
      //contents1: contents1,
      //contents2: contents2,
      imgUrl: imgUrl,
      placeAddr: placeAddr,
      placeUrl: placeUrl,
      phone: phone,
      numberOfFestivals:numberOfFestivals,
      url:url
    });
    i++;
   }
 
console.log("Festivals IS:",festivals);
  return festivals;
}
