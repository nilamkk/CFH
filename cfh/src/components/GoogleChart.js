// google chart
import React,{Component} from 'react';
import Chart from 'react-google-charts'
// import CanvasJSReact from '../assets/canvasjs.react'
// let CanvasJSChart = CanvasJSReact.CanvasJSChart;


class GoogleChart extends Component{
	render() {
        return(

            <Chart
            width={'500px'}
            height={'300px'}
            chartType="Histogram"
            loader={<div>Loading Chart</div>}
            data={[
                ['Indices','Rating'],
                [1,1700],
                [2,1800],
                [3,1800],
                [4,1700],
                [5,1700],
                [6,1500],
                [7,1500]
            ]}
            options={{
                title: 'Distribution',
                legend: { position: 'none' },
                colors: ['#4285F4'],
                chartArea: { width: 401 },
                hAxis: {
                ticks: [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1],
                },
                bar: { gap: 0 },
                histogram: {
                bucketSize: 5,
                maxNumBuckets: 200,
                minValue: 0,
                maxValue: 30,
                },
            }}
            rootProps={{ 'data-testid': '4' }}
            />



        );
    
    }
    
}


export default GoogleChart;
