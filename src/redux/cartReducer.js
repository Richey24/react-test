const initialState = {
    cart: [],
    set: [],
    choice: [],
    totalPrice: [],
    size: {}
}

export default function addReducer(state = initialState, action) {
    if (action.type === '[Cart List] Add') {
        if (!(state.set.includes(action.payload.single.id.length * action.payload.single.name.length))) {
            return {
                ...state,
                cart: [
                    ...state.cart,
                    action.payload.single
                ],
                set: [...state.set, action.payload.single.id.length * action.payload.single.name.length],
                choice: [...state.choice, ...action.payload.choice],
                totalPrice: [...state.totalPrice, ...action.payload.totalPrice]
            }
        }
    }
    if (action.type === '[Cart List] Delete') {
        return {
            ...state,
            cart: state.cart.filter((item) => item.id !== action.payload.index),
            set: state.set.filter((item) => item !== action.payload.index.length * action.payload.name.length),
            totalPrice: state.totalPrice.filter((item) => item.amount !== action.payload.amount),
            choice: state.choice.filter((item) => item !== action.payload.choice)
        }
    }

    if (action.type === '[Cart List] Increase') {
        return {
            ...state,
            cart: state.cart.map((one) => one.id === action.payload.id ? { ...one, qty: one.qty + 1 } : one)
        }
    }
    if (action.type === '[Cart List] Decrease') {
        return {
            ...state,
            cart: state.cart.map((one) => one.id === action.payload.id ? { ...one, qty: one.qty - 1 } : one)
        }
    }
    return state
}
