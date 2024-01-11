import React, { useState } from "react"
import { API } from "./utils/API"
import clsx from "clsx"

interface Data {
  hashedPassword ? : string
  error ?: string  ,
  success ?: string ,
  users ?:  Array<{ hashedPassword : string , name : string }>
}

type Page = "login" | "signUp" 

function App() {
  const [data , setData ] = useState<Data>({})
  const [page , setPage] = useState<Page>("signUp") 
  const authenticated = true
  return (
      <> 
       {/* AUTH */}
        <p className={clsx( "mb-20 ",{ 
          "text-green-500" : authenticated  , 
          "text-red-700" :  !authenticated    })}>
        { authenticated ? "Your are authenticated with cookies and session id awesome!!" : "Hidden text for authenticated users" }
        </p> 
       
        <button 
          className={clsx("bg-slate-900 px-6 py-2 rounded font-bold hover:bg-blue-800" , {
            "bg-blue-800" :  page === "login"
          })}  
          onClick={() => setPage("login")}>login
        </button>
        <button  className={clsx("bg-slate-900 px-6 py-2 rounded font-bold ml-6 mb-10 hover:bg-blue-800" , {
          "bg-blue-800" : page === "signUp"
        })}
          onClick={() => setPage("signUp")}>
            signUp
        </button>
      
       <div className="flex">
          {page === "login" 
          ?  <LoginForm setData={setData} data={data}></LoginForm>    
          :  <SignUpForm setData={setData} data={data}></SignUpForm> }
         
          {/* USERS TABLE */}
          <div className="flex flex-col w-[600px] ml-auto absolute right-10">
            <h1 className="text-xl">Users Table</h1>
             <div className="flex flex-col gap-2">
                { data?.users?.map( e => (
                <div className="flex flex-col text-sm border-t border-gray-400  border-dashed gap-2 " key={e.hashedPassword}>
                  <span className="mt-2">User : {e.name}</span>
                  <span>Password : {e.hashedPassword}</span>
                </div>)) }
             </div>
          </div>
       </div>

       {/* STATUS */}
       <div className='absolute top-0 right-auto left-auto mt-10 flex items-center gap-10'>
            <h1 className='text-3xl '>Status:</h1>
            <p className="">{data.success ? "Authenticated"  :  "New user or not authenticated"}</p>
       </div>
      </>
  )
}

export default App

function SignUpForm ( { setData  , data}) {
  const [formData , setFormData] = useState({ name : "" , password : "" })
  function handleSubmit (e : React.FormEvent) {
    e.preventDefault()
    fetch(`${API.serverUrl}/signUp`, { method : "POST" , body : JSON.stringify(formData)  , headers :  {"Content-Type" : "application/json"} } )
    .then(res => res.json() )
    .then(data => {
      setData(data)
    })

  }
  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-start gap-2'>
      <label htmlFor="">Name</label>
      <input
        onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }}
        value={formData.name}
        className='mt-2  py-2 px-2  rounded outline-none' type="text" placeholder='abiel...' />
      <label htmlFor="" className='mt-2'>Password</label>
      <input
        onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }}
        value={formData.password}
        className='mt-2  py-2 px-2  rounded outline-none' type="password" placeholder='*****' />
      {/* LOGIN BUTTON */}
      <button className='mt-2 rounded bg-blue-500 px-4 py-2 active:scale-95 outline-none '>
        Sign up
      </button>
      <div className="mt-20 w-[400px] text-sm ">
        <h1 className="text-2xl">Hashed password</h1>
        <p>{data?.hashedPassword}</p>
        <p className="text-red-600">{data?.error}</p>
      </div>
    </form>)
}



function LoginForm ({ setData  , data }) {
  const [formData , setFormData] = useState({ name : "" , password : "" })

  function handleSubmit (e : React.FormEvent) {
    e.preventDefault()
    fetch(`${API.serverUrl}/login`, { 
      method : "POST" , 
      body : JSON.stringify(formData) , 
      credentials : "include" ,   
      headers :  {"Content-Type" : "application/json"} } )
    
    .then(res => res.json() )
    .then(data => {
      setData(data)
    })

  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-start gap-2'>
      <label htmlFor="">Name</label>
      <input
        onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }}
        value={formData.name}
        className='mt-2  py-2 px-2  rounded outline-none' type="text" placeholder='abiel...' />
      <label htmlFor="" className='mt-2'>Password</label>
      <input
        onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }}
        value={formData.password}
        className='mt-2  py-2 px-2  rounded outline-none' type="password" placeholder='*****' />
      {/* LOGIN BUTTON */}
      <button className='mt-2 rounded bg-blue-500 px-4 py-2 active:scale-95 outline-none '>
        Login
      </button>
      <div className="mt-20 w-[400px] text-sm ">
        <h1 className="text-2xl">Hashed password</h1>
        <p>{data?.hashedPassword}</p>
        <p className="text-red-600">{data?.error}</p>
      </div>
    </form>
  )

}