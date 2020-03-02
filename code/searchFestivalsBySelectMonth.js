module.exports.function = function searchFestivalsBySelectMonth (monthOperand) {
  const config = require('config');
  const fail = require('fail');
  const http = require('http');
  const console = require('console');
  const dates = require('dates');
  
  // 설정한 property(capsule.properties)로부터 데이터를 가져옵니다.
  const baseURL = config.get("baseUrl");
  let response = null;
  let result = {};
  //var date= new ZonedDateTime("America/Los_Angeles", now);
  
  //날짜 구하기
  var today = new Date();
  var dd = today.getDate();
  //var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  var thisday;
  
  if(dd<10) {dd='0'+dd} 
  if(monthOperand<10) {
    monthOperand='0'+monthOperand
  } 
  
  
  
  url=baseURL+"&sortStdr=1&from="+yyyy+monthOperand+"01"+"&to="+yyyy+monthOperand+"31"+"&cPage=1&rows=10&place=1"
  response = http.getUrl(url, {format:"xmljs"});
  
  
  console.log("MONTH IS:",monthOperand+"월");
  console.log("PLAY IS:",yyyy+monthOperand+"01"+"~"+yyyy+monthOperand+"31");
  
  
  var seq;
  var seqList=[];
  var numberOfFestivals; //festival 개수
  var festivals=[];
  
  perforList=response.response.msgBody.perforList;
  console.log("perforList is:",perforList);
  //공연이 없을 때
  if(perforList==null)
    {
      throw fail.checkedError("해당하는 공연 없음", "NoResult");
    }
  else{
    numberOfFestivals=response.response.msgBody.perforList.length;
    totalCount=response.response.msgBody.totalCount;
    console.log("totalCount is:",totalCount);
   
  }
 
  numberOfFestivals=totalCount;
  console.log("numberOfFestivals is:",numberOfFestivals);
  
  if(numberOfFestivals==1){
   seq=JSON.stringify(response.response.msgBody.perforList.seq);
   console.log("seq is:",seq);
   seq=seq.replace(/\"/gi, "");
   seqList.push(seq); 
  }
  
  else{
     for(var i = 0; i <numberOfFestivals; i++){
   seq=JSON.stringify(response.response.msgBody.perforList[i].seq);
   //console.log("seq is:",seq);
   seq=seq.replace(/\"/gi, "");
   seqList.push(seq); 
   }
  }
 
 
  console.log("seqlist is:",seqList);

  //상세정보 찾기
  
  for(var i = 0; i <numberOfFestivals; i++){
         realUrl ="http://www.culture.go.kr/openapi/rest/publicperformancedisplays/d/?serviceKey=7HV1NXTJ8tcE1U05EbiPpI0yLe%2B2wdOr5JuUREEoLRfIOXcwb5HTAM%2FDSQHysU3Fi1052eihywetgrI9HWnjrQ%3D%3D&RequestTime=20100810%3A23003422&seq=" + String(seqList[i]);
 console.log("번호 " + String(seqList[i]));
     response = http.getUrl(realUrl, {format: 'xmljs'});

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
   }
  console.log("Festivals IS:",festivals);
   return festivals;
}