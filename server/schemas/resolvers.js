// import user model
const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
        //query that returns the current user,pulls the users id from context
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        }       
    },
    Mutation : {
        //addUser mutation that returns an Auth object
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
          
            return { token, user };
        },
      
        // login mutation that returns an Auth object
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
          
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const token = signToken(user);
            return { token, user };
        },

        // saveBook mutation that adds a book to the user and returns a User object, pulls the user's id from context
        saveBook: async (parent, {bookData},context) => {
            if(context.user){
                const updateUser = await User.findByIdAndUpdate(
                    {_id : context.user._id},
                    {$push : {savedBooks : bookData}},
                    {new: true}
                );
                
            return updateUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

         // removeBook mutation removes a book from the user and returns a User object, pulls the user's id from context
        removeBook: async (parent, { bookId }, context) => {
            if(context.user){
                const updateUser = await User.findOneAndUpdate(
                    {_id : context.user._id},
                    {$pull : {savedBooks : { bookId: bookId }}},
                    {new: true}
                );
                
            return updateUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;