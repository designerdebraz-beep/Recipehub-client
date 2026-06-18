import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins"


const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('RecipeHub');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
 
  emailAndPassword: {    
        enabled: true,
    },

      user: {
    additionalFields: {
      role: {
        defaultValue: "user",
      },
      plan: {
        defaultValue: "free",
      },
    },
  },
    
     socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID, 
            clientSecret: process.env.Client_SECRET,
        }, 
       
   
        
    },
         session:{
      cookieCache: {
        enabled:true,
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60
      }
    },
     plugins: [
        jwt()
    ],

    
});