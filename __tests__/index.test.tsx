import { fireEvent, render, screen } from '@testing-library/react'
import Home from '@/pages/index'
import '@testing-library/jest-dom'

const courses = [
  {
    title: 'CSS',
    name: 'my_test_name',
    banner: '/img/defaultBanner.webp',
    teacher: {
      username: 'test_teacher',
      avatar: '/img/defaultAvatar.png'
    }
  },
  {
    title: 'HTML',
    name: 'my_test_name_2',
    banner: '/img/defaultBanner.webp',
    teacher: {
      username: 'test_teacher_2',
      avatar: '/img/defaultAvatar.png'
    }
  },
  {
    title: 'SCSS',
    name: 'my_test_name_3',
    banner: '/img/defaultBanner.webp',
    teacher: {
      username: 'test_teacher_3',
      avatar: '/img/defaultAvatar.png'
    }
  }
]

const [firstCourse, secondCourse, thirdCourse] = courses

describe('Home', () => {
  it('renderiza cursos', () => {
    render(<Home courses={courses} />)

    const renderedCourses = screen.getAllByRole('heading') // | link

    renderedCourses.forEach((course, i) => {
      expect(course).toHaveTextContent(courses[i].title)
    })
  })

  it('filtra segundo curso', () => {
    render(<Home courses={courses} />)

    const inputSearch = screen.getByRole('searchbox')
    const coursesSection = screen.getByTestId('courses-section')

    fireEvent.change(inputSearch, {
      target: {
        value: secondCourse.title
      }
    })

    expect(coursesSection).toHaveTextContent(secondCourse.title)
  })

  it('filtra primer y tercer curso', () => {
    render(<Home courses={courses} />)

    const inputSearch = screen.getByRole('searchbox')

    fireEvent.change(inputSearch, {
      target: {
        value: 'CSS'
      }
    })

    const filteredCourses = screen.getAllByRole('heading')

    const [firstFilteredCourse, secondFilteredCourse] = filteredCourses

    expect(filteredCourses).toHaveLength(2)
    expect(firstFilteredCourse).toHaveTextContent(firstCourse.title)
    expect(secondFilteredCourse).toHaveTextContent(thirdCourse.title)
  })
})
