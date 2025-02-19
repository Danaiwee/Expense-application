import Transaction from '../models/transaction.model.js';

const transactionResolver = {
    Query: {
        transactions: async(_, __, context) => {
            try {
                if(!context.getUser()) throw new Error("Unauthorized");

                const userId = await context.getUser()._id;
                const transaction = await Transaction.find({userId: userId});

                return transaction;
            } catch (error) {
                console.error("Error getting transactions: ", err);
                throw new Error("Error getting transaction");

            }
        },

        transaction: async(_, {transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;

            } catch (error) {
                console.error("Error getting transaction: ", err);
                throw new Error("Error in getting transaction");
            }
        },

        categoryStatistics: async(_, __, context) => {
            if(!context.getUser()) throw new Error("Unauthorized");

            const userId = context.getUser()._id;
            const transactions = await Transaction.find({userId});
            const categoryMap = {};
            
            transactions.forEach((transaction) => {
                if(!categoryMap[transaction.category]) {
                    categoryMap[transaction.category] = 0
                }

                categoryMap[transaction.category] += transaction.amount
            })
            //example output categoryMap = {expense: 125, invesment: 0, saving: 1000};

            return Object.entries(categoryMap).map(([category, totalAmount]) => (
                {category, totalAmount}
            ))
            //example output return [{category: "expense", totalAmount: 125},]
        }
    },
    
    Mutation: {
        createTransaction: async (_, {input}, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                });

                await newTransaction.save();
                return newTransaction;
            } catch (error) {
                console.error("Error creating transaction: ", error);
                throw new Error("Error creating transaction");
            }
        },

        updateTransaction: async (_, {input}) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true});

                return updatedTransaction;
            } catch (error) {
                console.error("Error in updating transaction: ", error);
                throw new Error("Error updating transaction");

            }
        },

        deleteTransaction: async (_, {transactionId}) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (error) {
                console.error("Error deleting transaction: ", error);
                throw new Error("Error in deleting transaction");
            }
        }
    },
    Transaction: {},
};

export default transactionResolver;