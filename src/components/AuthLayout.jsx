// ye actually me ek mechanism hai kis tarah se pages ay routes ko protect kiya jata hai

import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'




export default function Protected({children, authentication = true}) {

       const navigate = useNavigate()
       const [loader, setaLoader] = useState(true)
       const authStatus  = useSelector(state => state.auth.status)

      
      
       useEffect(() => {

            if(authentication && authStatus !== authentication){
                navigate("/login")
            }else if(!authentication && authStatus !== authentication){
                navigate("/")
            }
         setaLoader(false)
       }, [authStatus, navigate, authentication])

 
       return  loader ? <h1>Loading...</h1> : <>{children}</>
   
  
}

