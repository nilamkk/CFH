import './App.css';
import CanvasChart from './components/CanvasChart.js'

function App() {
  return (
      <div className="App-class">
        {/* <CanvasChart  chartTitle="Rating Wise Count of Accepted Questions" /> */}
        {/* <CanvasChart  chartTitle="Rated Participated Contests" /> */}
        <CanvasChart  chartTitle="Submission pie chart" />
      </div>    
  );
}

export default App;