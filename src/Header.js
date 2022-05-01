import React, { Component } from 'react'
import './App.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import shop from './shop.jpg'
import cart from './cart.svg'

class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {
            main: "leftMain",
            left: "left",
            right: "left",
            currency: [{ symbol: "" }],
            totalPrice: 0,
        }
    }

    async componentDidMount() {
        const client = new ApolloClient({
            cache: new InMemoryCache(),
            uri: 'http://localhost:4000'
        })

        await client.query({
            query: gql`
        {
        currencies {
            label
            symbol
            }
        }
        `
        })
            .then(res => {
                this.setState({
                    currency: res.data.currencies,
                })
            })
            .catch(err => console.log(err))
    }


    setMain() {
        this.setState({
            left: "left",
            main: "leftMain",
            right: "left"
        })
        this.props.setAll()
    }

    setLeft() {
        this.setState({
            left: "leftMain",
            main: "left",
            right: "left"
        })
        this.props.setTech()
    }

    setRight() {
        this.setState({
            left: "left",
            main: "left",
            right: "leftMain"
        })
        this.props.setCloth()
    }

    changeNum(value) {
        switch (value) {
            case "$":
                this.props.setNum(0)
                break;
            case "£":
                this.props.setNum(1)
                break;
            case "A$":
                this.props.setNum(2)
                break;
            case "¥":
                this.props.setNum(3)
                break;
            case "₽":
                this.props.setNum(4)
                break;
            default:
                break;
        }
    }

    showModal() {
        let price = []
        if (this.props.cart.length > 0) {
            for (let totalPrice of this.props.cart) {
                price.push(totalPrice.prices[this.props.num].amount * totalPrice.qty)
            }
            let mainPrice = price.reduce((a, b) => a + b)
            mainPrice = mainPrice.toFixed(2)
            let modal = document.getElementById("myDrop")
            this.setState({
                totalPrice: mainPrice
            }, () => modal.style.display = "block")
        }
    }

    closeModal = () => {
        let modal = document.getElementById("myDrop")
        modal.style.display = "none"
    }

    componentDidUpdate() {
        window.onclick = function (e) {
            let drop = document.getElementById("myDrop")
            if (e.target.id === "myDrop") {
                drop.style.display = "none"
            }
        }
    }

    increase(amount, id) {
        this.setState({
            totalPrice: (parseFloat(this.state.totalPrice) + parseFloat(amount)).toFixed(2)
        })
        this.props.addQty(id)
    }

    decrease(amount, id) {
        if (this.state.totalPrice >= amount) {
            this.setState({
                totalPrice: (parseFloat(this.state.totalPrice) - parseFloat(amount)).toFixed(2)
            })
            this.props.reduceQty(id)
        }
    }

    remove(index, name, amount, choice) {
        this.props.deleteFromCart(index, name, amount, choice)
        this.closeModal()
    }


    render() {
        return (
            <div>
                <div className='header'>
                    <ul className='leftSection'>
                        <li className={`${this.state.main}`} onClick={(e) => { e.preventDefault(); this.setMain() }}>All</li>
                        <li className={`${this.state.left}`} onClick={(e) => { e.preventDefault(); this.setLeft() }}>Tech</li>
                        <li className={`${this.state.right}`} onClick={(e) => { e.preventDefault(); this.setRight() }}>Clothes</li>
                    </ul>
                    <ul className='logo'>
                        <li><img width={50} height={50} src={`${shop}`} alt="shop logo" /></li>
                    </ul>

                    <div className='mainDrop'>
                        <ul className='rightSection'>
                            <li className='right'>
                                <select onClick={(e) => this.changeNum(e.target.value)}>
                                    {
                                        this.state.currency.map((cur) => {
                                            return (
                                                <option value={cur.symbol} key={cur.symbol}>{cur.symbol}</option>
                                            )
                                        })
                                    }
                                </select>
                            </li>
                            <li onClick={() => this.showModal()} className='right'><img width={20} height={20} src={`${cart}`} alt="cart" />{this.props.cart.length}</li>
                        </ul>
                        {this.props.cart.length > 0 && (<div className='dropdown'>
                            <div id='myDrop' className='dropdown-content'>

                                <span onClick={() => this.closeModal()} className='dropClose'>&times;</span>
                                <h5 style={{ display: "flex" }}>Your Cart {this.props.cart.length} items</h5>
                                {
                                    this.props.cart.map((item, i) => {
                                        return (
                                            <div className='cartDrop' key={i}>
                                                <div className='inCart'>
                                                    <h4>{item.name}</h4>
                                                    <h4>{item.prices[this.props.num].currency.symbol} {item.prices[this.props.num].amount}</h4>
                                                    {item.attributes[0] && (<h4>
                                                        {item.attributes[0].id}: {this.props.choice[i]}
                                                    </h4>)}
                                                    <button className='remove' onClick={() => this.remove(item.id, item.name, item.prices[this.props.num].amount, this.props.choice[i])}>Remove</button>
                                                    <hr />
                                                    <hr />
                                                </div>
                                                <div className='meter'>
                                                    <p className='symbol' onClick={() => this.increase(item.prices[this.props.num].amount, item.id)}>+</p>
                                                    <p className='value' >{item.qty}</p>
                                                    <p className='symbol' onClick={() => this.decrease(item.prices[this.props.num].amount, item.id)}>-</p>
                                                </div>
                                                <img src={`${item.gallery[0]}`} alt="mainImage" width={150} height={200} />
                                            </div>
                                        )
                                    })
                                }
                                <h4>Total    {this.props.cart[0].prices[this.props.num].currency.symbol}{this.state.totalPrice}</h4>
                                <button className='checkout'><Link className='link' to="/checkout">Check Out</Link></button>
                            </div>
                        </div>)

                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default Header