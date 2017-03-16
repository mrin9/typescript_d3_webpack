export class DataService {
    public timeSerise(dataLength?:number, intervalInMili?:number):Array<TimeSeriseType>{
        if (typeof intervalInMili !=='number'){
            intervalInMili=10000;
        }
        if (typeof dataLength !=='number'){
            dataLength=6;
        }

        var data:Array<TimeSeriseType> = [];
        var now:Date = new Date();
        var initialTime:Date = new Date(now.getTime() - (dataLength * intervalInMili) );
        for (let i:number = 0; i < dataLength; i++) {
            let tm:number = (initialTime.getTime() + (i * intervalInMili));
            //var tm =  new Date(initialTime.getTime() + (i * intervalInMili)).toLocaleString('en-US', {  minute:'2-digit', second: '2-digit' });
            data.push({
                "time" : tm,
                "value": Math.floor(Math.random() * 10) + 1
            });
        }
        return data;
    }

    incrementTimeSerise(data:Array<TimeSeriseType>, newData){

    }

    fetchJSON(filename):any{
        let url = `${location.href.substring(0,location.href.lastIndexOf("/"))}/dist/data/${filename}.json`;
        return fetch(url).then(function(response) {
            let data:any = response.json();
            return data;
        }).then(function(data){
            /*
            let newData= data.filter(function(v){
                return v.population >= 15211000;
            });
            let str ="";
            for (let i =0; i < newData.length; i++){
                str = str + `'${newData[i].country}',`;
            }
            console.log(str);
            return newData;
            */
            return data;
        }).catch(function(err) {
            return {"error":true};
        });
    }

    randomInt(min:number, max:number ):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

}

export interface TimeSeriseType{
    time:number,
    value:number
}

