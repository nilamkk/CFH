import React,{Component} from 'react';

import Spinner from '../Spinner/Spinner';
import CanvasJSReact from '../../assets/canvasjs.react'
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

class BarChart extends Component{
    state={
        dataPoints:null,
        error:null,
        loading:false
    }

    async componentDidMount(){
        if(this.state.dataPoints || this.state.error)
            return;
        this.setState({
            loading:true
        })

        let handle=this.props.handle
        try{
            let data=null

            data= await this.props.getData(handle)

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

            this.setState({
                dataPoints:dataPoints,
                loading:false,
                error:null
            }) 

        }catch(error){
            this.setState({
                loading:false,
                error:error.message
            })
        }
    }

    render() {

        let desiredChart

        if(!this.state.dataPoints){
            if(this.state.error){
                desiredChart=<p style={{color:'black'}}>{this.state.error}</p>
            }else{
                desiredChart=<Spinner/>
            }
        }else if(this.state.dataPoints.length===0){
            desiredChart=<p>No data available</p>
        }else{
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

export default BarChart;
