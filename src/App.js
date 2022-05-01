import React, { Component } from 'react'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import './App.css';
import Header from './Header';
import { connect } from 'react-redux';
import { addQty, addToCart, deleteFromCart, reduceQty } from './redux/action';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      allProducts: [],
      mainProducts: { products: [] },
      num: 0,
      single: {},
      index: 0,
      option: "",
      amount: 0,
      choice: [],
      set: new Set(),
      totalPrice: []
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
        categories {
          name
          products {
            id
            name
            inStock
            gallery
            description
            category
            brand
            prices {
              currency {
                symbol
                label
              }
              amount
            }
          }
        }
      }
      `
    })
      .then(res => {
        this.setState({
          allProducts: res.data.categories,
          mainProducts: res.data.categories[0]
        })
      })
      .catch(err => console.log(err))
  }

  setTech = () => {
    let newProduct = this.state.allProducts.filter((pro) => { return pro.name === 'tech' })
    this.setState({
      mainProducts: newProduct[0]
    })
  }
  setCloth = () => {
    let newProduct = this.state.allProducts.filter((pro) => { return pro.name === 'clothes' })
    this.setState({
      mainProducts: newProduct[0]
    })
  }
  setAll = () => {
    let newProduct = this.state.allProducts.filter((pro) => { return pro.name === 'all' })
    this.setState({
      mainProducts: newProduct[0]
    })
  }

  setNum = (value) => {
    this.setState({
      num: value
    })
  }

  async getModal(val) {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      uri: 'http://localhost:4000'
    })

    await client.query({
      query: gql`
      {
        product(id: "${val}") {
            id
            name
            inStock
            gallery
            description
            category
            attributes {
              id
              name
              type
              items {
                displayValue
                value
                id
              }
            }
            prices{
              amount
              currency{
                symbol
              }
            }
            brand
          }
      }
      `
    })
      .then(res => {
        this.setState({
          single: res.data.product,
        })
      })
      .catch(err => console.log(err))
  }

  showModal() {
    let modal = document.getElementById("myModal")
    if (Object.keys(this.state.single).length > 0) {
      modal.style.display = "block"
    }
  }

  closeModal = () => {
    let modal = document.getElementById("myModal")
    modal.style.display = "none"
    this.setState({
      index: 0
    })
    let success = document.getElementById("success")
    success.innerHTML = ""
  }

  componentDidUpdate() {
    window.onclick = function (e) {
      let modal = document.getElementById("myModal")
      if (e.target === modal) {
        modal.style.display = "none"
        let success = document.getElementById("success")
        success.innerHTML = ""
      }
    }
  }

  changeIndex = (val) => {
    let i = this.state.single.gallery.indexOf(val)
    this.setState({
      index: i
    })
  }

  changeColor = (val, color) => {
    let items = document.getElementsByClassName("item")
    if (val.target.style.background === "black") {
      val.target.style.background = "white"
      this.setState({
        option: ""
      })
    } else {
      if (color.includes('#')) {
        if (val.target.innerHTML === "✔") {
          val.target.innerHTML = ""
        } else {
          for (let i = 0; i < items.length; i++) {
            items[i].innerHTML = ""
          }
          this.setState({
            option: color
          })
          val.target.innerHTML = "✔"
        }
      } else {
        for (let i = 0; i < items.length; i++) {
          items[i].setAttribute('style', 'background: white')
        }
        this.setState({
          option: color
        })
        val.target.style.background = "black"
      }
    }
  }

  addToCart() {
    let success = document.getElementById("success")
    if (this.state.single.attributes.length > 0) {
      if (this.state.option.length > 0) {
        this.setState({
          choice: [this.state.option],
          totalPrice: [this.state.single.prices[this.state.num]],
          single: { ...this.state.single, qty: 1 },
          option: ""
        }, () => {
          this.props.addCart(this.state.single, this.state.choice, this.state.totalPrice);
        })
        success.innerHTML = "Item Added To Cart"
      } else {
        success.innerHTML = "Please Select One Of The Option"
      }
    } else {
      this.setState({
        choice: [this.state.option],
        totalPrice: [this.state.single.prices[this.state.num]],
        single: { ...this.state.single, qty: 1 },
        option: ""
      }, () => {
        this.props.addCart(this.state.single, this.state.choice, this.state.totalPrice);
      })
      success.innerHTML = "Item Added To Cart"
    }
  }


  render() {
    return (
      <div id='body'>
        <Header reduceQty={this.props.removeQty} addQty={this.props.addToQty} deleteFromCart={this.props.deleteCart} num={this.state.num} totalPrice={this.props.cart.totalPrice} choice={this.props.cart.choice} cart={this.props.cart.cart} amount={this.state.amount} setTech={this.setTech} setCloth={this.setCloth} setAll={this.setAll} setNum={this.setNum} />
        <h2 className='name'>{this.state.mainProducts.name} </h2>
        <div id='card' className='card'>
          {
            this.state.mainProducts.products.map((product) => {
              return (
                <div className='secondCard' key={product.id}>
                  <button id="myBtn" onMouseOver={() => this.getModal(product.id)} onClick={() => this.showModal()}>
                    <img className='img' width={300} height={300} src={`${product.gallery[0]}`} loading="lazy" alt="shopImage" />
                    <h1>{product.inStock ? " " : "Out Of Stock"}</h1>
                    <div className='content'>
                      <h5>{product.name}</h5>
                      <h5>{product.prices[this.state.num].currency.symbol} {product.prices[this.state.num].amount} {product.prices[this.state.num].currency.label}</h5>
                    </div>
                    <hr />
                  </button>
                </div>
              )
            })
          }
        </div>
        {/* Product Modal */}
        {
          Object.keys(this.state.single).length > 1 && (<div>
            <div id="myModal" className="modal">
              <div className="modal-content">
                <span onClick={() => this.closeModal()} className="close">&times;</span>
                {
                  this.state.single.gallery.map((gall) => {
                    return (
                      <img className='smallImg' key={gall} width={100} height={100} src={`${gall}`} alt="mainImage" onClick={() => this.changeIndex(gall)} />
                    )
                  })
                }
                <hr />
                <div className='mainModal'>
                  <img style={{ marginRight: "1rem" }} width={300} height={300} src={`${this.state.single.gallery[this.state.index]}`} alt="mainImage" />
                  <div className='secondModal'>
                    <h2>{this.state.single.brand}</h2>
                    <h5>{this.state.single.name}</h5>
                    <hr />
                    <h6>{this.state.single.attributes[0] !== undefined ? this.state.single.attributes[0].name.toUpperCase() + ":" : ""}</h6>
                    <ul className='mainItem'>
                      {this.state.single.attributes[0] && this.state.single.attributes[0].items.map((item) => {
                        return (
                          <div key={item.id}>
                            <li value={`${item.id}`} style={{ background: item.value.includes('#') ? item.value : '' }} onClick={(e) => {
                              this.changeColor(e, item.value)
                            }} id='item' className='item'>{item.value.includes('#') ? '' : item.value}</li>
                          </div>
                        )
                      })}
                    </ul>
                    <h5>PRICE:</h5>
                    <h5 style={{ marginTop: "-1rem" }}>{this.state.single.prices[this.state.num].currency.symbol} {this.state.single.prices[this.state.num].amount}</h5>
                    <div style={{ color: "green" }} id="success"></div>
                    <button disabled={this.state.single.inStock ? false : true} onClick={() => this.addToCart(this.state.single.name)} className='addBtn'>{this.state.single.inStock ? "ADD TO CART" : "OUT OF STOCK"}</button>
                    <h5 dangerouslySetInnerHTML={{ __html: this.state.single.description }}></h5>
                  </div>
                </div>
              </div>
            </div>
          </div>)
        }
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
    addCart: (single, choice, totalPrice) => dispatch(addToCart(single, choice, totalPrice)),
    deleteCart: (index, name, amount, choice) => dispatch(deleteFromCart(index, name, amount, choice)),
    addToQty: (id) => dispatch(addQty(id)),
    removeQty: (id) => dispatch(reduceQty(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)