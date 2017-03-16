import { Selection, select } from "d3-selection";
import { max as d3Max} from 'd3-array';
import { scaleLinear, scaleBand} from 'd3-scale'
import { axisBottom, axisLeft} from 'd3-axis'
import { transition,Transition } from 'd3-transition'
import { format as d3format} from 'd3-format';
import * as d3 from '../d3-modules';

export class BarChart{

    private height:number;
    private width:number;
    private svg;
    private chart;
    private generateCalled:boolean = false;

    generate(el:HTMLElement):BarChart {
        if (el instanceof HTMLElement === false){
            throw "Must provide an instance of HTMLElement";
        }
        this.height= el.offsetHeight-80;
        this.width = el.offsetWidth-60;
        this.svg = d3.select(el)
            .append('svg')
            .attr('width' , el.offsetWidth )
            .attr('height', el.offsetHeight);

        this.chart = this.svg.append('g')  // Append Chart Graphic element and position it at 0,0
            .attr('transform', `translate(60,0)`);
        this.generateCalled=true;    
        return this
    }

    update(data, fieldList?:Array<string>, barColor?:string):BarChart {
        if (this.generateCalled===false){
            throw "Must call generate() before calling update()";
        }
        if (Array.isArray(fieldList)==false){
            fieldList=["id","value"];
        }
        else{
            if (fieldList.length===0){
                fieldList=["id","value"];
            }
            else if (fieldList.length===1){
                fieldList.push("value");
            }
        }
        let idField = fieldList[0];
        let valueField = fieldList[1];

        if (typeof barColor !=="string"){
            barColor="orange";
        }

        var max = d3Max(data,function(d:any) { 
            return d[valueField]; 
        });
        let chartHeight= this.height;
        let chartWidth= this.width;
        var updChart = this.chart.selectAll('rect')
            .data(data, function(d:any) { return d.country; });

        var removeChart = updChart.exit();  // Elements That needs to be removed
        var addChart    = updChart.enter(); // Elements That needs to be Added

        var yScale = d3.scaleLinear()
            .domain([0,parseInt(max)])
            .range([chartHeight,0]);
            
        var usersArray = data.map( function(d){return d[idField];}); // Will return array of users

        //scaleband takes the length of the domain array and width of chart and returs equal bandwidth
        var xScale = d3.scaleBand()
            .domain(usersArray)
            .range([0, chartWidth])
            .padding(0.05);

        this.chart.append("g")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(axisBottom(xScale))
            .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");

        this.chart.append("g")
            .call(axisLeft(yScale)
                    .tickFormat(d3.format(".4s"))
                );


        //1. First Remove the Elements
        removeChart.remove();

        //2. Operate on Old Elements Only - update
        updChart.style('fill' , barColor)
            .attr("x"     , function(d) { return xScale(d[idField]) })
            .attr('width' , xScale.bandwidth())
            //.transition()
            //.duration(1000)
            .attr('height', function(d) { return yScale(d[valueField]); })
            .attr('y'     , function(d) { return chartHeight-yScale(d[valueField]); })

        //3. Operate on New Elements Only - update.enter()
        addChart
            .append('rect')
            .style('fill' , barColor)
            .attr("x"     , function(d) { return xScale(d[idField]) })
            .attr('width' , xScale.bandwidth())
            .attr('y'     , chartHeight-80)
            .attr('y'     , function(d) { return yScale(d[valueField]); })
            //.transition()
            //.duration(5000)
            .attr('height', function(d) { return chartHeight-yScale(d[valueField]); })

        return this ;
    }


}