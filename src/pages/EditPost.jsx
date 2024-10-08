import React, {useEffect, useState} from 'react'
import { Container } from '../components'
import appwriteService from "../appwrite/config"
import { useNavigate, useParams } from 'react-router-dom'
import { PostForm } from '../components'

function EditPost() {

    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()
    console.log(slug);
    

    useEffect(() => {
        if(slug) {
            appwriteService.getPost(slug).then((post) => {
                if(post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])

  return  post ? (
    <div className='py-8'>
        <Container>
            <PostForm post={post?.data} />
        </Container>
    </div>
  ) : null
}

export default EditPost