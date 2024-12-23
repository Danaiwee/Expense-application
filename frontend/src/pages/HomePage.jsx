import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJs, ArcElement, Tooltip, Legend} from 'chart.js';
import {MdLogout} from 'react-icons/md';
import toast from 'react-hot-toast';

import TransactionForm from '../components/TransactionForm';
import Cards from '../components/Cards';


import { useMutation, useQuery } from '@apollo/client';
import {LOGOUT} from '../graphql/mutations/user.mutation.js';
import { GET_TRANSACTION_STATISTICS } from '../graphql/queries/transaction.query.js';
import { useEffect, useState } from 'react';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query.js';


ChartJs.register(ArcElement, Tooltip, Legend);

// const chartData = {
//   labels: ["Saving", "Expense", "Investment"],
//   datasets: [
//     {
//       label: '%',
//       data: [13, 8, 3],
//       backgroundColor: ['rgba(75,192,192)', 'rgba(255, 99, 132)', 'rgba(54, 132, 235)'],
//       borderColor: ['rgba(75,192,192)', 'rgba(255, 99, 132)', 'rgba(54, 132, 235)'],
//       borderWidth: 1,
//       borderRadius: 30,
//       spacing: 10,
//       cutout: 130,
//     },
//   ], 
// };

const HomePage = () => {
  const {data} = useQuery(GET_TRANSACTION_STATISTICS);
  console.log("Statistics data: ", data);

  const {data: dataUser} = useQuery(GET_AUTHENTICATED_USER);
  console.log("dataUser: ", dataUser.authUser);
  

  const [logout, {loading, client}] = useMutation(LOGOUT, {
    refetchQueries: ['GetAuthenticatedUser'],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '$',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130
      }
    ]
  });

  useEffect(() => {
    if(data?.categoryStatistics) {
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const totalAmount = data.categoryStatistics.map((stat) => stat.totalAmount);
      const backgroundColors = [];
      const borderColors = [];

      categories.forEach((category) => {
        if(category === 'saving') {
          backgroundColors.push("rgba(51,191,106)")
          borderColors.push("rgba(51,191,106)")

        } else if(category === 'expense') {
          backgroundColors.push("rgba(255, 99, 132)");
					borderColors.push("rgba(255, 99, 132)");

        } else if(category === 'investment') {
          backgroundColors.push("rgba(54, 162, 235)");
					borderColors.push("rgba(54, 162, 235)");
        }
      })

      setChartData((prevData) => ({
        labels: categories,
        datasets: [
          {
            ...prevData.datasets[0],
            data: totalAmount,
            backgroundColor: backgroundColors,
            borderColor: borderColors
          }
        ]
      }))
    }
  },[data]);

  const handleLogout = async () => {
    try {
      await logout(); // Clear the Apollo Client cache FROM THE DOCS
			// https://www.apollographql.com/docs/react/caching/advanced-topics/#:~:text=Resetting%20the%20cache,any%20of%20your%20active%20queries

      client.resetStore();

    } catch (error) {
      console.error("Error in Logging out: ", error.message);
      toast.error(error.message);
      
    }
  };


  return (
    <>
      <div 
        className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center pb-6'>
          <div className='flex items-center'>
            <p className='md:text-3xl text-2xl lg:text-4xl font-bold text-center relative mr-3'>
              Spend wisely, track wisely
            </p>
            <img 
              src={dataUser.authUser.profilePicture ||'https://tecdn.b-cdn.net/img/new/avatars/2.webp'}
              className='size-11 rounded-full border cursor-pointer'
              alt='Avatar'
            />
            {!loading && 
            <MdLogout className='mx-2 size-6 cursor-pointer' onClick={handleLogout} />}
          </div>
          <div className='flex flex-wrap w-full justify-center items-center gap-6'>
            <div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]'>
              <Doughnut data={chartData} />
            </div>
            <TransactionForm />
          </div>
            <Cards />
      </div>
    </>
  )
}

export default HomePage