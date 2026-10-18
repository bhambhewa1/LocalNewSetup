'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

interface BreadcrumbProps {
  pageName?: string
  breadComponent?: React.ReactNode
}

const Breadcrumb = ({ pageName, breadComponent }: BreadcrumbProps) => {
  const params = useParams()
  const pathName = usePathname()
  const excludeIds = Array.isArray(params?.slug) ? params?.slug[1] : params.id

  const pathArray = pathName.split('/').filter((value, index, array) => value !== excludeIds)

  const capitalizeFirstLetters = (input: string): string => {
    return input
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <h2 className='text-title-md2 font-semibold'>
        {/* <div className="mb-6 flex gap-3 flex-row items-center justify-between">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white"> */}
        {pageName}
      </h2>

      <nav>
        <ol className='list-none flex items-center gap-2'>
          <li>
            <Link className='font-medium text-secondary' href='/'>
              Dashboard
            </Link>
          </li>
          {pathArray.map((pathItem, index) => {
            if (index === pathArray?.length - 1) {
              return (
                <li key={index} className='font-medium text-primary'>
                  {capitalizeFirstLetters(pathItem)}
                </li>
              )
            } else {
              return (
                <li key={index}>
                  <Link className='font-medium text-secondary' href={`/${pathItem}`}>
                    {capitalizeFirstLetters(pathItem)} {'/'}
                  </Link>
                </li>
              )
            }
          })}
        </ol>
      </nav>
      {/* <div className="ml-auto">{breadComponent}</div> */}
    </div>
  )
}

export default Breadcrumb
