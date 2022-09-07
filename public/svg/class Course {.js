class Course {
  constructor(name, teacher) {
    this.name = name;
    this.teacher = teacher;
  }

  getId(){

    function tranform(prop){
      return prop.toLowerCase().replace(/\s/g, '_');
    }

    const name = tranform(this.name);
    const teacher = tranform(this.teacher);

    return `${name}-${teacher}`;
  }

}


const course1 = new Course('React', 'Miguel Durán');

console.log(course1.getId());