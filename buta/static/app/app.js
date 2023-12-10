document.addEventListener('DOMContentLoaded', function () {
    var menuItems = [];
    // document.getElementById('cartSidebar').classList.remove('width-full');
    menuItems = Array.from(document.querySelectorAll('.menu-item')).map(function (menuItem) {
        return {
            id: menuItem.getAttribute('data-menu-item-id'),
            name: menuItem.querySelector('.menu-item-title a').textContent,
            price: parseFloat(menuItem.querySelector('.menu-price').textContent),
            subcategory: menuItem.getAttribute('data-subcategory'),
        };
    });

    // Initialize subcategories based on the first category
    var initialCategoryButton = document.querySelector('.menuPage-category button');
    var initialCategory = initialCategoryButton.getAttribute('data-category');
    showSubcategories(initialCategory);

    // Event listener for category buttons
    document.querySelectorAll('.category-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            var categoryName = button.getAttribute('data-category');
            showSubcategories(categoryName);

            var menuItems = document.querySelector('.menu-items');
            // Check if the selected category has ID 2
            if (categoryName === '2') {
                // Show the block with class "business-lunch"
                document.querySelector('.business-lunch').style.display = 'block';

                menuItems.style.display = 'none';
            } else {
                // Hide the block with class "business-lunch" for other categories
                document.querySelector('.business-lunch').style.display = 'none';
                menuItems.style.display = 'flex';
            }
        });
    });

    function updateCartItemQuantity(itemId, quantity) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        cart[itemId] = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function addToCart(itemId, quantity) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        cart[itemId] = (cart[itemId] || 0) + quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Added to cart:', { itemId, quantity, cart });
        return cart;
    }

    function removeFromCart(itemId) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        delete cart[itemId];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        var totalCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);
        var cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalCount.toString();
        }
    }

    document.querySelectorAll('.subcategory-item').forEach(function (subcategory) {
        subcategory.addEventListener('click', function () {
            var clickedSubcategory = subcategory.getAttribute('data-subcategory');

            // Hide all menu items
            document.querySelectorAll('.menu-item').forEach(function (menuItem) {
                menuItem.style.display = 'none';
            });

            // Show only the menu items that belong to the clicked subcategory
            document.querySelectorAll('.menu-item').forEach(function (menuItem) {
                var menuItemSubcategory = menuItem.getAttribute('data-category');
                if (menuItemSubcategory === clickedSubcategory) {
                    menuItem.style.display = 'block';
                }
            });

            // Show subcategories based on the clicked category or subcategory
            showSubcategories(clickedSubcategory);
        });
    });

    function showSubcategories(category) {
        // Show only the subcategories that belong to the selected category
        document.querySelectorAll('.subcategory-item').forEach(function (subcategory) {
            var subcategoryCategory = subcategory.getAttribute('data-category');
            if (subcategoryCategory === category) {
                subcategory.style.display = 'flex';
            } else {
                subcategory.style.display = 'none';
            }
        });
    }


    document.querySelectorAll('.incrementBtn, .decrementBtn').forEach(function (button) {
        button.addEventListener('click', function () {
            var menuItemId = button.getAttribute('data-menu-item-id');
            var countElement = document.getElementById('count_' + menuItemId);
            if (!countElement) {
                console.error('Count element not found.');
                return;
            }
            var currentCount = parseInt(countElement.textContent) || 0;

            if (button.classList.contains('incrementBtn')) {
                currentCount += 1;
            } else {
                if (currentCount > 1) {
                    currentCount -= 1;
                }
            }

            countElement.textContent = currentCount;
            updateCartItemQuantity(menuItemId, currentCount);
            updateCartDisplay();
        });
    });

    document.querySelectorAll('.addToCartBtn').forEach(function (button) {
        button.addEventListener('click', function () {
            var menuItemId = button.getAttribute('data-menu-item');
            var countElement = document.getElementById('count_' + menuItemId);
            if (!countElement) {
                console.error('Count element not found.');
                return;
            }
            var itemCount = parseInt(countElement.textContent) || 1;
            addToCart(menuItemId, itemCount);
            updateCartDisplay();
            updateCartItemQuantity(menuItemId, itemCount);
        });
    });

    document.querySelector('.shopping-cart').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-cart-item-btn')) {
            var itemId = event.target.getAttribute('data-cart-item-id');
            removeFromCart(itemId);
            updateCartDisplay();
        }
    });

    document.querySelector('.cart-items-list').addEventListener('click', function (event) {
        var target = event.target;

        // Check if the clicked element is an increment or decrement button
        if (target.classList.contains('cart-increment-btn') || target.classList.contains('cart-decrement-btn')) {
            // Find the closest parent with the class 'quantity-container'
            var quantityContainer = target.closest('.quantity-container');
            if (!quantityContainer) {
                console.error('Quantity container not found.');
                return;
            }

            var itemId = target.getAttribute('data-cart-item-id');
            var countElement = document.getElementById('cartCount_' + itemId);

            if (!countElement) {
                console.error('Count element not found.');
                return;
            }

            var currentCount = parseInt(countElement.textContent) || 0;

            if (target.classList.contains('cart-increment-btn')) {
                currentCount += 1;
            } else {
                if (currentCount > 1) {
                    currentCount -= 1;
                }
            }

            countElement.textContent = currentCount;
            updateCartItemQuantity(itemId, currentCount);
            updateCartDisplay();
        }
    });

    document.getElementById('send-to-telegram-btn').addEventListener('click', function () {
        document.getElementById('contactForm').style.display = 'block';
    });

    document.getElementById('closeReviewForm').addEventListener('click', function () {
        document.getElementById('contactForm').style.display = 'none';
    });

    document.getElementById('confirmContactBtn').addEventListener('click', function () {
        document.getElementById('contactForm').style.display = 'none';

        var contactName = document.getElementById('contactName').value;
        var contactSurname = document.getElementById('contactSurname').value;
        var contactNumber = document.getElementById('contactNumber').value;
        var contactAddress = document.getElementById('contactAddress').value;

        var contactDetails = {
            name: contactName,
            surname: contactSurname,
            number: contactNumber,
            address: contactAddress,
        };

        var csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            var cart = JSON.parse(localStorage.getItem('cart')) || {};
            console.log('Cart contents:', cart);

            // Send both contact details and cart data to the server
            fetch('/send-to-telegram/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({
                    contact: contactDetails,
                    cart: Object.keys(cart).map(itemId => ({ id: itemId, quantity: cart[itemId] })),
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('Order sent to Telegram successfully!');
                    } else {
                        alert('Failed to send order to Telegram.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while sending the order to Telegram.');
                });

            // Clear the cart
            localStorage.setItem('cart', JSON.stringify({}));
            updateCartDisplay();
        } else {
            console.error('CSRF token not found.');
        }
    });

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    function updateCartDisplay() {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        var cartItemsList = document.getElementById('cart-items');
        var totalPriceElement = document.getElementById('total-price');
        var totalPrice = 0;
        cartItemsList.innerHTML = '';
        for (var itemId in cart) {
            var menuItem = document.querySelector('.menu-item[data-menu-item-id="' + itemId + '"]');
            if (menuItem) {
                var itemName = menuItem.querySelector('.menu-item-title a').textContent;
                var itemPrice = parseFloat(menuItem.querySelector('.menu-price').textContent);
                var itemTotalPrice = itemPrice * cart[itemId];
                var itemQuantity = cart[itemId];
                var cartItemElement = document.createElement('li');
                cartItemElement.classList.add('cart-item');
                var productDetails = document.createElement('div');
                productDetails.classList.add('product-details');
                var productImage = document.createElement('img');
                productImage.src = menuItem.querySelector('.menu-img img').src;
                productImage.alt = itemName;
                productDetails.appendChild(productImage);
                var productInfo = document.createElement('div');
                productInfo.classList.add('product-info');
                var productName = document.createElement('div');
                productName.classList.add('product-name');
                productName.textContent = itemName;
                var quantityContainer = document.createElement('div');
                quantityContainer.classList.add('quantity-container');
                var decrementButton = document.createElement('button');
                decrementButton.textContent = '-';
                decrementButton.classList.add('cart-decrement-btn');
                decrementButton.setAttribute('data-cart-item-id', itemId);
                var countElement = document.createElement('p');
                countElement.textContent = itemQuantity;
                countElement.classList.add('count');
                countElement.id = 'cartCount_' + itemId;
                var incrementButton = document.createElement('button');
                incrementButton.textContent = '+';
                incrementButton.classList.add('cart-increment-btn');
                incrementButton.setAttribute('data-cart-item-id', itemId);
                var itemPriceElement = document.createElement('div');
                itemPriceElement.classList.add('item-price');
                itemPriceElement.textContent = 'Price: ' + itemTotalPrice + ' ₼';
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'x';
                deleteButton.classList.add('delete-cart-item-btn');
                deleteButton.setAttribute('data-cart-item-id', itemId);
                quantityContainer.appendChild(decrementButton);
                quantityContainer.appendChild(countElement);
                quantityContainer.appendChild(incrementButton);
                productInfo.appendChild(productName);
                productInfo.appendChild(quantityContainer);
                productInfo.appendChild(itemPriceElement);
                cartItemElement.appendChild(productDetails);
                cartItemElement.appendChild(productInfo);
                cartItemElement.appendChild(deleteButton);
                cartItemsList.appendChild(cartItemElement);
                totalPrice += itemTotalPrice;
            } else {
                console.error('Menu item not found for ID: ' + itemId);
            }
        }
        totalPriceElement.textContent = 'Total Price: ' + totalPrice + ' ₼';
    }

    // document.getElementById('showCartBtn').addEventListener('click', function () {
    //     document.getElementById('cartSidebar').style.width = '70%';
    // });

    // document.getElementById('closeCartBtn').addEventListener('click', function () {
    //     document.getElementById('cartSidebar').style.width = '0';
    // });

    document.getElementById('showCartBtn').addEventListener('click', function () {
        document.getElementById('cartSidebar').classList.add('width-full');
    });

    document.getElementById('closeCartBtn').addEventListener('click', function () {
        document.getElementById('cartSidebar').classList.remove('width-full');
    });


    updateCartDisplay();
});

const sidebar = document.getElementById("sidebar");

sidebar.onclick = function () {
    active.classList.toggle("active");
};

document.addEventListener('DOMContentLoaded', function () {
    new Splide('#splide', {
        type: 'loop',
        perPage: 3,
        focus: 'center',
        autoplay: true,
        interval: 8000,
        flickMaxPages: 3,
        updateOnMove: true,
        pagination: false,
        padding: '10%',
        throttle: 300,
        breakpoints: {
            1440: {
                perPage: 1,
                padding: '30%'
            }
        }
    }).mount();
    new Splide('#userReviewsSlider', {
        type: 'loop',
        perPage: 1,
        focus: 'center',
        autoplay: true,
        interval: 3000,
        flickMaxPages: 3,
        updateOnMove: true,
        pagination: false,
        padding: '10%',
        throttle: 300,
        breakpoints: {
            1100: {
                perPage: 1,
                padding: { left: '25%', right: '25%' } // Adjust the padding values as needed
            },
            800: {
                perPage: 1,
                padding: { left: '2%', right: '2%' }, // Adjust the padding values as needed
                arrows: false // You can customize other options for smaller screens
            }
        },
        arrows: true
    }).mount();
    new Splide('#menuSlide1', {
        perPage: 1,
        pagination: false,
        focus: 0,
        fixedWidth: 150,
        isNavigation: false,
        gap: 10,
    }).mount();
    new Splide('#menuSlide2', {
        perPage: 1,
        pagination: false,
        focus: 0,
        fixedWidth: 150,
        isNavigation: false,
        gap: 10,
    }).mount();
    new Splide('#menuSlide3', {
        perPage: 1,
        pagination: false,
        focus: 0,
        fixedWidth: 150,
        isNavigation: false,
        gap: 10,
    }).mount();
    new Splide('#menuSlide4', {
        perPage: 1,
        pagination: false,
        focus: 0,
        fixedWidth: 150,
        isNavigation: false,
        gap: 10,
    }).mount();
});

function showSlider(sliderIndex) {
    var sliders = document.querySelectorAll('.splide');
    sliders.forEach(function (slider) {
        slider.classList.remove('active');
    });
    var selectedSlider = document.getElementById('menuSlide' + sliderIndex);
    selectedSlider.classList.add('active');
    var indicator = document.getElementById('sliderIndicator');
    indicator.style.width = (25 * (sliderIndex - 1)) + '%';
}

const decrementBtn = document.getElementById('decrementBtn');
const incrementBtn = document.getElementById('incrementBtn');
const countElement = document.getElementById('count');
let count = 1;

const updateCount = () => {
    countElement.textContent = count;
};

if (decrementBtn) {
    decrementBtn.addEventListener('click', () => {
        if (count > 0) {
            count--;
            updateCount();
        }
    });
}

if (incrementBtn) {
    incrementBtn.addEventListener('click', () => {
        count++;
        updateCount();
    });
}

document.querySelectorAll('.category-button').forEach(function (button) {
    button.addEventListener('click', function () {
        var categoryName = button.getAttribute('data-category');
        document.querySelectorAll('.menuPage-subcategory-list').forEach(function (subcategoryList) {
            subcategoryList.style.display = 'none';
        });
        document.getElementById(categoryName + '-subcategory-list').style.display = 'block';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    function toggleDisplay(elementSelector) {
        var elements = document.querySelectorAll(elementSelector);
        elements.forEach(function (element) {
            element.classList.toggle('display-block');
        });
    }

    document.getElementById('openReviewForm').addEventListener('click', function () {
        toggleDisplay('.review-form-box-content');
    });

    document.getElementById('closeReviewForm').addEventListener('click', function () {
        toggleDisplay('.review-form-box-content');
    });
});

function showLunchBox(dayNumber) {
    // Hide all lunch boxes
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`lunch-box-${i}`).style.display = 'none';
    }

    // Show the selected lunch box
    document.getElementById(`lunch-box-${dayNumber}`).style.display = 'block';
}
