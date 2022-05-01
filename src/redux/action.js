export const addToCart = (single, choice, totalPrice) => {
    return {
        type: '[Cart List] Add',
        payload: {
            single,
            choice,
            totalPrice
        }
    }
}
export const deleteFromCart = (index, name, amount, choice) => {
    return {
        type: '[Cart List] Delete',
        payload: {
            index,
            name,
            amount,
            choice
        }
    }
}

export const addQty = (id) => {
    return {
        type: '[Cart List] Increase',
        payload: {
            id,
        }
    }
}

export const reduceQty = (id) => {
    return {
        type: '[Cart List] Decrease',
        payload: {
            id,
        }
    }
}