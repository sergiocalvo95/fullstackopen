import { useState } from 'react'

const StatisticsLine = (props) =>{
  // return <div><p>{props.text} {props.value} {props.symbol}</p></div>
  
  return (
          <tr>
            <td>
            {props.text}
            </td>
            <td >
              {props.value} {props.symbol}
            </td>
          </tr>
  )

}

const Statistics = (props) => {
  const stats = props.stats;
  const total = stats.good + stats.neutral + stats.bad
  const avg = (stats.good - stats.bad) /total
  const pos = (stats.good/total)*100 


  if(total){
    return (
      <div className="stats">
      <h1>statistics</h1>
      <table>
        <tbody>
        <StatisticsLine text="good" value={stats.good}></StatisticsLine>
        <StatisticsLine text="neutral" value={stats.neutral}></StatisticsLine>
        <StatisticsLine text="bad" value={stats.bad}></StatisticsLine>
        <StatisticsLine text="all" value={total}></StatisticsLine>
        <StatisticsLine text="average" value={avg}></StatisticsLine>
        <StatisticsLine text="positive" value={pos} symbol="%"></StatisticsLine>
        </tbody>
      </table>
    </div>
    )
  }else{
    return <p>No feedback given</p>
  }
}

const Button = (props) =>{
  return <button onClick={props.onClick}>{props.name}</button>

}



const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const stats = {
    good: good,
    neutral: neutral,
    bad: bad
  }


  const handleGood = () =>{
    setGood(good+1);
  }

  const handleNeutral = () =>{
    setNeutral(neutral+1);
  }

  const handleBad = () =>{
    setBad(bad+1);
  }



  return (
    <div>
      <h1>give feedback</h1>
      <br></br>
      <Button onClick={handleGood} name="good"></Button>
      <Button onClick={handleNeutral} name="neutral"/>
      <Button onClick={handleBad} name="bad"/>
      <Statistics stats={stats}></Statistics>
    </div>
  )
}

export default App