import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const userResolver = {
    Mutation: {
        signUp: async(_,{input}, context) => {
            try {
                const {username, name, password, gender} = input;
                if(!username || !name || !password || !gender) {
                    throw new Error("All fields are required");
                }

                const existingUser = await User.findOne({username});
                if(existingUser) {
                    throw new Error("User already exists");
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                //profile avatar from https://avatar-placeholder.iran.liara.run/
                const menProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`
                const womenProfile = `https://avatar.iran.liara.run/public/girl?username=${username}`

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === "male" ? menProfile : womenProfile
                });

                await newUser.save();
                await context.login(newUser);
                
                return newUser;

            } catch (error) {
                console.log("Error in signUp", error);
                throw new Error(error.message || "Internal server error");  
            }
        },

        login: async(_, {input}, context) => {
            try {
                const {username, password} = input;
                if(!username || !password) throw new Error("All fields are required");

                const {user} = await context.authenticate("graphql-local", {username, password});

                await context.login(user);
                return user;
                
            } catch (error) {
                console.error("Error in login", error);
                throw new Error(error.message || "Internal server error");
            }
        },

        logout: async(_, __, context) => {
            try {
                await context.logout();
                
                context.req.session.destroy((error) => {
                    if(error) throw error;
                });

                context.res.clearCookie("connect.sid");

                return {message: "Logged out seccessfully"};

            } catch (error) {
                console.error("Error in logout" ,error);
                throw new Error(error.message || "Internal server error");
            }
        }
    },

    Query: {
        authUser: async(_, __, context) => {
            try {
                const user = await context.getUser();
                return user;

            } catch (error) {
                console.error("Error in authUser: ", error);
                throw new Error("Internal server error");
            }
        },

        user: async(_, {userId}) => {
            try {
                const user = await User.findById({userId});
                return user;

            } catch (error) {
                console.log("Error in user query: ", errror);
                throw new Error(error.message || "Error getting user");
            }
        }
    },
    // Todo => add user/transaction relation
    

};

export default userResolver;