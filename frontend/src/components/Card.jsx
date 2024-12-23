import {FaTrash} from 'react-icons/fa';
import {FaLocationDot} from 'react-icons/fa6';
import {BsCardText} from 'react-icons/bs';
import {MdOutlinePayments} from 'react-icons/md';
import { FaSackDollar } from 'react-icons/fa6';
import {HiPencilAlt} from 'react-icons/hi';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {formatDate} from '../utils/formatDate.js';
import {DELETE_TRANSACTION} from '../graphql/mutations/transaction.mutation.js';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';

const categoryColorMap = {
    saving: 'from-green-700 to-green-400',
    expense: 'from-pink-800 to-pink-600',
    investment: 'from-blue-700 to-blue-400'
};

const Card = ({transaction, authUser}) => {
  let {amount, category, date, description, location, paymentType} = transaction;

  const cardClass = categoryColorMap[category];
  
  description = description[0]?.toUpperCase() + description.slice(1);
  paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);
  location = location[0]?.toUpperCase() + location.slice(1);
  category = category[0]?.toUpperCase() + category.slice(1);
  amount = parseFloat(amount);
  date = formatDate(date);

  const [deleteTransaction, {loading}] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ['GetTransactions']
  });

  const handleDelete = async () => {
    try {
        await deleteTransaction({
            variables: {
                transactionId: transaction._id
            }
        })
        toast.success("Delete transaction successfully");
    } catch (error) {
        console.error("Error in delete transaction", error);
        toast.error(error.message);
    }
  };

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
                <h2 className='text-lg font-bold text-white'>{category}</h2>
                <div className='flex items-center gap-1'>
                    {!loading && (
                        <FaTrash 
                        className='cursor-pointer' 
                        onClick={handleDelete}    
                    />
                    )}
                    {loading && (
                        <div className='animate-spin size-6 border-b-2 rounded-full'></div>
                    )}
                    <Link to={`/transaction/${transaction._id}`}>
                        <HiPencilAlt size={20} className='cursor-pointer' />
                    </Link>
                </div>
            </div>
            <p className='text-white flex items-center gap-1'>
                <BsCardText />
                Description: {description}
            </p>
            <p className='text-white flex items-center gap-1'>
                <MdOutlinePayments />
                Payment Type: {paymentType}
            </p>
            <p className='text-white flex items-center gap-1'>
                <FaSackDollar />
                Amount: ${amount}
            </p>
            <p className='text-white flex items-center gap-1'>
                <FaLocationDot />
                Location: {location}
            </p>
            <div className='flex justify-between items-center'>
                <p className='text-xs text-black font-bold'>
                    {date}
                </p>
                <img 
                    src={authUser?.profilePicture}
                    className='size-8 border rounded-full'
                    alt='Profile pic'
                />
            </div>
        </div>
    </motion.div>
  )
}

export default Card