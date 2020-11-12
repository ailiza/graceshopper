import axios from 'axios'

const GET_CART = 'GET_CART'

const UPDATE_ITEM_QUANTITY = 'UPDATE_ITEM_QUANTITY'
// const UPDATE_PRODUCT = 'UPDATE_PRODUCT'

const ADD_NEW_ITEM_TO_CART = 'ADD_NEW_ITEM_TO_CART'
//const ADD_EXISTING_ITEM_TO_CART = 'ADD_EXISTING_ITEM_TO_CART'

//action creators
export const getCart = cart => {
  return {
    type: GET_CART,
    cart
  }
}

export const updateItemQuantity = item => {
  return {
    type: UPDATE_ITEM_QUANTITY,
    item
  }
}

export const addNewItemToCart = itemToAdd => {
  return {
    type: ADD_NEW_ITEM_TO_CART,
    itemToAdd
  }
}

//thunks
export const fetchCart = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/cart')
      dispatch(getCart(data))
    } catch (error) {
      console.error(error)
    }
  }
}

export const fetchUpdatedItemQuantity = id => {
  return async dispatch => {
    try {
      const {data} = await axios.put(`/api/cart/${id}`)
      dispatch(updateItemQuantity(data))
    } catch (error) {
      console.error(error)
    }
  }
}

// export const deleteProduct = (id) => {
//   return async () => {
//     try {
//       await axios.delete(`/api/products/${id}`)
//       // dispatch(deleteSingleProduct(id))
//     } catch (error) {
//       console.error(error)
//     }
//   }
// }

// export const addProduct = (product) => {
//   // if (!campus.imageUrl) {
//   //   campus.imageUrl =
//   //     "https://media.istockphoto.com/vectors/vector-school-building-vector-id186655818?k=6&m=186655818&s=612x612&w=0&h=4LAjSdZViLIyvYNILscpMjbkd2e6_2mPa3yf-cStV3Q=";
//   // }
//   return async () => {
//     try {
//       await axios.post('/api/products', product)
//     } catch (error) {
//       console.error(error)
//     }
//   }
// }

export const fetchAddNewItemToCart = itemToAdd => {
  return async dispatch => {
    try {
      console.log('THUNK ITEM', itemToAdd)
      const {data} = await axios.post('/api/cart', itemToAdd)
      dispatch(addNewItemToCart(data))
    } catch (err) {
      console.log(err)
    }
  }
}

//initial state
const initialState = {}

//reducer
export const cartReducer = (cart = initialState, action) => {
  switch (action.type) {
    case GET_CART:
      return action.cart
    case UPDATE_ITEM_QUANTITY: {
      const updatedCart = {...cart}
      for (let i = 0; i < updatedCart.products.length; i++) {
        let current = updatedCart.products[i]
        if (current.id === action.item.productId) {
          current.orderItem = action.item
        }
      }
      console.log('UPDATED CART ', updatedCart)

      return updatedCart
    }
    case ADD_NEW_ITEM_TO_CART: {
      let newCart = {...cart}
      newCart.products.push({
        id: action.itemToAdd.productId,
        orderItem: action.itemToAdd
      })

      console.log('NEW CART ', newCart)
      return newCart
    }
    default:
      return cart
  }
}