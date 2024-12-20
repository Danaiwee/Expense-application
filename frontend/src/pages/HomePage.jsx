import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJs, ArcElement, Tooltip, Legend} from 'chart.js';

import {MdLogout} from 'react-icons/md';
import TransactionForm from '../components/TransactionForm';
import Cards from '../components/Cards';

ChartJs.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const chartData = {
    labels: ["Saving", "Expense", "Investment"],
    datasets: [
      {
        label: '%',
        data: [13, 8, 3],
        backgroundColor: ['rgba(75,192,192)', 'rgba(255, 99, 132)', 'rgba(54, 132, 235)'],
        borderColor: ['rgba(75,192,192)', 'rgba(255, 99, 132)', 'rgba(54, 132, 235)'],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ], 
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const loading = false;

  return (
    <>
      <div 
        className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center pb-6'>
          <div className='flex items-center'>
            <p className='md:text-3xl text-2xl lg:text-4xl font-bold text-center relative mr-3'>
              Spend wisely, track wisely
            </p>
            <img 
              src={'https://tecdn.b-cdn.net/img/new/avatars/2.webp'}
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