import { useCourse } from '@/src/context/CourseContext'
import Image from 'next/image'
import { AiFillStar } from 'react-icons/ai'

export default function Reviews() {
  const { reviews } = useCourse()

  const filteredReviews = reviews.filter(review => review.stars > 0)

  return (
    <>
      <div className='reviews'>
        {filteredReviews.map(review => (
          <article key={review.id}>
            <div className='avatar'>
              <Image src={review.user.avatar} width={32} height={32} />
              <span>{review.user.username}</span>
              {Array.from({ length: review.stars }).map((_, i) => (
                <AiFillStar key={i} fill='yellow' />
              ))}
            </div>
            <p>{review.comment}</p>
          </article>
        ))}
      </div>

      <style jsx>{`
        .reviews {
          display: flex;
          flex-direction: column;
          row-gap: 1rem;
        }

        article {
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          row-gap: 1rem;
          border-radius: 0.5rem;
          padding: 0.8rem 1rem;
        }

        .avatar {
          display: flex;
          align-items: center;
          flex-direction: row;
          column-gap: 0.5rem;
        }
      `}</style>
    </>
  )
}
