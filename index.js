import { menuArray } from './data.js';


let orderedItems = {}
let showCartDetails = 0
let hasOrdered = 0

const closePaymentPageEl = document.getElementById('close-payment-page')
closePaymentPageEl.addEventListener('click', function(){
    const mainEl = document.getElementById('main-container')
    mainEl.style.display = 'block'
    const cartSpaceEl = document.getElementById('cart-space')
    cartSpaceEl.style.display = 'block'
    const paymentModalEl = document.getElementById('payment-modal')
    paymentModalEl.style.display = 'none'
})

const closeRatingEl = document.getElementById('close-rating')
closeRatingEl.addEventListener('click', function(){
    location.reload()
})

const formIdEl = document.getElementById('user-form')
formIdEl.addEventListener('submit', function(e){
    e.preventDefault()
    showRatingPage()
})

document.addEventListener('click', function(e){
    const clickedEl = e.target.dataset
    const clickedIdEl = e.target.id
    
    const paymentPageEl = document.getElementById('payment-modal')
    if ((clickedEl.plus || clickedEl.minus) && (paymentPageEl.style.display === 'block')){
        return
    }
    
    if (clickedEl.plus) {
        const qtyEl = document.getElementById(clickedEl.plus)
        qtyEl.textContent++   
        updateOrder(clickedEl.plus, qtyEl.textContent) 
    } else if (clickedEl.minus) {
        const qtyEl = document.getElementById(clickedEl.minus)
        if (qtyEl.textContent > 0)
            qtyEl.textContent--
        updateOrder(clickedEl.minus, qtyEl.textContent)
    } else if (clickedEl.remove) {
        removeOrderedItem(clickedEl.remove)
    } else if (clickedIdEl === 'cart'){
        showCartDetails = 1
        showOrder()
    } else if (clickedIdEl === 'close-cart'){
        showCartDetails = 0
        hideOrder()
    } else if (clickedIdEl === 'btn-complete-payment'){
        showPaymentPage()
    } else if (clickedIdEl.split('-')[0] === 'star'){
        showColouredStars(clickedIdEl.split('-')[1])
    }
    
})

function updateOrder(item, qtyValue){
    orderedItems[item] = qtyValue
    showOrder()
}

function showOrder(){
    
    hasOrdered = 0
    const cartIdEl = document.getElementById('cart-space')    
    const orderDetailsEl = document.getElementById('order-details')
    orderDetailsEl.innerHTML = ''
    
   if (showCartDetails){
        orderDetailsEl.style.display = 'block'
        cartIdEl.style.display = 'none'
    }
    const closeDivEl = document.createElement('div')
    closeDivEl.classList.add('close')
    orderDetailsEl.appendChild(closeDivEl)
    
    const closeCartEl = document.createElement('i')
    closeCartEl.classList.add('fa-regular')
    closeCartEl.classList.add('fa-circle-xmark')
    closeCartEl.setAttribute('id', 'close-cart')
    closeDivEl.appendChild(closeCartEl)
    
    const orderEl = document.createElement('h4')
    orderEl.textContent = 'Your order'
    
    const itemKeys = Object.keys(orderedItems)
    const itemValues = Object.values(orderedItems)
    
    const selectedItemsEl = document.createElement('div')
    selectedItemsEl.classList.add('selected-items')
    let totalPrice = 0
    
    itemKeys.forEach(function(itemKey){
        const itemValue = itemValues.shift()
        
        const selectedItemDivEl = document.createElement('div')
        selectedItemDivEl.classList.add('selected-item')
        selectedItemsEl.appendChild(selectedItemDivEl)       

        const itemNameEl = document.createElement('h4')
        itemNameEl.classList.add('item-name')
        const displayItemNameEl = document.getElementById(`display-${itemKey}`)
        itemNameEl.textContent = displayItemNameEl.textContent
        
        const removeItemEl = document.createElement('span')
        removeItemEl.classList.add('remove-item')
        removeItemEl.textContent = 'remove'
        removeItemEl.setAttribute('data-remove', itemKey)
        itemNameEl.appendChild(removeItemEl)
        
        const itemPriceEl = document.createElement('h4')
        itemPriceEl.classList.add('item-price')
        
        const priceOfEl = document.getElementById(`priceOf-${itemKey}`)
        itemPriceEl.textContent = `$${parseInt(itemValue) * parseInt(priceOfEl.textContent.split('$')[1])}`
        
        if (itemPriceEl.textContent.split('$')[1] > 0){
            selectedItemDivEl.appendChild(itemNameEl)
            selectedItemDivEl.appendChild(itemPriceEl)
        }
        
        
        totalPrice += parseInt(itemPriceEl.textContent.split('$')[1])
    })
    
    if (totalPrice)
        hasOrdered = 1
        
    if (!hasOrdered){
        const noOrderEl = document.createElement('div')
        noOrderEl.classList.add('empty-cart')
        noOrderEl.textContent = 'No order placed!!!'
        orderDetailsEl.appendChild(noOrderEl)
        return
    }
    
    if (totalPrice > 100){
        const selectedItemDivEl = document.createElement('div')
        selectedItemDivEl.classList.add('selected-item')
        selectedItemsEl.appendChild(selectedItemDivEl)       

        const itemNameEl = document.createElement('h4')
        itemNameEl.classList.add('item-name')
        const displayItemNameEl = document.getElementById(`display-dessert`)
        itemNameEl.textContent = displayItemNameEl.textContent
        
        const removeItemEl = document.createElement('span')
        removeItemEl.classList.add('free-item')
        removeItemEl.textContent = 'free on order above $100'
        itemNameEl.appendChild(removeItemEl)
        selectedItemDivEl.appendChild(itemNameEl)
    }
    
    orderDetailsEl.appendChild(orderEl)
    orderDetailsEl.appendChild(selectedItemsEl)

    const totalAmountDivEl = document.createElement('div')
    totalAmountDivEl.classList.add('total-amount')
    orderDetailsEl.appendChild(totalAmountDivEl)
    
    const totalPriceEl = document.createElement('h4')
    totalPriceEl.textContent = 'Total price'
    totalAmountDivEl.appendChild(totalPriceEl)
    
    const totalPriceAmtEl = document.createElement('h4')
    totalPriceAmtEl.classList.add('total-price')
    totalPriceAmtEl.textContent = `$${totalPrice}`
    totalAmountDivEl.appendChild(totalPriceAmtEl)
    
    const completePaymentDivEl = document.createElement('div')
    completePaymentDivEl.classList.add('complete-payment')
    orderDetailsEl.appendChild(completePaymentDivEl)
    
    const btnCompletePaymentEl = document.createElement('button')
    btnCompletePaymentEl.classList.add('btn-complete-payment')
    btnCompletePaymentEl.setAttribute('id', 'btn-complete-payment')
    btnCompletePaymentEl.textContent = 'Complete payment'
    completePaymentDivEl.appendChild(btnCompletePaymentEl)
    

}

function hideOrder(){
    
    const orderDetailsEl = document.getElementById('order-details')
    orderDetailsEl.style.display = 'none'
    
    const cartIdEl = document.getElementById('cart-space')
    cartIdEl.style.display = 'block'    
}

function removeOrderedItem(item) {
    delete orderedItems[item]
    showOrder()
    
    const itemQtyPEl = document.getElementById(item)
    itemQtyPEl.textContent = 0
        
}


function showPaymentPage(){
    
    if (!hasOrdered){
        return
    }
    
    const orderDetailsEl = document.getElementById('order-details')
    orderDetailsEl.style.display = 'none'
    
    const cartIdEl = document.getElementById('cart-space')
    cartIdEl.style.display = 'none'  
    
    const paymentModalId = document.getElementById('payment-modal')
    paymentModalId.style.display = 'block'
    
    const paymentPageEl = document.getElementById('payment-page')
    paymentPageEl.style.display = 'block'
    
}

function showRatingPage(){
        
    const paymentPageEl = document.getElementById('payment-page')
    paymentPageEl.style.display = 'none'
    
    const ratingPageEl = document.getElementById('rating-page')
    ratingPageEl.style.display = 'block'
    
}

function showColouredStars(num){
    for(let i=1; i<=5; i++){
        const starEl = document.getElementById(`star-${i}`)
        starEl.classList.remove('fa-solid')
        starEl.classList.remove('gold')
    }
    for(let i=1; i<=num; i++){
        const starEl = document.getElementById(`star-${i}`)
        starEl.classList.add('fa-solid')
        starEl.classList.add('gold')
    }

    const circleContainerEl = document.getElementById('circle-container')
    circleContainerEl.innerHTML = ''   
    
    const circleEl = document.createElement('div')
    circleEl.classList.add('circle')

    const textEl = document.createElement('span')
    textEl.classList.add('text')
    textEl.textContent = `${num}/5`

    circleEl.appendChild(textEl)
    circleContainerEl.appendChild(circleEl)

}

// display the first page
// items are looped from the imported file

function getMenu(){
    const mainEl = document.getElementById('main-container')
    menuArray.forEach(function(menu){
        const { nameId, ingredients, displayName, price, emoji } = menu
        
        const sectionEl = document.createElement('section')
        sectionEl.classList.add('item-info')
        // 
        const imgDivEl = document.createElement('div')
        imgDivEl.classList.add('item-image')
        
        const imgEl = document.createElement('img')
        imgEl.setAttribute('src', `./images/${nameId}.png`)
        imgEl.setAttribute('alt', nameId)
        
        imgDivEl.appendChild(imgEl)
        sectionEl.appendChild(imgDivEl)
        // 
        const itemDescDivEl = document.createElement('div')
        itemDescDivEl.classList.add('item-desc')
        
        const itemNameH4El = document.createElement('h4')
        itemNameH4El.classList.add('item-name')
        itemNameH4El.setAttribute('id', `display-${nameId}`)
        itemNameH4El.textContent = displayName
        itemDescDivEl.appendChild(itemNameH4El)
        
        const itemIngredientsH5El = document.createElement('h5')
        itemIngredientsH5El.classList.add('item.-ingredients')
        itemIngredientsH5El.textContent = ingredients
        itemDescDivEl.appendChild(itemIngredientsH5El)
        
        const itemPriceH4El = document.createElement('item-price')
        itemPriceH4El.classList.add('item-price')
        itemPriceH4El.textContent = `$${price}`
        itemPriceH4El.setAttribute('id', `priceOf-${nameId}`)
        itemDescDivEl.appendChild(itemPriceH4El)
        
        sectionEl.appendChild(itemDescDivEl)
        // 
        const itemAddDivEl = document.createElement('div')
        itemAddDivEl.classList.add('item-add')
        
        const iSqMinusEl = document.createElement('i')
        iSqMinusEl.classList.add('fa-regular')
        iSqMinusEl.classList.add('fa-square-minus')
        iSqMinusEl.setAttribute('data-minus', nameId)
        itemAddDivEl.appendChild(iSqMinusEl)
        
        const itemQtyPEl = document.createElement('p')
        itemQtyPEl.classList.add('item-qty')
        itemQtyPEl.textContent = 0
        itemQtyPEl.setAttribute('data-qty', nameId)
        itemQtyPEl.setAttribute('id', nameId)
        itemAddDivEl.appendChild(itemQtyPEl)
        
        const iSqPlusEl = document.createElement('i')
        iSqPlusEl.classList.add('fa-regular')
        iSqPlusEl.classList.add('fa-square-plus')
        iSqPlusEl.setAttribute('data-plus', nameId)
        itemAddDivEl.appendChild(iSqPlusEl)
        
        sectionEl.appendChild(itemAddDivEl)
        mainEl.appendChild(sectionEl)
    })   
}

function render(){
    getMenu()
}

render()
