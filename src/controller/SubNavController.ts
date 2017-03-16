import {DataService} from '../chart/DataService'
import {BarChart} from '../chart/BarChart'

export class SubNavController{
    
    countryList:Array<string> = ['Afghanistan','Argentina','Australia','Bangladesh','Brazil','Canada','Chile','China','The Democratic Republic of the Congo','Colombia','Germany','Algeria','Egypt','Spain','Ethiopia','France','United Kingdom','Ghana','Indonesia','India','Iran','Iraq','Italy','Japan','Kazakstan','Kenya','South Korea','Sri Lanka','Morocco','Madagascar','Mexico','Myanmar','Mozambique','Malaysia','Nigeria','Netherlands','Nepal','Pakistan','Peru','Philippines','Poland','North Korea','Romania','Russian Federation','Saudi Arabia','Sudan','Syria','Thailand','Turkey','Taiwan','Tanzania','Uganda','Ukraine','United States','Uzbekistan','Venezuela','Vietnam','Yemen','South Africa'];
    constructor(){
        let me:SubNavController = this;
        document.getElementById("dashboard_subnav").addEventListener("click", function(e){
            let el = <HTMLElement>e.target;
            let parentEl = <HTMLElement>e.currentTarget;
            let chartPanelEl:HTMLElement;

            /**
             * This is a event listener for the Application Sub SubNav
             * The handle will show/hide the appropriate panel based on the data-show attribute 
             * after showing the chart panel it will load the data files again using the data-file attribute of each chart panel 
             */
            if (el.classList.contains("nav-link")===true && el.classList.contains("active")===false){
                let activeEl = parentEl.querySelector(".nav-link.active");
                if (activeEl){
                    activeEl.classList.remove("active");
                }
                el.classList.add("active");

                $(".content-container .content-area").hide();

                chartPanelEl = document.getElementById(el.dataset.show);
                
                $(chartPanelEl).show(200, function() {
                    // show the chart panel and load all the charts inside it
                    me.loadCharts(chartPanelEl)
                });

                
            }
        })
    }

    //Loads all charts inside a chartPanel
    loadCharts(chartPanelEl:HTMLElement){
        let chartContainers = <NodeListOf<HTMLElement>>chartPanelEl.querySelectorAll("[chart-container]");
        var ds = new DataService();
        var me = this;
        for (let i = 0; i < chartContainers.length; i++) {
            let fileName:string = chartContainers[i].dataset.file
            let fields:string = chartContainers[i].dataset.fields;
            if (typeof fileName === "string" && typeof fields ==="string" ){
                let fieldList = fields.split(",")
                ds.fetchJSON(fileName).then(function(jsonData){
                    let barChart = new BarChart();
                    let filteredCountryJSON = jsonData.filter(function(v){
                        return me.countryList.indexOf(v.country) >= 0; 
                    });
                    filteredCountryJSON = filteredCountryJSON.map(function(v){
                        if (typeof v[fieldList[1]] ==="string"){
                            v[fieldList[1]] = parseFloat(v[fieldList[1]].replace(/,/g, ''));
                        }
                        return v;
                    });
                    //console.log(filteredCountryJSON);
                    chartContainers[i].innerHTML=""; //Remove previous charts
                    barChart.generate(chartContainers[i]).update(filteredCountryJSON, fieldList);
                });
            }

        }
    }
}

