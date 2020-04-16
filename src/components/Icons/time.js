import { format } from 'timeago.js';

const rule = {
    seconds:1000 * 60 * 1,
    hour:1000 * 60 * 60 * 1,
    day:1000 * 60 * 60 * 24,
    month:1000 * 60 * 60 * 24 * 30,
    year:1000 * 60 * 60 * 24 * 365,
}

const nullDate = { time:"", tips:"",date:""};

//TOOD: 整理为时间react组件
export default {
    init:function(UTCtiem){
        if(!UTCtiem){return nullDate}

        var nowTzo = 8;
        var tzo = (new Date().getTimezoneOffset()/60)*(-1);
        var dateTime;
        //
        if(typeof UTCtiem == "number"){
            dateTime = new Date(UTCtiem);
            if(dateTime.toString()=="Invalid Date"){
                return nullDate
            }
        }else{
            var T_pos = UTCtiem.indexOf('T');
            var Z_pos = UTCtiem.indexOf('Z');
            UTCtiem = UTCtiem.replace(/\-/g,"/");
            if(T_pos>-1){
                if(Z_pos<0){
                    Z_pos = UTCtiem.indexOf('.');
                    if(Z_pos<0){
                        Z_pos = UTCtiem.length;
                        nowTzo = 0;
                    }else{
                        var nowTzoStr = UTCtiem.substring(Z_pos+4,Z_pos+7);
                        if(nowTzoStr){
                            nowTzo = nowTzoStr - 0;
                        }
                    }
                }
                var year_month_day = UTCtiem.substr(0, T_pos);
                var hour_minute_second = UTCtiem.substr(T_pos + 1, Z_pos - T_pos - 1);
                var new_datetime = year_month_day + " " + hour_minute_second;
                if(Z_pos<UTCtiem.length){
                    nowTzo = UTCtiem.substring(Z_pos,Z_pos+3) - 0;
                }
                dateTime = new Date(new_datetime);
            }else{
                dateTime = new Date(UTCtiem);
                if(dateTime.toString()=="Invalid Date"){
                    return nullDate
                }
            }
        }


        if(nowTzo != tzo){// 时区转化
            dateTime =  new Date(dateTime.getTime() + (tzo - nowTzo) * rule.hour);
        }

        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        var second = dateTime.getSeconds();
        var gmt = dateTime.toString().replace(/.*(GMT.*)\s.*/,"$1");

        return {
            time:dateTime.getTime(),
            tips:`${month}月${day}日 ${fixed(hour,2)}:${fixed(minute,2)} ${year} ${gmt} `,
            date:`${fixed(month,2)}-${fixed(day,2)} ${fixed(hour,2)}:${fixed(minute,2)}`
        };

        function fixed(val,len){
            val = val+"";
            var prefix = "";
            if(val.length<len){
                prefix = "000000000".substring(0,len-val.length)
            }
            return prefix+val;
        }
    },
    getTag:function(time){
        var now = new Date();
        var now_time = now.getTime();
        var rateVal = time - now_time, rate = 1000;
        if(rateVal<rule.seconds){
            rate = 1000;
        }else if(rateVal<rule.hour){
            rate = rule.seconds;
        }else if(rateVal<rule.day){
            rate = rule.hour;
        }else{
            rate = rule.day;
        }
        return {
            tag:format(time,"zh_CN"),
            rate:rate
        };
    }
}
