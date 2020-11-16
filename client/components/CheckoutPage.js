import React from 'react'
import {connect} from 'react-redux'
import {fetchCart, fetchCheckoutCart} from '../store/cart'
import Confirmation from './Confirmation'
import StripeCheckout from 'react-stripe-checkout'
import Loader from './Loader'

class CheckoutPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orderProcessed: false,
      isLoading: true
    }
    this.handleToken = this.handleToken.bind(this)
  }

  async componentDidMount() {
    await this.props.getCart()
    this.setState({isLoading: false})
  }

  async handleToken(token) {
    let cart = {...this.props.cart}
    token.cart = cart
    await this.props.checkoutCart(token)
  }

  render() {
    const cart = this.props.cart || {}
    const products = cart.products
    let total = 0
    if (products) {
      total = products.reduce(function(accum, current) {
        return accum + current.price * current.orderItem.quantity
      }, 0)
    }

    if (this.state.isLoading) {
      return <Loader />
    } else if (!this.state.orderProcessed && products && products.length) {
      return (
        <>
          <h2>Checkout page!</h2>
          <div className="orderSummary">
            <p>Order Summary:</p>
            <ul>
              {products.map(product => {
                return (
                  <li key={product.id}>
                    {product.name} ({product.orderItem.quantity}) &mdash;{' '}
                    {product.priceDisplay}
                  </li>
                )
              })}
            </ul>
            Total Price: ${(total / 100).toFixed(2)}
          </div>
          <StripeCheckout
            stripeKey="pk_test_6pRNASCoBOKtIshFeQd4XMUh"
            token={this.handleToken}
            billingAddress
            shippingAddress
            amount={total}
          />
        </>
      )
    } else {
      return <Confirmation />
    }
  }
}

const mapStateToProps = state => ({
  cart: state.cart
})

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(fetchCart()),
  checkoutCart: cart => dispatch(fetchCheckoutCart(cart))
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage)
