const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
} = require('graphql')
const app = express()

var isLoggedIn = false;
var userName = '';

const verificationResponse = new GraphQLObjectType({
    name: 'response',
    fields: () => ({
        response: {type: GraphQLBoolean}
    })
})

const isLoggedInResponse = new GraphQLObjectType({
    name: 'response',
    fields: () => ({
        response: {type: GraphQLBoolean}
    })
})

const userNameResponse = new GraphQLObjectType({
    name: 'userName',
    fields: () => ({
        userName: {type: GraphQLString}
    })
})


const verifyUser = (username, password) => {
    if(username == "MJ") {
        if(password == "pass"){
            isLoggedIn = true;
            userName = username
            return {response: true};
        }
    }
    return {response: false};
}


const verifyUserQuery = new GraphQLObjectType({
    name: 'verifyUser',
    fields: () => ({
        verify: {
            type: verificationResponse,
            args:{
                username: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            resolve: (parent, args) => verifyUser(args.username, args.password)
        }
    })
})

const checkLoggedIn = () => {
    return {response: isLoggedIn}
}

const getUsername = () => {
    return {userName: userName}
}

const isLoggedInQuery = new GraphQLObjectType({
    name: 'login',
    fields: () => ({
        loggedIn: {
            type: isLoggedInResponse,
            resolve: () => checkLoggedIn()
        },
        getUserName: {
            type: userNameResponse,
            resolve: () => getUsername()
        }
    })
})

const logOut  = new GraphQLObjectType({
    name: 'logout',
    fields: () => ({
        loggingOut: {
            type: GraphQLString,
            resolve: () => {isLoggedIn = false; return "success"}
        }
    })
})

const verifyUserSchema = new GraphQLSchema({
    query: verifyUserQuery
})

const loggedInSchema = new GraphQLSchema({
    query: isLoggedInQuery,
    mutation:logOut
})


var cors = require('cors')
const {response} = require("express");

app.use(cors()) // Use this after the variable declaration

app.use('/authentication', graphqlHTTP({
    graphiql: true,
    schema: verifyUserSchema
}))

app.use('/isLoggedIn', graphqlHTTP({
    graphiql: true,
    schema: loggedInSchema
}))

app.listen(4000, () => console.log('server running'))


//LOGGING IN
// {
//     loggedIn{
//     response
// }
// }


//GET USERNAME
// {
//     getUserName {
//     userName
// }
// }

//LOGOUT
// mutation logout{
//     loggingOut
// }