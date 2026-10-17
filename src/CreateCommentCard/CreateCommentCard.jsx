import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
// import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ImagePlus } from "lucide-react";
import { Send, LoaderCircle } from "lucide-react";
export default function CreateCommentCard({ postId }) {
  const query = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: '',
      image: ''
    }
  })


  let formData = new FormData()

  function createCommentFunc() {
    return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`

      }
    })
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createCommentFunc,

    onSuccess: () => {
      reset()
      toast.success('comment Created Successfully', {})
      query.invalidateQueries({ queryKey: ['getComments', postId] })


    },
    onError: () => {

      toast.error('cannot Creat Comment ')
    }
  })


  function handleCreateComment(data) {

    console.log('create Comment', data);
    // call api
    if (!data.content && !data.image[0]) return

    if (data.content) {
      formData.append('content', data.content)
    }

    if (data.image[0]) {
      formData.append('image', data.image[0])
    }

    console.log(formData);


    // call api
    mutate()
  }
  return (
    <>
      <div className='p-3 mt-4 '>
        <form onSubmit={handleSubmit(handleCreateComment)} >


          <div className="flex items-center mt-1">
            {/* <label htmlFor="imgFile"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            </label> */}
            <label
              htmlFor="imgFile"
              className="inline-flex cursor-pointer items-center justify-center
             rounded-full p-2 text-gray-500
             transition-all duration-200
             hover:bg-cyan-50 hover:text-cyan-600
             active:scale-95"
              title="Attach image"
            >
              <ImagePlus size={24} strokeWidth={1.8} />
            </label>
            <input  {...register('image')} id='imgFile' type="file" className='w-0' />
            <input  {...register('content')} type="text" id="input-9" className="w-full h-10 px-3 text-sm text-secondary-foreground border border-r-0 rounded-r-none border-accent focus:outline-none rounded shadow-sm" placeholder="Add Your Comment" />
            {/* <button disabled={isPending} type='submit' className="h-10 px-4 text-sm bg-accent border border-l-0 border-accent rounded-r shadow-sm text-primary-foreground hover:text-primary-foreground hover:bg-accent/80 hover:border-accent/80 focus:outline-none">
              {isPending ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-spin">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              }




            </button> */}


            <button
              disabled={isPending}
              type="submit"
              aria-label="Add comment"
              title="Add comment"
              className="inline-flex h-10 items-center justify-center rounded-r-lg
    border border-l-0 border-cyan-500 bg-gradient-to-r from-blue-500 to-cyan-400
    px-4 text-white shadow-sm
    transition-all duration-200
    hover:from-blue-600 hover:to-cyan-500
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-cyan-400 focus-visible:ring-offset-2
    active:scale-95
    disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

        </form>
      </div>
    </>
  )
}
