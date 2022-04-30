import axios from "axios"
import {POST_REVIEW} from "./actions"
const URL="http://localhost:3001/review"


export const postReview=(token,datos)=>{
  return async (dispatch)=>{
    const {data}=await axios.post(`${URL}`,datos,
    {
      headers: {'Authorization':`bearer ${token}`}
    })
    dispatch({
      type:POST_REVIEW,
      payload:data
    })
  }
}