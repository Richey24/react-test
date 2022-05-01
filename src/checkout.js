import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addQty, deleteFromCart, reduceQty } from './redux/action';
import { Link } from 'react-router-dom';


class Checkout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            totalPrice: 0,
            cart: []
        }
    }
    componentDidMount() {
        if (this.props.cart.totalPrice.length > 0) {
            let price = []
            for (let i = 0; i < this.props.cart.totalPrice.length; i++) {
                price.push(this.props.cart.totalPrice[i].amount * this.props.cart.cart[i].qty)
            }
            let mainPrice = price.reduce((a, b) => a + b)
            mainPrice = mainPrice.toFixed(2)
            this.setState({
                totalPrice: mainPrice,
            })
        }
    }

    increase(amount, id) {
        this.setState({
            totalPrice: (parseFloat(this.state.totalPrice) + parseFloat(amount)).toFixed(2)
        })
        this.props.addToQty(id)
    }

    decrease(amount, id) {
        if (this.state.totalPrice >= amount) {
            this.setState({
                totalPrice: (parseFloat(this.state.totalPrice) - parseFloat(amount)).toFixed(2)
            })
            this.props.removeQty(id)
        }
    }

    remove(index, name, amount) {
        let cart = this.props.cart.cart.filter((single) => single.id === index)
        let price = this.props.cart.totalPrice.filter((pri) => pri.amount === amount)
        let num = price[0].amount * cart[0].qty
        this.setState({
            totalPrice: (parseFloat(this.state.totalPrice) - parseFloat(num)).toFixed(2)
        })
        this.props.deleteCart(index, name, amount)
    }

    render() {
        return (
            <div>
                <h2>CART</h2>
                {
                    this.props.cart.cart.length > 0 ? this.props.cart.cart.map((item, i) => {
                        return (
                            <div className='cartDrop' key={i}>
                                <div className='inCart'>
                                    <h4>{item.name}</h4>
                                    <h4>{this.props.cart.totalPrice[i].currency.symbol} {this.props.cart.totalPrice[i].amount}</h4>
                                    {item.attributes[0] && (<h4>
                                        {item.attributes[0].id}: {this.props.cart.choice[i]}
                                    </h4>)}
                                    <button className='remove' onClick={() => this.remove(item.id, item.name, this.props.cart.totalPrice[i].amount)}>Remove</button>
                                    <hr />
                                    <hr />
                                </div>
                                <div className='meter'>
                                    <p className='symbol' onClick={() => this.increase(this.props.cart.totalPrice[i].amount, item.id)}>+</p>
                                    <p className='value' >{item.qty}</p>
                                    <p className='symbol' onClick={() => this.decrease(this.props.cart.totalPrice[i].amount, item.id)}>-</p>
                                </div>
                                <img src={`${item.gallery[0]}`} alt="mainImage" width={150} height={200} />
                            </div>
                        )
                    }) : (<div><h4>No Item In Cart</h4></div>)
                }
                {this.props.cart.cart.length > 0 ? (<div><h4>Total    {this.props.cart.totalPrice[0].currency.symbol}{this.state.totalPrice}</h4> <button className='checkout'>Pay Now</button></div>) : ""}
                <button className='shop'><Link className='link' to="/">Continue Shopping</Link></button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        cart: state,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteCart: (index, name, amount) => dispatch(deleteFromCart(index, name, amount)),
        addToQty: (id) => dispatch(addQty(id)),
        removeQty: (id) => dispatch(reduceQty(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)