var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },
});

const cartIcon = document.querySelector('.cart-icon')
const cartTab = document.querySelector('.cart-tab')
const closeBtn = document.querySelector('.close-btn')
const cardList = document.querySelector('.card-list')
const cartTotal = document.querySelector('.cart-total')
const cartValue = document.querySelector('.cart-value')
const cartList = document.querySelector('.cart-list')
const hamburger = document.querySelector('.hamburger')
const mobileMenu = document.querySelector('.mobile-menu')
const bars = document.querySelector('.fa-bars')

let productData = []
let cartProduct = []

cartIcon.addEventListener("click", () => {
    cartTab.classList.add('cart-tab-active')
})
closeBtn.addEventListener('click', () => {
    cartTab.classList.remove('cart-tab-active')
})
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu-active')
    bars.classList.toggle("fa-xmark")
})


const updateTotals = () => {
    let totalPrice = 0;
    let totalQuantity = 0;
    document.querySelectorAll('.item').forEach(item => {
        const price = parseFloat(item.querySelector('.item-total').innerText.replace('$', ''))
        totalPrice += price;

        const itemQuantity = parseInt(item.querySelector('.quantity-value').innerText)
        totalQuantity += itemQuantity

    })

    cartValue.innerText = totalQuantity


    cartTotal.innerText = `$${totalPrice.toFixed(2)}`
}



const AddToCart = (product) => {

    const existingProduct = cartProduct.find(item => item.id === product.id)
    if (existingProduct) {
        alert('Product already in cart')
        return;
    }
    else {
        cartProduct.push(product)
    }
    const item = document.createElement('div')
    item.classList.add('item')
    item.innerHTML = `
                <div class="item-image">
                  <img src="${product.image}" alt="" />
                </div>
                <div class="description">
                  <h4>${product.name}</h4>
                  <h4 class="item-total">${product.price}</h4>
                </div>

                <div class="flex">
                  <a href="#" class="quantity-btn minus">
                    <i class="fa-solid fa-minus"></i>
                  </a>
                  <h4 class="quantity-value">1</h4>
                  <a href="#" class="quantity-btn plus">
                    <i class="fa-solid fa-plus"></i>
                  </a>
                </div>
    `

    cartList.appendChild(item);
    updateTotals()

    const quantityValue = item.querySelector('.quantity-value')
    const itemTotal = item.querySelector('.item-total')
    const plusBtn = item.querySelector(".plus")
    let quantity = quantityValue.innerText

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault()
        quantity++
        quantityValue.textContent = quantity
        let amount = calculateAmount(quantity, product.price.replace('$', ''))
        itemTotal.innerText = `$${amount}`
        updateTotals();

    })


    const minusBtn = item.querySelector('.minus')
    minusBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (quantity > 1) {
            quantity--;
            quantityValue.innerText = quantity
            let amount = calculateAmount(quantity, product.price.replace('$', ''))
            itemTotal.innerText = `$${amount}`
            updateTotals()
        }
        else {
            item.remove()
            cartProduct = cartProduct.filter(item => item.id != product.id)
            updateTotals()
        }

    })

}

const calculateAmount = (qty, price, item) => {

    let amount = qty * price;
    return amount.toFixed(2)
}


const showCards = () => {
    productData.forEach(product => {

        const orderCard = document.createElement('div')
        orderCard.classList.add('order-card')
        orderCard.innerHTML = `
                    <div class="card-image">
                        <img src="${product.image}" alt="" />
                    </div>
                    <h4>${product.name}</h4>
                    <h4 class="price">${product.price}</h4>
                    <a href="#" class="btn card-btn">Add to cart</a>
        `;
        cardList.appendChild(orderCard)

        const cardBtn = orderCard.querySelector('.card-btn')
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AddToCart(product)
        })

    })
}



async function fetchData() {
    try {

        const res = await fetch("./products.json")
        productData = await res.json()
        showCards()
    }
    catch (e) {
        console.error("Error: ", e)
    }
}

fetchData()
