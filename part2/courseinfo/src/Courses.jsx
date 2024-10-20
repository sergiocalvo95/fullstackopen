const Courses = (props) => {
    const {courses} = props;
    return (
        
      <div>
        <h1>Web development curriculum</h1>
        {courses.map((course) => {
          return (
            <div key={course.id}>
              <h2>{course.name}</h2>
              {course.parts.map(part => (
                <p key={part.id}>
                  {part.name} {part.exercises}
                </p>
              ))}
              <strong>total of {course.parts.reduce((sum,part)=>{ return sum + part.exercises},0)} exercises</strong>            
            </div>
          );
        })}
      </div>
    );
  };
  

  export default Courses