
import Courses from './Courses'

// const Course = (props) =>{
//   const total = props.course.parts.reduce((sum,part)=>{ return sum + part.exercises},0)
//   return(
//     <div>
//       <h1>{props.course.name}</h1>
//       {props.course.parts.map(part =>
//          <p key={part.id}>{part.name} {part.exercises}</p> 
         
      
//       )}
        
//     <strong>total of {total} exercises</strong>
//     </div>
//   )
// }




const App = () => {
  const courses = [
  {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  },
  {
    name: 'Node.js',
    id: 2,
    parts: [
      {
        name: 'Routing',
        exercises: 3,
        id: 1
      },
      {
        name: 'Middlewares',
        exercises: 7,
        id: 2
      }
    ]
  }
]

  return <Courses courses={courses} />
}

export default App