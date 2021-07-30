import React,{Component} from 'react';

import CanvasJSReact from '../../assets/canvasjs.react'
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

class BarChart extends Component{
    // this.props.chartTitle 
    // this.props.dataPoints 

    render() {


            let data=null

            data= this.props.dataPoints   /////// this.props.dataPoints

            let dataPoints=[]
            // dataPoints=[                                                                          
            //   {label:"0-499",y:10},   
            //   {label:"500-999",y:20}, 
            //   {label:"1000-1499",y:20}, 
            //   {label:"1500-1999",y:60}, 
            //   {label:"2000-2499",y:20},
            //   {label:"2500-2999",y:30},
            //   {label:"3000-3499",y:40},
            //   {label:">3500",y:15}
            // ]
            // data is an object
            for(let prop in data){
                dataPoints.push({
                    label:prop,
                    y: parseInt(data[prop])  
                })
            } 
            let type=""
            let axisX,axisY,toolTip,legend,showInLegend,legendText
            let Options

            axisX={
                gridColor:"white",
                valueFormatString: " "
            }
            axisY={
                gridColor:"#C0C0C0",
                tickLength:5,
            }
            toolTip={
                enabled:true,
                cornerRadius:5,
                fontWeight:"lighter"
            }
            showInLegend=false
            type="column"

            Options={
                // exportEnabled: true,
                animationEnabled: true,
                title:{
                    text: this.props.chartTitle             /////////// this.props.chartTitle 
                },
                axisX: {...axisX},
                axisY: {...axisY},
                toolTip:{...toolTip},
                legend:{...legend},
                data: [{
                    showInLegend: showInLegend,              
                    legendText: legendText,                                 
                    type: type,                                               
                    dataPoints: dataPoints
                }]
            }   

        return (
            <div>
                <CanvasJSChart options = {Options}/>
            </div>
        );
    }
}

export default BarChart;
