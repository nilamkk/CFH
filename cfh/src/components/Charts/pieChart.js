// Canvasjs chart
import React,{Component} from 'react';

import Spinner from '../Spinner/Spinner';
import CanvasJSReact from '../../assets/canvasjs.react'
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

let customPieColors={
  "FAILED":"#a30716", 
  "OK":"#1db81d", 
  "PARTIAL":"#f7dd16", 
  "COMPILATION_ERROR":"#7a5b5e", 
  "RUNTIME_ERROR":"#f53016", 
  "WRONG_ANSWER":"#cf0808", 
  "PRESENTATION_ERROR":"#959e51", 
  "TIME_LIMIT_EXCEEDED":"#8669b5", 
  "MEMORY_LIMIT_EXCEEDED":"#56348c", 
  "IDLENESS_LIMIT_EXCEEDED":"#390e7d", 
  "SECURITY_VIOLATED":"#907eab", 
  "CRASHED":"#554f5e", 
  "INPUT_PREPARATION_CRASHED":"#853bf5", 
  "CHALLENGED":"#452c6b", 
  "SKIPPED":"#f70213", 
  "TESTING":"#65ebe2", 
  "REJECTED":"#80a6a3",
  "unknown":"#060a0a" //Can_be_absent
}

class PieChart extends Component{
  
    state={
        dataPoints:null,
        loading:false,
        error:null
    }

    async componentDidMount(){
        if(this.state.dataPoints || this.state.error)
            return;
        let handle=this.props.handle
        this.setState({
            loading:true
        })

        try{
            let data= await this.props.getData(handle)

            let dataPoints=[]
            for(let prop in data){
                if(parseInt(data[prop])===0)
                    continue;

                dataPoints.push({
                    y: parseInt(data[prop]),
                    label:prop,
                    color:customPieColors[prop],
                    toolTipContent:`<p>${prop}</p><p>Count: ${data[prop]}</p>`
                })
            }

            this.setState({
                dataPoints:dataPoints,
                error:null,
                loading:false
            }) 

        }catch(error){
            this.setState({
                error:error.message,
                loading:false
            })
        }
    }

    render() {
        let desiredChart

        if(!this.state.dataPoints){
            if(this.state.error){
                desiredChart=<p style={{color:'black'}}>{this.state.error}</p>
            }else{
                desiredChart= <Spinner/>                                               
            }
        }else if(this.state.dataPoints.length===0){
            desiredChart=<p>No data available</p>
        }else{
            let Options={
                // exportEnabled: true,
                animationEnabled: true,
                title: {
                    text: this.props.chartTitle
                },
                data: [{
                    type: "pie",
                    startAngle: 75,
                    showInLegend: "true",
                    legendText: "{label}",
                    indexLabelFontSize: 16,
                    indexLabel: "{y} ",
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

export default PieChart;
