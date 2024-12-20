import {FaTrash} from 'react-icons/fa';
import {FaLocationDot} from 'react-icons/fa6';
import {BsCardText} from 'react-icons/bs';
import {MdOutlinePayments} from 'react-icons/md';
import { FaSackDollar } from 'react-icons/fa6';
import {HiPencilAlt} from 'react-icons/hi';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';

const categoryColorMap = {
    saving: 'from-green-700 to-green-400',
    expense: 'from-pink-800 to-pink-600',
    investment: 'from-blue-700 to-blue-400'
};

const Card = ({cardType}) => {
  const cardClass = categoryColorMap[cardType];  

  return (
    <motion.div 
        className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}
        initial={{y: 20, opacity: 0}}
        animate={{y: 0, opacity: 1 }}
        transition={{duration: 1}}
        whileHover={{y: -5, scale: 1.03}}
    >
        <div className='flex flex-col gap-3'>
            <div className='flex flex-row items-center justify-between'>
                <h2 className='text-lg font-bold text-white'>Saving</h2>
                <div className='flex items-center gap-1'>
                    <FaTrash className='cursor-pointer' />
                    <Link to={`/transaction/123`}>
                        <HiPencilAlt size={20} className='cursor-pointer' />
                    </Link>
                </div>
            </div>
            <p className='text-white flex items-center gap-1'>
                <BsCardText />
                Description: Salary
            </p>
            <p className='text-white flex items-center gap-1'>
                <MdOutlinePayments />
                Payment Type: Crash
            </p>
            <p className='text-white flex items-center gap-1'>
                <FaSackDollar />
                Amount: $150
            </p>
            <p className='text-white flex items-center gap-1'>
                <FaLocationDot />
                Location: New York
            </p>
            <div className='flex justify-between items-center'>
                <p className='text-xs text-black font-bold'>
                    21 Sep 2021
                </p>
                <img 
                    src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
                    className='size-8 border rounded-full'
                    alt=''
                />
            </div>
        </div>
    </motion.div>
  )
}

export default Card