// Context: At BounceX we often execute complex problems using entirely front-end JavaScript.
// For this challenge your solution should work if it is pasted directly into the JavaScript
// console of the browser after the page has fully loaded. Feel free to use jQuery.
// Also, our BounceX products must work across all browsers, but we will be testing your challenge in Chrome.  

// Go to www.marmot.com and add at least 2 products to your cart. Then return to the home page. 

// Write a JavaScript snippet that can be run in the console of the browser that does the following: 

// Extracts the number of items in the cart, the cart total, and the item images from the page. Store them in variables. 

// Create a trigger that activates when the user scrolls into the bottom 10% of the page. 

// The trigger should show a centered overlay on top of the site that displays the information gathered above and two buttons.
// One button should close the overlay and the other should take the user to the cart page. It should have a style consistent
// with the website. Design matters. 

// Behind the overlay add a semi­transparent black background that obscures the site. The overlay should be able to trigger
// multiple times if dismissed.

// BONUS 

// 1. Explain potential problems that could arise if this snippet had more or less than the 2 items in the cart.
// How would you address those problems? 

// One major problem that arose from having more than two items in the cart was trying to append too many images to the overlay at one time.
// I went ahead and resolved this issue by adding some arrows so the user can flip through the item images one pair at a time.

// In the case of having no items in the cart, there would obviously be no images to display. I resolved this issue by replacing the images with
// a message notifying the user that they don't have any items in their cart, and removing the checkout button from the DOM.

// I included jquery by pasting the contents of the min file: https://code.jquery.com/jquery-3.4.1.min.js

const cart = $('.minicart-link')
const pathToCart = cart[0].href
const windowWidth = $(window).width()
const images = []
let total = '$0.00'
let quantity = $('.minicart-quantity').html()[0]

$.get(pathToCart, null, text => {
  total = $(text).find('td.order-value').html() ? $(text).find('td.order-value').html() : '$0.00'
  let itemImage = $(text).find('td.item-image')
  let links = itemImage.children('a')
  let imageNodeList = links.children('img')
  $.each(imageNodeList, (idx, img) => images.indexOf(img.src) === -1 ? images.push(img.src) : null)
})

const cartOverlay = document.createElement('div')
const imagesContainer = document.createElement('div')
const detailsContainer = document.createElement('div')
const optionsContainer = document.createElement('div')

imagesContainer.style.display = windowWidth > 1200 ? 'inline-flex' : 'none'
imagesContainer.style.paddingTop = '0'
imagesContainer.style.fontSize = '20px'

detailsContainer.className += 'cart-order-totals'

const styleCartOverlay = overlay => {
  const {style} = overlay
  style.position = 'fixed'
  style.top = 0
  style.display = 'flex'
  style.alignItems = 'center'
  style.justifyContent = 'center'
  style.backgroundColor = 'rgba(0,0,0, 0.7)'
  style.cursor = 'pointer'
  style.height = '200px'
  style.width = '100%'
  style.zIndex = '3'
  style.padding = '2% 15% 2% 15%'
}

const styleContainer = container => {
  const {style} = container
  style.height = '300px'
  style.width = '320px'
  style.color = 'white'
  style.padding = '20px'
  style.alignItems = 'center'
  style.justifyContent = 'center'
}

const styleImage = img => {
  const {style} = img
  style.display = 'inline-flex'
  style.height = '41%'
  style.width = 'auto'
  style.margin = '0 2% 0 2%'
}

styleCartOverlay(cartOverlay)
styleContainer(imagesContainer)
styleContainer(detailsContainer)
styleContainer(optionsContainer)

const appendImages = () => {
  if(quantity == 0) {
    const emptyCartMessage = document.createElement('h4')
    emptyCartMessage.innerHTML = 'No items in your cart'
    imagesContainer.appendChild(emptyCartMessage)
  }
  
  const leftArrowContainer = document.createElement('div')
  const rightArrowContainer = document.createElement('div')
  const leftArrow = document.createElement('button')
  const rightArrow = document.createElement('button')

  leftArrowContainer.style.width = '25px'
  leftArrowContainer.style.height = '25px'
  rightArrowContainer.style.width = '25px'
  rightArrowContainer.style.height = '25px'

  leftArrow.innerHTML = '<img src="http://pixsector.com/cache/852dce6a/avb91899cb3246210ca63.png" />'
  rightArrow.innerHTML = '<img src="http://pixsector.com/cache/ef1ee4a1/av85f1b171d762037fe92.png" />'
  leftArrow.style.height = '25px'
  rightArrow.style.height = '25px'
  leftArrow.style.width = '25px'
  rightArrow.style.width = '25px'
  leftArrow.style.filter = 'invert(1)'
  rightArrow.style.filter = 'invert(1)'
  leftArrow.style.display = 'none'
  rightArrow.style.display = images.length > 2 ? 'block' : 'none'

  const image1 = document.createElement('img')
  const image2 = document.createElement('img')
  let idx = 0

  image1.src = images[idx]
  image2.src = images[idx + 1]

  leftArrow.onclick = () => {
    if(idx === 1) {
      leftArrow.style.display = 'none'
    } else {
      leftArrow.style.display = 'block'
    }
    if(images.length > idx + 1) rightArrow.style.display = 'inline-flex'
    if(idx > 0) idx -= 1
    image1.src = images[idx]
    image2.src = images[idx + 1]
  }

  rightArrow.onclick = () => {
    if(idx + 1 === images.length - 2) {
      rightArrow.style.display = 'none'   
      if(images.length > 2) leftArrow.style.display = 'inline-flex'
    } else {
      rightArrow.style.display = 'block'
    }
    idx += (idx + 1 < images.length - 1) ? 1 : 0
    image1.src = images[idx]
    image2.src = images[idx + 1]
  }

  leftArrowContainer.appendChild(leftArrow)
  rightArrowContainer.appendChild(rightArrow)
  imagesContainer.appendChild(leftArrowContainer)
  
  if(images.length > 0) imagesContainer.appendChild(image1)
  if(images.length > 1) imagesContainer.appendChild(image2)
  imagesContainer.appendChild(rightArrowContainer)

  styleImage(image1)
  styleImage(image2)
}

const appendOrderDetails = () => {
  const detailsTable = document.createElement('table')
  const detailsTableBody = document.createElement('tbody')
  const quantityRow = document.createElement('tr')
  const subtotalRow = document.createElement('tr')
  const taxRow = document.createElement('tr')
  const shippingRow = document.createElement('tr')
  const totalRow = document.createElement('tr')
  const quantityHeader = document.createElement('th')
  const subtotalHeader = document.createElement('th')
  const taxHeader = document.createElement('th')
  const shippingHeader = document.createElement('th')
  const totalHeader = document.createElement('th')
  const orderQuantity = document.createElement('td')
  const orderSubtotal = document.createElement('td')
  const orderTax = document.createElement('td')
  const orderShipping = document.createElement('td')
  const orderTotal = document.createElement('td')

  quantityHeader.innerHTML = `Quantity`
  subtotalHeader.innerHTML = `Subtotal`
  taxHeader.innerHTML = `Sales Tax`
  shippingHeader.innerHTML = 'Estimated shipping'
  totalHeader.innerHTML = `Estimated Total`
  orderQuantity.innerHTML = quantity
  orderSubtotal.innerHTML = total
  orderTax.innerHTML = '-'
  orderShipping.innerHTML = '-'
  orderTotal.innerHTML = total

  quantityRow.appendChild(quantityHeader)
  quantityRow.appendChild(orderQuantity)
  subtotalRow.appendChild(subtotalHeader)
  subtotalRow.appendChild(orderSubtotal)
  taxRow.appendChild(taxHeader)
  taxRow.appendChild(orderTax)
  shippingRow.appendChild(shippingHeader)
  shippingRow.appendChild(orderShipping)
  totalRow.appendChild(totalHeader)
  totalRow.appendChild(orderTotal)
  detailsTableBody.appendChild(quantityRow)
  detailsTableBody.appendChild(subtotalRow)
  detailsTableBody.appendChild(taxRow)
  detailsTableBody.appendChild(shippingRow)
  detailsTableBody.appendChild(totalRow)
  detailsTable.appendChild(detailsTableBody)
  detailsContainer.appendChild(detailsTable)

  const tableHeaders = document.querySelectorAll('th')
  tableHeaders.forEach(th => {
    const {style} = th
    style.paddingRight = '40px'
    style.width = '400px'
    style.whiteSpace = 'nowrap'
  })

  detailsTable.className += 'order-totals-table'
  detailsTable.style.padding = '69px 5px 0 0'
  detailsTable.style.float = 'none'
  detailsTable.style.margin = '0 auto'
  detailsTable.style.width = '100%'
  if(windowWidth < 1200) detailsTable.style.paddingRight = '0'
}

const appendOptions = () => {
  const checkoutButton = document.createElement('a')
  const continueShoppingLink = document.createElement('a')
  const closeOverlayWrapper = document.createElement('div')
  const closeOverlayButton = document.createElement('button')
  const closeOverlayIcon = document.createElementNS('http://www.w3.org/2000/svg', "svg")

  optionsContainer.style.padding = '95px 8% 8% 8%'
  optionsContainer.style.textAlign = 'center'

  checkoutButton.href = pathToCart
  checkoutButton.className += 'primary-button'
  checkoutButton.innerHTML = 'CHECKOUT'
  checkoutButton.style.fontSize = '.9rem'
  checkoutButton.style.backgroundColor = 'white'
  checkoutButton.style.border = 'none'
  $(checkoutButton).mouseenter(function(){
    $(this).css('background-color', 'red').css('color', 'white')
  }).mouseleave(function(){
    $(this).css('background-color', 'white').css('color', 'black')
  })

  continueShoppingLink.href = 'https://www.marmot.com/'
  continueShoppingLink.innerHTML = 'Continue Shopping'
  continueShoppingLink.style.display = 'block'
  continueShoppingLink.style.fontSize = windowWidth > 480 ? '14px' : '18px'
  continueShoppingLink.style.marginTop =  '53px'
  continueShoppingLink.style.textDecoration = 'underline'
  continueShoppingLink.style.whiteSpace = 'nowrap'

  closeOverlayWrapper.className += 'close-zoom-wrapper close-zoom-action'
  closeOverlayWrapper.style.position = 'fixed'
  closeOverlayWrapper.style.top = '20px'
  closeOverlayWrapper.style.right = windowWidth > 1000 ? '15%' : '10px'

  closeOverlayButton.className += 'class="close-zoom-button close-zoom-action'
  closeOverlayButton.onclick = () => cartOverlay.remove()

  closeOverlayIcon.className += 'svg-icon svg-icon-close'
  closeOverlayIcon.style.width = '20px'
  closeOverlayIcon.style.height = '20px'

  const path = document.createElementNS('http://www.w3.org/2000/svg','path')
  path.setAttributeNS(null, "d", 'M1.143 22L10 12.257 18.857 22 20 20.743 11.143 11 20 1.257 18.857 0 10 9.743 1.143 0 0 1.257 8.857 11 0 20.743z')
  path.setAttribute('viewBox', '0 0 20 22')
  path.setAttribute('width', '20')
  path.setAttribute('height', '22')
  path.setAttribute('fill', 'white')

  if(quantity != 0) {
    optionsContainer.appendChild(checkoutButton)
  } else {
    continueShoppingLink.style.fontSize = '18px'
    continueShoppingLink.style.marginTop = '43px'
  }

  optionsContainer.appendChild(continueShoppingLink)

  closeOverlayIcon.appendChild(path)
  closeOverlayButton.appendChild(closeOverlayIcon)
  closeOverlayWrapper.appendChild(closeOverlayButton)
  cartOverlay.appendChild(closeOverlayWrapper)

  const maxWidth1000 = window.matchMedia('(max-width: 1000px)')
  const minWidth1001 = window.matchMedia('(min-width: 1001px)')

  maxWidth1000.addListener(width => {
    if(width.matches) {
      closeOverlayWrapper.style.right = '10px'
    }
  })

  minWidth1001.addListener(width => {
    if(width.matches) {
      closeOverlayWrapper.style.right = '15%'
    }
  })
}

const triggerCartOverlay = () => {
  document.body.appendChild(cartOverlay)
  if(!cartOverlay.contains(imagesContainer)) {
    cartOverlay.appendChild(imagesContainer)
    appendImages()
  }
  if(!cartOverlay.contains(detailsContainer)) {
    cartOverlay.appendChild(detailsContainer)
    appendOrderDetails()
  }
  if(!cartOverlay.contains(optionsContainer)) {
    cartOverlay.appendChild(optionsContainer)
    appendOptions()
  }
}

let lastScrollTop = 0
$(window).scroll(() => {
  const scrollHeight = $(document).height() - $(this).height()
  const scrollTop = $(this).scrollTop()
  if(scrollTop >= scrollHeight - 10 && scrollTop > lastScrollTop && !document.contains(cartOverlay)) {
    triggerCartOverlay()
  }
  lastScrollTop = scrollTop
})

const maxWidth1200 = window.matchMedia('(max-width: 1200px)')
const minWidth1201 = window.matchMedia('(min-width: 1201px)')

maxWidth1200.addListener(width => {
  if(width.matches) {
    imagesContainer.style.display = 'none'
  }
})

minWidth1201.addListener(width => {
  if(width.matches) {
    imagesContainer.style.display = 'inline-flex'
  }  
})
