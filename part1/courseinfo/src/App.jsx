const Header = (props) => {
  console.log(props)

  return (
    <div>
       <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  const parts = props.parts;
  
  return (
    <div>
      {parts.map((part, index) =>(
        <p key={index}>
        {part.name} {part.exercises} 
        </p>
      ))}
    </div>
  );
}

const Total = (props) => {
  const parts = props.parts;
  let total = 0
  parts.forEach(part=> total+=part.exercises)

  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  )

}




const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App