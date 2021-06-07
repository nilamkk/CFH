// Canvasjs chart
import React,{Component} from 'react';
import CanvasJSReact from '../assets/canvasjs.react'
// import path from 'path'
import axios from 'axios'
let CanvasJSChart = CanvasJSReact.CanvasJSChart;


class Chart extends Component{
  // for the time being I will do all with component state, but I have to convert all to redux
  state={
    data:[],
    toolTip:null
  }
  async componentDidMount(){
    if(this.state.data.length!==0)
      return;

    let link
    // when authentication will be added, have to maintain session/other things for authentication
    if(this.props.chartTitle==="Rating Wise Count of Accepted Questions"){
        link="/problems-rating"
    }else if(this.props.chartTitle==="Rated Participated Contests"){
        link="/contest-rating"
    }
    const data= await axios.get( link )
    console.log(data.data)

    // dataPoints=[                                                                          ///// have to grab it by api call
    //   {label:"0-499",y:10},   
    //   {label:"500-999",y:20}, 
    //   {label:"1000-1499",y:20}, 
    //   {label:"1500-1999",y:60}, 
    //   {label:"2000-2499",y:20},
    //   {label:"2500-2999",y:30},
    //   {label:"3000-3499",y:40},
    //   {label:">3500",y:15}
    // ]
    let dataPoints=[]
    if(this.props.chartTitle==="Rating Wise Count of Accepted Questions"){
      // data.data is an object
      for(let prop in data.data){
        dataPoints.push({
          label:prop,
          y: parseInt(data.data[prop])  
        })
      } 
    }else if(this.props.chartTitle==="Rated Participated Contests"){
      // dataPoints=[                                                                        ///// have to grab it by api call
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
      // data.data is an array
      for(let i=0;i<data.data.length;i++){
        dataPoints.push({
          x: new Date(data.data[i].updatedAt*1000),
          y: parseInt(data.data[i].newRating)
        })
      }
    }
    let oldData=[...this.state.data]
    oldData.push({
      dataPoints:dataPoints
    })
    this.setState({
      data:oldData
    }) 
  }



	render() {
    
    let desiredChart

    if(this.state.data.length===0){
      desiredChart="<Spinner/>" ///////////////////////////////////////
    }else{

      let dataPoints=[]
      let type=""
      let axisX,axisY,toolTip,legend,showInLegend,legendText
      
      if(this.props.chartTitle==="Rating Wise Count of Accepted Questions"){
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
        dataPoints=[                                                                          ///// have to grab it by api call
          {label:"0-499",y:10},   
          {label:"500-999",y:20}, 
          {label:"1000-1499",y:20}, 
          {label:"1500-1999",y:60}, 
          {label:"2000-2499",y:20},
          {label:"2500-2999",y:30},
          {label:"3000-3499",y:40},
          {label:">3500",y:15}
        ]
      }else if(this.props.chartTitle==="Rated Participated Contests" ){
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
        toolTip={                                                                             ///// have to grab it by api call
          // https://canvasjs.com/docs/charts/basics-of-creating-html5-chart/tool-tip/            
          enabled:true,
          fontColor:"white",
          content:"<p>=1158(-55),newbiw</p><p>Rank:10000</p><p>CF DIV 2</p>",   
          backgroundColor:"rgba(0,0,0,0.7)",
          cornerRadius:10,
          fontWeight:"lighter"
        }
        showInLegend=true
        legendText="Hawkeye_2000"
        legend={                                                      
          dockInsidePlotArea:true,
          horizontalAlign:"right",
          verticalAlign:"top",
          cursor:"pointer"
        }
        type="line"
        // dataPoints=[                                                                        ///// have to grab it by api call
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
      }

      const options = {
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
          dataPoints: this.state.data[0].dataPoints
        }]
      }
      desiredChart=<CanvasJSChart options = {options}/>
    }
    
		return (
      <div>
        {desiredChart}
      </div>
		);
	}
    
}


export default Chart;
