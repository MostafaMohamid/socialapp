import { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import DropDownComment from "../DropDownComent/DropDownComment"
import CreateReplyCard from '../../CreateReplyCard/CreateReplyCard'
import { AuthContext } from '../../Context/AuthContext'

export default function CommentCard({ comment, postId }) {
  const { userData } = useContext(AuthContext)
  const query = useQueryClient()
  const commentId = comment?._id
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isLiked, setIsLiked] = useState(Boolean(comment?.liked || comment?.isLiked))
  const [likesCount, setLikesCount] = useState(comment?.likesCount || 0)

  const isOwner = userData?._id === comment?.commentCreator?._id

  function getReplies() {
    return axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  const { data: replies, isLoading: repliesLoading } = useQuery({
    queryKey: ['getReplies', postId, commentId],
    queryFn: getReplies,
    select: (data) => data?.data?.data?.replies,
    enabled: showReplies
  })

  function likeComment() {
    return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  const { mutate: likeMutation, isPending: likePending } = useMutation({
    mutationFn: likeComment,
    onSuccess: (response) => {
      const liked = response?.data?.data?.liked
      const count = response?.data?.data?.likesCount
      setIsLiked(Boolean(liked))
      if (typeof count === 'number') {
        setLikesCount(count)
      }
      query.invalidateQueries({ queryKey: ['getComments', postId] })
    },
    onError: (err) => {
      console.log('error in comment like', err?.response?.data || err.message)
    }
  })

  function handleReplyClick() {
    setShowReplies(true)
    setShowReplyForm(true)
  }

  // return (
  //   <div className='border border-muted-foreground bg-red-600 p-3 mt-2'>
  //     <header className="flex items-center space-x-3 mb-3">
  //       <img src={comment?.commentCreator?.photo} className='h-10 w-10 rounded-full' alt={comment?.commentCreator?.name} />
  //       <div>
  //         <p className="font-semibold">{comment?.commentCreator?.name}</p>
  //         <p className="text-xs text-secondary-foreground">{comment?.createdAt}</p>
  //       </div>
  //     </header>
  //     <div className="flex items-center justify-between space-x-3">
  //       <div className="mb-3">
  //         <p className="mb-1 ps-3 font-medium">{comment?.content}</p>
  //         {comment?.image && <img src={comment.image} alt="" className="rounded max-h-48 mt-2 ps-3" />}
  //       </div>
  //       {isOwner && <DropDownComment postId={postId} comment={comment} />}
  //     </div>
  //     <div className="flex items-center ps-4 gap-4">
  //       <button
  //         type="button"
  //         disabled={likePending}
  //         onClick={() => likeMutation()}
  //         className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-accent' : 'text-secondary-foreground hover:text-accent'}`}
  //       >
  //         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-5 ${isLiked ? 'text-accent' : ''}`}>
  //           <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
  //         </svg>
  //         {likesCount > 0 ? likesCount : ''}
  //       </button>
  //       <button
  //         type="button"
  //         onClick={handleReplyClick}
  //         className="text-secondary-foreground text-xs cursor-pointer hover:underline hover:text-accent"
  //       >
  //         Reply
  //       </button>
  //       {(comment?.repliesCount > 0 || showReplies) && (
  //         <button
  //           type="button"
  //           onClick={() => setShowReplies(!showReplies)}
  //           className="text-secondary-foreground text-xs cursor-pointer hover:underline hover:text-accent"
  //         >
  //           {showReplies ? 'Hide replies' : `View replies (${comment?.repliesCount || replies?.length || 0})`}
  //         </button>
  //       )}
  //     </div>

  //     {showReplyForm && (
  //       <CreateReplyCard postId={postId} commentId={commentId} />
  //     )}

  //     {showReplies && (
  //       <div className="mt-2 ps-6 border-l-2 border-accent">
  //         {repliesLoading && <p className="text-xs text-secondary-foreground ps-2">Loading replies...</p>}
  //         {replies?.map((reply) => (
  //           <div key={reply._id} className="border border-accent p-2 mt-2 rounded bg-muted-foreground/10">
  //             <header className="flex items-center gap-2 mb-1">
  //               <img src={reply?.commentCreator?.photo || reply?.replyCreator?.photo} className='h-8 w-8 rounded-full' alt="" />
  //               <div>
  //                 <p className="font-semibold text-sm">{reply?.commentCreator?.name || reply?.replyCreator?.name}</p>
  //                 <p className="text-xs text-secondary-foreground">{reply?.createdAt}</p>
  //               </div>
  //             </header>
  //             <p className="text-sm ps-2">{reply?.content}</p>
  //           </div>
  //         ))}
  //         {!repliesLoading && replies?.length === 0 && (
  //           <p className="text-xs text-secondary-foreground ps-2">No replies yet</p>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // )
  return (
    <div className="mt-3 rounded-xl bg-muted/50 px-3 py-3 transition-colors duration-200 hover:bg-muted/70">
      {/* Comment Header */}
      <header className="flex items-start gap-2.5">
        <img
          src={comment?.commentCreator?.photo || "/sanic.svg"}
          alt={comment?.commentCreator?.name || "User"}
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {comment?.commentCreator?.name}
              </p>

              <p className="text-[11px] text-muted-foreground">
                {new Date(comment?.createdAt).toLocaleString()}
              </p>
            </div>

            {isOwner && (
              <DropDownComment postId={postId} comment={comment} />
            )}
          </div>

          {/* Comment Content */}
          <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
            {comment?.content}
          </p>

          {comment?.image && (
            <img
              src={comment.image}
              alt="Comment attachment"
              className="mt-2 max-h-48 max-w-full rounded-lg border border-border object-contain"
            />
          )}

          {/* Comment Actions */}
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              disabled={likePending}
              onClick={() => likeMutation()}
              className={`inline-flex items-center gap-1 text-xs font-medium  transition-colors duration-200 ${isLiked
                  ? "text-cyan-600" 
                  : "text-muted-foreground hover:text-cyan-600 "
                } disabled:opacity-50`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.7}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904"
                />
              </svg>
              {likesCount > 0 ? likesCount : "Like"}
            </button>

            <button
              type="button"
              onClick={handleReplyClick}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-cyan-600"
            >
              Reply
            </button>

            {(comment?.repliesCount > 0 || showReplies) && (
              <button
                type="button"
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-cyan-600"
              >
                {showReplies
                  ? "Hide replies"
                  : `View replies (${comment?.repliesCount || replies?.length || 0})`}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3">
              <CreateReplyCard postId={postId} commentId={commentId} />
            </div>
          )}

          {/* Replies */}
          {showReplies && (
            <div className="mt-3 space-y-2 border-l-2 border-cyan-500/30 pl-3">
              {repliesLoading && (
                <p className="text-xs text-muted-foreground">Loading replies...</p>
              )}

              {replies?.map((reply) => (
                <div
                  key={reply._id}
                  className="rounded-lg bg-background px-2.5 py-2"
                >
                  <header className="mb-1 flex items-center gap-2">
                    <img
                      src={
                        reply?.commentCreator?.photo ||
                        reply?.replyCreator?.photo ||
                        "/sanic.svg"
                      }
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {reply?.commentCreator?.name ||
                          reply?.replyCreator?.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(reply?.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </header>

                  <p className="break-words pl-9 text-sm text-foreground">
                    {reply?.content}
                  </p>
                </div>
              ))}

              {!repliesLoading && replies?.length === 0 && (
                <p className="text-xs text-muted-foreground">No replies yet</p>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  )
}
