/* --------------------------------------
  APP STATE (Model...?)
---------------------------------------*/
const initialState = {
  shirtTitle: 'Super Cool Shirt',
  listPrice: 45.00, // DO NOT MODIFY
  price: 45.00,
  quantity: 0,
  outOfStock: true
}

// Actions (objects, bc eventually, there'd probably be an id passed along with the action to represent which shirt in the state was being acted upon)
const outOfStockAction = {
  type: 'MARK_OUT_OF_STOCK'
}
const inStockAction = {
  type: 'MARK_IN_STOCK'
}
const decrementStockAction = {
  type: 'DECREMENT_STOCK'
}
const incrementStockAction = {
  type: 'INCREMENT_STOCK'
}
const putOnSaleAction = {
  type: 'PUT_ON_SALE'
}
const removeFromSaleAction = {
  type: 'REMOVE_FROM_SALE'
}

// Reducer
function rootReducer(state = initialState, action) {
  switch(action.type) {
    case 'MARK_OUT_OF_STOCK':
      return {...state, outOfStock: true};
    case 'MARK_IN_STOCK':
      return {...state, outOfStock: false};
    case 'DECREMENT_STOCK':
      return {...state, quantity: state.quantity - 1};
    case 'INCREMENT_STOCK':
      return {...state, quantity: state.quantity + 1};
    case 'PUT_ON_SALE':
      return {...state, onSale: true, price: parseFloat(state.listPrice * .8).toFixed(2)};
    case 'REMOVE_FROM_SALE':
      return {...state, onSale: false, price: parseFloat(state.listPrice).toFixed(2)};
    default: // ALWAYS RETURN STATE UNCHANGED IF NO ACTION TYPE MATCHES
      return state;
  }
}

// Store
const store = Redux.createStore(rootReducer);

/* -------------------------------------------------
  DOM SELECTIONS (View...?)
-------------------------------------------------- */
const priceIndicator = document.getElementById('price_indicator');
const quantityIndicator = document.getElementById('quantity');
const incrementBtn = document.getElementById('increment_button');
const decrementBtn = document.getElementById('decrement_button');
const outOfStockIndicator = document.getElementById('out_of_stock_indicator');
const onSaleIndicator = document.getElementById('on_sale_indicator');


window.onload = () => {
  /* -------------------------------------------------
  REFLECT INITIAL STATE IN VIEW (View...?)
  -------------------------------------------------- */

  // INITIAL VIEW (Not hard coded, bc eventually the store could be hydrated by data from a db)
  priceIndicator.innerText = store.getState().price;
  quantityIndicator.innerText = store.getState().quantity;
  outOfStockIndicator.innerText = store.getState().outOfStock
    ? 'This item is out of stock. Sad days.'
    : '';
  onSaleIndicator.innerText = store.getState().onSale
    ? 'This item is 20% off!'
    : '';
  
  /* -------------------------------------------------
  LISTEN FOR INPUT (Controller...?)
  -------------------------------------------------- */

  decrementBtn.addEventListener('click', () => {
    let qty = store.getState().quantity;
    if (qty > 0) {
      store.dispatch(decrementStockAction);
      qty = store.getState().quantity; // update qty with new value after dispatch
    }
    
    const isOutOfStock = store.getState().outOfStock;
    const isOnSale = store.getState().onSale;

    // Check if out of stock
    if (qty <= 0) {
      store.dispatch(outOfStockAction);
    }

    console.log('qty: ', qty);
    // Check if on sale
    if (qty < 15) {
      store.dispatch(removeFromSaleAction);
    }
  });
  
  incrementBtn.addEventListener('click', () => {
    store.dispatch(incrementStockAction);

    const qty = store.getState().quantity;
    const isOutOfStock = store.getState().outOfStock;
    const isOnSale = store.getState().onSale;

    // Check if out of stock
    if (qty > 0 && isOutOfStock) {
      store.dispatch(inStockAction);
    }
    console.log('qty: ', qty);
    // Check if on sale
    if (qty >= 15) {
      store.dispatch(putOnSaleAction);
    }
  });

  /* -------------------------------------------------
  UPDATE THE VIEW ACCORDING TO NEW STATE  (View...?)  
  -------------------------------------------------- */
  const storeSubscription = store.subscribe(() => {
    const state = store.getState();
    console.log(state);

    // UPDATE THE PRICE
    priceIndicator.innerText = state.price;

    // UPDATE THE QUANTITY
    quantityIndicator.innerText = state.quantity;

    // UPDATE THE OUT OF STOCK INDICATOR
    if (state.outOfStock) {
      outOfStockIndicator.innerText = 'Out of stock, sorry.';
    } else {
      outOfStockIndicator.innerText = '';
    }

    // UPDATE THE ON SALE INDICATOR
    if (state.onSale) {
      onSaleIndicator.innerText = 'This item is 20% off!';
    } else {
      onSaleIndicator.innerText = '';
    }
  });

}



