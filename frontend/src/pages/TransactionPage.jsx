import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {useNavigate, useParams} from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import TransactionFormSkeleton from '../components/skeletons/TransactionFormSkeletion.jsx'

import { GET_TRANSACTION } from '../graphql/queries/transaction.query.js';
import {UPDATE_TRANSACTION} from '../graphql/mutations/transaction.mutation.js';

const TransactionPage = () => {
  const {id} = useParams();
  const {loading, data} = useQuery(GET_TRANSACTION, {
    variables: {
      id: id
    }
  });
  console.log("transaction id: ", id );
  console.log('Transaction from ID: ', data);

  const navigate = useNavigate();

  const [updateTransaction, {loading: loadingUpdate}] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: ['GetTransaction', 'GetTransactionStatistics']
  });

  const [formData, setFormData] = useState({
    description: data?.transaction?.description || '',
    paymentType: data?.transaction?.paymentType || '',
    category: data?.transaction?.category || '',
    amount: data?.transaction?.amount || '',
    location: data?.transaction?.location || '',
    date: data?.transaction?.date || ''
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    try {
      await updateTransaction({
        variables: {
          input: {
            ...formData,
            amount,
            transactionId: id
          }
        }
      });

      toast.success("Update transaction sucessfully");
      navigate('/');
    } catch (error) {
      console.error("Error in updating transaction", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if(data) {
      setFormData({
        description: data?.transaction?.description,
        paymentType: data?.transaction?.paymentType,
        category: data?.transaction?.category,
        amount: data?.transaction?.amount,
        location: data?.transaction?.location,
        date: new Date(+data.transaction.date).toISOString().substr(0, 10),
      });
    }
  },[data]);

  if(loading) return <TransactionFormSkeleton />

  return (
    <div className='h-screen max-w-4xl mx-auto flex flex-col items-center'>
      <p className='text-2xl md:text-4xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
        Update this transaction
      </p>
      <form onSubmit={handleSubmit}>
        {/*transaction*/}
        <div className='flex flex-wrap'>
          <div className='w-full'>
            <label
              className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
              htmlFor='description'
            >
              Transaction
            </label>
            <input 
              className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4'
              id='description'
              name='description'
              type='text'
              placeholder='Rent, Groceries, Salary, etc...'
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/*Payment Type*/}
        <div className='flex flex-wrap gap-3 mb-4'>
          <div className='w-full flex-1 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
              htmlFor='paymentType'
            >
              Payment Type
            </label>
            <div className='relative'>
              <select
                className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                id='paymentType'
                name='pamentType'
                onChange={handleInputChange}
                defaultValue={formData.paymentType}
              >
                <option value={'card'}>Card</option>
                <option value={'cash'}>Cash</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
									className='fill-current h-4 w-4'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
								>
									<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
								</svg>
              </div>
            </div>
          </div>

          {/*Category*/}
          <div className='w-full flex-1 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
              htmlFor='category'
            >
              Category
            </label>
            <div className='relative'>
              <select
                className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                id='category'
                name='category'
                onChange={handleInputChange}
                defaultValue={formData.category}
              >
                <option value="saving">Saving</option>
                <option value="expense">Expense</option>
                <option value="investment">Investment</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
									className='fill-current h-4 w-4'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
								>
									<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
								</svg>
              </div>
            </div>
          </div>

          {/*Amount*/}
          <div className='w-full flex-1 mb-6 md:mb-0'>
            <label 
              className='block uppercase text-white text-xs font-bold mb-2'
              htmlFor='amount'
            >
              Amount($)
            </label>
            <input 
              className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              id='amount'
              name='amount'
              type='number'
              placeholder='150'
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/*Location*/}
        <div className='flex flex-wrap gap-3'>
          <div className='w-full flex-1 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
              htmlFor='location'
            >
              Location
            </label>
            <input 
              className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
              id='location'
              name='location'
              type='text'
              placeholder='New York'
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          {/*Date*/}
          <div className='w-full flex-1 mb-1'>
            <label
              className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
              htmlFor='date'
            >
                Date
            </label>
            <input 
              className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none'
              type='date'
              name='date'
              id='date'
              placeholder='Select date'
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button
          className='text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600'
          type='submit'
          disabled={loadingUpdate}
        >
          {loadingUpdate ? 'Loading...' : 'Update Transaction'}
        </button>
      </form>
    </div>
  )
}

export default TransactionPage