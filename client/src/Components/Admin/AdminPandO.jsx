import '../../Css/AdminPandO.css'
import React from "react"; 
import {useEffect, useState} from "react";
import { useNavigate, NavLink } from "react-router-dom"
import {useSelector, useDispatch} from "react-redux";
import ClosedSideBarAdmin from "./ClosedSideBarAdmin";
import AdminNav from './AdminNav';
import { getAllOrders, getOrderByStatus } from '../../redux/actions/ordersAdmin';
import { roleUser } from "../../redux/actions/Loginregister";
import { getOrderByEmail } from "../../redux/actions/ordersAdmin";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";




export default function AdminPandO() {
  const { role } = useSelector(store => store.root)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [order, setOrder]=useState('')

  const [dropDown, setDropDown] = useState(false);
  function abrirYcerrar() {
    setDropDown(!dropDown);
  }
 

var token1 = window.localStorage.getItem("token")
  useEffect(() => {
    
    if (window.localStorage.getItem("token")) {
      const token = window.localStorage.getItem("token")
      dispatch(roleUser(token))
      if (role.admin) {
        
        dispatch(getAllOrders(token))
      }
      else if (role.admin===false) {
        navigate("/home")
      }
    }

  }, []);


function handleChange(e){
  e.preventDefault();
  setOrder(e.target.value)
  
  
}
function handleSubmit(e){
  e.preventDefault();
  
  dispatch(getOrderByEmail(token1,order)  )
 
}

function handleStatusFilter(e){
  e.preventDefault();
  dispatch(getOrderByStatus(token1 ,e.target.value))
}
  const allOrders = useSelector(state=>state.admin.allOrders)
  
    return (
      <div className="container-fluid admin-container">
      
      <ClosedSideBarAdmin />   
      <div className='adminNav'>   
      <AdminNav section='Purchases and Orders'/>
      </div>

      <div className='orders-card'>
        <div className='lastest-orders-body-card'>
        <div className='title-and-search'>
        <h3 className='t-title'>Orders</h3>
        <form className=" col-md-6 admin-search" >
        
		    <input type="text" placeholder="Search..." className="form-control-admin" onChange={(e)=>handleChange(e) }>
            </input>
            <button type="submit" className='submit-admin' onClick={(e)=>handleSubmit(e)}>
                <i className="bi bi-search search-admin">
                </i>
            </button>
		    </form>
        <Dropdown isOpen={dropDown} toggle={abrirYcerrar}>
            <DropdownToggle caret className="admin-drop">
              <i className="bi bi-person person-admin" width="40px"></i>
            </DropdownToggle>
            <DropdownMenu >
              <DropdownItem value='undelivered' onClick={(e)=>handleStatusFilter(e)}>undelivered</DropdownItem>
              <DropdownItem value='delivered' onClick={(e)=>handleStatusFilter(e)}>delivered</DropdownItem>
              <DropdownItem value='completed' onClick={(e)=>handleStatusFilter(e)}>completed</DropdownItem> 
              <DropdownItem value='canceled' onClick={(e)=>handleStatusFilter(e)}>canceled</DropdownItem> 
            </DropdownMenu>
          </Dropdown>

        
          </div>
        
        <table className="table table-hover">
        <thead>
						<tr>
              <th scope="col">#ID</th>
							<th scope="col">Name</th>
							<th scope="col">Email</th>
							<th scope="col">Total</th>
							<th scope="col">Status</th>
							<th scope="col">Date</th>
							<th scope="col" className="text-end"> Action </th>
						</tr>
					</thead>
          <tbody>
            {allOrders.map(e=>{
              return(
                <tr key={e.id}>
                <td>{e.id} {/* ID order */}</td>
                <td>
                  <b> {e.user.userName} {/* Customer name */}</b>
                </td>
                <td>{e.user.email}{/* email@example.com */}</td>
                <td>${e.total} {/* total */}</td>
                <td>
                  <span className="badge rounded-pill alert-success">
                   {e.delivered} {/* status */}
                  </span>
                </td>
                <td>{e.createdAt.slice(0,10)} {/* date */}</td>
                <td className="text-end">
                <NavLink  to={`/home/admin/order/${e.id}`} className="btn btn-light detalle">
                  Detail
                </NavLink>
                </td>
              </tr>)
              
            })}
          		<tr>
                <td>ID order</td>
          			<td><b>Customer name</b></td>
          			<td>email@example.com</td>
          			<td>$778.35</td>
          			<td><span className="badge rounded-pill alert-success">status</span></td>
          			<td>07.05.2020</td>
          			<td className="text-end">
          				<a href="order/detail" className="btn btn-light detalle">Detail</a>
          			</td>
          		</tr>
              </tbody>
        </table>

        </div>
      </div>
      </div>
    );
  }