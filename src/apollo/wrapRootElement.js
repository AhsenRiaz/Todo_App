
import React from "react";
import {client} from "./client";
import {ApolloProvider} from "@apollo/client"

export const wrapRootElement = ({element}) => (
    
    <ApolloProvider client = {client} >{element}</ApolloProvider>
)