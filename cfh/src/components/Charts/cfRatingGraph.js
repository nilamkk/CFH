// Canvasjs chart
import React,{Component} from 'react';
import moment from 'moment'

import CanvasJSReact from '../../assets/canvasjs.react'
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

class CfRatingGraph extends Component{
  
    state={
        dataPoints:null,
        toolTip:null
    }

    async componentDidMount(){
        if(this.state.dataPoints)
            return;
        let handle=this.props.handle
        try{
            let data= await this.props.getData(handle)   
            let dataPoints=[]
            // data is an array
            for(let i=0;i<data.length;i++){
                dataPoints.push({
                    x: new Date(data[i].updatedAt*1000),
                    y: parseInt(data[i].newRating),
                    toolTipContent:`<p>=${data[i].newRating} (${(data[i].changeInRating>0?"+":"")}${data[i].changeInRating}),${data[i].newCategory}</p><p>Rank:${data[i].rank}</p><p>${data[i].contestName}</p><p>${moment(data[i].updatedAt*1000).format('DD/MM/YYYY')}</p>`
                })
            }
            if(dataPoints.length==0){
                for(let i=0;i<30;i++){
                    dataPoints.push({
                        x: new Date( (new Date().getTime()-(90000000*i))),
                        y: null,
                        // toolTipContent:`<p>=${data[i].newRating} (${(data[i].changeInRating>0?"+":"")}${data[i].changeInRating}),${data[i].newCategory}</p><p>Rank:${data[i].rank}</p><p>${data[i].contestName}</p><p>${moment(data[i].updatedAt*1000).format('DD/MM/YYYY')}</p>`
                    })  
                }
            }
            this.setState({
                dataPoints:dataPoints
            }) 

        }catch(error){
            console.log(error)
        }
    }

    render() {
    
        let desiredChart

        if(!this.state.dataPoints){
            desiredChart="<Spinner/>"
        }else{

            let type=""
            let axisX,axisY,toolTip,legend,showInLegend,legendText
            let Options

            axisX={
                gridColor:"white",
            }
            axisY={
                gridColor:"#C0C0C0",
                valueFormatString: " ",              
                tickLength:0,                        
                stripLines:[                         
                {
                    startValue:0,
                    endValue:1199,
                    color:"#BCBEBD"
                },
                {
                    value:1199,
                    color:"#C0C0C0",
                    label:"1200",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"
                },
                {                
                    startValue:1200,
                    endValue:1399,                
                    color:"#75F582 "                    
                },
                {
                    value:1399,
                    color:"#C0C0C0",
                    label:"1400",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"   
                },
                {
                    startValue:1400,
                    endValue:1599,
                    color:"#47EFBB"            
                },
                {
                    value:1603,
                    color:"#C0C0C0",
                    label:"1600",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"     
                },
                {
                    startValue:1600,
                    endValue:1899,
                    color:"#A0A0E7"      
                },
                {
                    value:1902,
                    color:"#C0C0C0",
                    label:"1900",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"     
                },          
                { 
                    startValue:1900,
                    endValue:2099,
                    color:"#F598FE"
                },
                {
                    value:2100,
                    color:"#C0C0C0",
                    label:"2100",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"     
                },
                { 
                    startValue:2100, 
                    endValue:2299,
                    color:"#F5D787"
                },
                {
                    value:2304,
                    color:"#C0C0C0",
                    label:"2300",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"     
                },
                { 
                    startValue:2300,
                    endValue:2399,
                    color:"#F7BB16"
                },
                {
                    value:2400,
                    color:"#C0C0C0",
                    label:"2400",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"     
                },
                {
                    startValue:2400,
                    endValue:2599,
                    color:"#F97A7A"            
                },
                {
                    value:2603,
                    color:"#8f8c8c",
                    label:"2600",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"     
                },
                {
                    startValue:2600,
                    endValue:2999,
                    color:"#F34D4D"            
                },
                {
                    value:3000,
                    color:"#8f8c8c",
                    label:"3000",
                    labelPlacement:"outside",
                    labelFontColor:"black",
                    labelBackgroundColor:"white",
                    labelFontWeight:"lighter"     
                },
                {
                    startValue:3000,
                    endValue:100000,
                    color:"#9F0A0A"            
                }
                ]

            }
            toolTip={                                                                             
                enabled:true,
                fontColor:"white",
                content:"<p>=1158(-55),newbiw</p><p>Rank:10000</p><p>CF DIV 2</p>",  // it wont affect though 
                backgroundColor:"rgba(0,0,0,0.7)",
                cornerRadius:10,
                fontWeight:"lighter"
            }
            showInLegend=true
            legendText=`${this.props.handle}`                                                           ///// have to grab it by authentication  
            legend={                                                      
                dockInsidePlotArea:true,
                horizontalAlign:"right",
                verticalAlign:"top",
                cursor:"pointer"
            }
            type="line"

            Options={
                animationEnabled: true,
                title:{
                    text: this.props.chartTitle
                },
                axisX: {...axisX},
                axisY: {...axisY},
                toolTip:{...toolTip},
                legend:{...legend},
                data: [{
                    showInLegend: showInLegend,              
                    legendText: legendText,                                 
                    type: type,                                               
                    dataPoints: this.state.dataPoints
                }]
            }
            desiredChart=<CanvasJSChart options = {Options}/>
        }
    
        return (
            <div>
                {desiredChart}
            </div>
        );
	}
    
}


export default CfRatingGraph;




// dataPoints=[                                                                        
//   { x: new Date(2017, 0,1), y: 0 },
//   { x: new Date(2017, 0,3), y: 480 },
//   { x: new Date(2017, 0,5), y: 790 },
//   { x: new Date(2017, 0,10), y: 1000 },
//   { x: new Date(2017, 0,15), y: 1100 },
//   { x: new Date(2017, 0,20), y: 999 },
//   { x: new Date(2017, 0,23 ), y: 1050 },
//   { x: new Date(2017, 0,26), y: 1132 },
//   { x: new Date(2017, 8), y: 1200 },
//   { x: new Date(2017, 9), y: 1212 },
//   { x: new Date(2017, 10), y: 1250 },
//   { x: new Date(2017, 11), y: 1300 },
//   { x: new Date(2018, 0,1), y: 1700 },
//   { x: new Date(2018, 0,1), y: 2100 }
// ]