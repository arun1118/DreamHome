import React from 'react'
import {Link} from 'react-router-dom';
import {FaPen} from 'react-icons/fa';

const About = () => {
    return (
      <div className='py-20 px-4 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold mb-4 text-slate-900'>About Dream Home...</h1>
        <p className='mb-4 text-slate-700'>
        Finding your dream home should be easy and enjoyable. That's why Dream Home was created.
        We offer a wide range of homes to choose from,
        with a clean and user-friendly interface that makes it simple to find the perfect home for you.
        Whether you're looking for a starter home, a vacation home, or your forever home, we have something for everyone.
        We also offer a variety of filtering options so that you can narrow down your search and find the exact home you're looking for.
        </p>
        <p className='mb-4 text-slate-700'>
        Dream Home is more than just a place to find your dream home.
        It's also a place to connect with other home buyers and sellers.
        You can easily contact homeowners directly to inquire about their property or schedule a viewing.
        If you're a homeowner, Dream Home is a great way to list your property for rent or sale.
        Our platform makes it easy to reach potential buyers and tenants, and you can manage your listings directly from your account.
        </p>
        <p className='mb-4 text-slate-700'>
        We understand that finding a home is a big decision, and we want to make it as easy and stress-free as possible.
        That's why we offer a variety of filtering options so that you can narrow down your search and find the exact home you're looking for.
        You can filter your search by location, price, property type, number of bedrooms and bathrooms, and more.
        We also offer a variety of advanced filtering options, such as filtering by school district, proximity to public transportation, and more.
        We're confident that you'll find your dream home on Dream Home. With our wide range of homes, user-friendly interface, and powerful filtering options, we make it easy to find the perfect home for you.
        </p>
        <div className="fixed bottom-10 right-10 z-50 bg-slate-600 rounded-lg">
          <p className='p-3 text-white flex gap-1 items-center'>
            <Link className='hover:underline'>feedback</Link>
            <FaPen className='w-4 h-4'/>
          </p>
        </div>
      </div>
    )
}

export default About