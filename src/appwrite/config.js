import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
           return await this.databases.createDocument(    // ye jo createDocument h ye ek method h jo listed h appwrite k documentation me 
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,  // DOCUMENT ID ki jagah slug pass kiya hai 
            {
                title,
                content,
                featuredImage,
                status,
                userId,
            }
           ) 
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            
        }
    }

    //updatepost, updatedocument, creatpost, cretedocument ye sb predefined methods hai jo explained h documentation me appwrite k
    
    
    async updatePost (slug, {title,content, featuredImage, status}) {  // slug kuch ni bs post ka id hai
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                
                slug,
                {
                    title, 
                    content, 
                    status, 
                    featuredImage
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatepost :: error", error);
            
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
              return true; // hn bhai delete hogya hai
        } catch (error) {
            console.log("Appwrite service :: deletepost :: error", error);
            return false;
        }
    }

    // suppose hme 1 post wapis chaiye toh kya krengy tb vha ayega Get Document in appwrite documentaion
     
    async getPost(slug){ // single post recovery
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false
        }
    
    }

    // mujhe sirf vo vlaues chaiye jinka status active hai

     async getPosts(queries = [Query.equal("status", "active")]){  // parameter dene ki zarrorat ha ni kyu ki hm sari post wapis lene wale hai
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
     }   
     // hme vhi query chaiye jo active hai


     
     // file upload ki services/methods

     async uploadFile(file){  // upload krte time sirf file name dena padega
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false
        }
     }

     async deleteFile(fileId){   // delete krte time fileId deni padegi
            try {
                await this.bucket.deleteFile(
                    conf.appwriteBucketId,
                    fileId,
                )
                return true;
            } catch (error) {
                console.log("Appwrite service :: deleteFile :: error", error)
                return false;
            }
     }

     
     getFilePreview(fileId){   // yaha async await use ni kiya kyu ki koi promise ka use nhi ho rha h ye method apne aap me bhut fast hai
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            
            fileId
        )
     }
}


const service = new Service()
export default service
