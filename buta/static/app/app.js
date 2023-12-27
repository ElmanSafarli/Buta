function initializeLanguageSwitcher() {
    var storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
        // Set the language in the form
        $('[name="language"]').val(storedLanguage);

        // Update the caption with the selected language
        $('.dropdown > .caption > img').attr('src', $('.dropdown > .list > .item[data-item="' + storedLanguage + '"]').find('img').attr('src'));
        $('.dropdown > .caption > span').text($('.dropdown > .list > .item[data-item="' + storedLanguage + '"]').find('span').text());

        // Redirect immediately
        var currentPath = window.location.pathname;
        var newPath;

        if (currentPath === '/') {
            newPath = '/' + storedLanguage + '/';
        } else {
            newPath = currentPath.replace(/^\/\w+\//, '/' + storedLanguage + '/');
        }

        // Check if the current URL already matches the selected language
        if (currentPath !== newPath) {
            window.location.href = newPath;
        }
    }
}

function sendContactFormData(event) {
    event.preventDefault();  // Prevent the form from submitting in the traditional way

    var form = document.querySelector('.contactPageForm');
    var contactName = document.getElementById('contactPageName').value;
    var contactNumber = document.getElementById('contactPageNumber').value;
    var contactText = document.getElementById('contactPageText').value;

    if (!contactName || !contactNumber || !contactText) {
        // If any of the required fields are empty, show an alert and do not proceed
        alert('Please fill in all required fields.');
        return;
    }


    var contactDetails = {
        name: contactName,
        phone: contactNumber,
        text: contactText,
    };

    console.log(JSON.stringify(contactDetails));

    var csrfToken = getCookie('csrftoken');
    console.log(csrfToken);

    if (csrfToken) {
        fetch('send-contact-form-to-telegram/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(contactDetails),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Your message has been sent! We will get back to you soon.');
                } else {
                    console.log(data.message);
                    alert('Failed to send your message. Please try again or contact us by phone.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again or contact us by phone.');
            });
        // Clear the form fields
        document.getElementById('contactPageName').value = '';
        document.getElementById('contactPageNumber').value = '';
        document.getElementById('contactPageText').value = '';
    } else {
        console.error('CSRF token not found.');
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


$(document).ready(function () {

    // Initial page load
    $('#loader').fadeOut(500);

    // Show the loader before leaving the page
    $(document).on('click', 'a', function (e) {
        $('#loader').fadeIn(500);
    });

    initializeLanguageSwitcher();

    // Attach event listeners when the document is ready
    $('.dropdown > .caption').on('click', function (e) {
        e.stopPropagation(); // Prevent event from reaching document click listener
        $(this).parent().toggleClass('open');
    });

    $('.dropdown > .list > .item').on('click', function (e) {
        e.stopPropagation(); // Prevent event from reaching document click listener
        var selectedLanguage = $(this).data("item");
        var currentPath = window.location.pathname;

        // Update the caption with the selected language
        $('.dropdown > .caption > img').attr('src', $(this).find('img').attr('src'));
        $('.dropdown > .caption > span').text($(this).find('span').text());

        // Log the selected language to the console for debugging
        console.log('Selected language:', selectedLanguage);

        // Update the language selection in the form
        $('[name="language"]').val(selectedLanguage);

        // Save the selected language to local storage
        localStorage.setItem('selectedLanguage', selectedLanguage);

        // Perform the form submission to set the language cookie
        $('form.language-form').submit();

        // Redirect immediately
        if (selectedLanguage) {
            var newPath;
            if (currentPath === '/') {
                newPath = '/' + selectedLanguage + '/';
            } else {
                newPath = currentPath.replace(/^\/\w+\//, '/' + selectedLanguage + '/');
            }
            window.location.href = newPath;
        }
    });

    $(document).on('click', function () {
        $('.dropdown').removeClass('open');
    });

    $('.dropdown').on('click', function (e) {
        e.stopPropagation();
    });

    $(".addToCartBtn").on("click", function () {
        let cart = $("#showCartBtn");
        let imgtodrag = $(this)
            .closest(".menu-item")
            .find("img")
            .eq(0);

        if (imgtodrag.length) {
            // Check if imgtodrag is a valid jQuery object
            var imgclone = imgtodrag
                .clone()
                .offset({
                    top: imgtodrag.offset().top,
                    left: imgtodrag.offset().left
                })
                .css({
                    opacity: "0.8",
                    position: "absolute",
                    height: "150px",
                    width: "150px",
                    objectFit: "cover",
                    "z-index": "100"
                })
                .appendTo($("body"))
                .animate(
                    {
                        top: cart.offset().top + -40,
                        left: cart.offset().left + 0,
                        width: 55,
                        height: 55
                    },
                    1000,
                    "easeInOutExpo"
                );

            imgclone.animate(
                {
                    width: 0,
                    height: 0
                },
                function () {
                    $(this).detach();
                }
            );
        } else {
            console.error('Image not found.');
        }
    });

    $(".option").click(function () {
        $(".option").removeClass("active");
        $(this).addClass("active");

    });
});



document.addEventListener('DOMContentLoaded', function () {
    var menuItems = [];

    // document.getElementById('cartSidebar').classList.remove('width-full');
    menuItems = Array.from(document.querySelectorAll('.menu-item')).map(function (menuItem) {
        return {
            id: menuItem.getAttribute('data-menu-item-id'),
            name: menuItem.querySelector('.menu-item-title').textContent,
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

            // Show all products in the selected category
            showAllProductsInCategory(categoryName);

            showSubcategories(categoryName);

            // Check if the selected category has ID 2
            if (categoryName === '2') {
                // Show the block with class "business-lunch"
                document.querySelector('.business-lunch').style.display = 'block';
            } else {
                // Hide the block with class "business-lunch" for other categories
                document.querySelector('.business-lunch').style.display = 'none';
            }
        });
    });

    // Function to show all products in the selected category
    function showAllProductsInCategory(categoryName) { //2 aldi categoriya
        // Show only the menu items that belong to the clicked category
        document.querySelectorAll('.menu-item').forEach(function (menuItem) {
            var menuItemCategory = menuItem.getAttribute('data-main-category');
            if (menuItemCategory === categoryName) {
                menuItem.style.display = 'block';
            } else {
                menuItem.style.display = 'none';
            }
        });
    }

    // Function to show subcategories based on the selected category
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
        // console.log('Added to cart:', { itemId, quantity, cart });
        return cart;
    }

    function removeFromCart(itemId) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        delete cart[itemId];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function loadCartData() {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        updateCartCount();
        updateCartDisplay();
    }

    // Load cart data when the page is loaded
    loadCartData();

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
            var clickedCategory = subcategory.getAttribute('data-category');

            // Show only the subcategories that belong to the clicked category
            showSubcategories(clickedCategory);

            // Show only the menu items that belong to the clicked subcategory
            document.querySelectorAll('.menu-item').forEach(function (menuItem) {
                var menuItemCategory = menuItem.getAttribute('data-category'); // Use 'data-category' instead of 'data-subcategory'
                if (menuItemCategory === clickedSubcategory) {
                    menuItem.style.display = 'block';
                } else {
                    menuItem.style.display = 'none';
                }
            });
        });
    });

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
            // var countElement = document.getElementById('count_' + menuItemId);
            // if (!countElement) {
            //     console.error('Count element not found.');
            //     return;
            // }
            var itemCount = 1;
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

    // Telegram send button animation
    let duration = 1600;

    function success(button) {
        // Success function
        $(button).addClass('success');

        // Add your logic to send data here
        if (isDataValid()) {
            sendTelegramData();
        } else {
            alert('Please enter valid data or select a product.');
        }
    }

    function isDataValid() {
        var contactName = document.getElementById('contactName').value;
        var contactSurname = document.getElementById('contactSurname').value;
        var contactNumber = document.getElementById('contactNumber').value;
        var contactAddress = document.getElementById('contactAddress').value;

        // Add additional checks for other required fields if needed
        return contactName.trim() !== '' && contactNumber.trim() !== '';
    }

    function sendTelegramData() {
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
            fetch('/en/send-to-telegram/', {
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
                        alert('Your order is accepted! Our manager will contact you soon :)');
                    } else {
                        alert('The order has not been sent. Contact us by phone (+994)99-876-43-43');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error sending your order :(');
                });

            // Clear the cart
            localStorage.setItem('cart', JSON.stringify({}));
            updateCartDisplay();
        } else {
            console.error('CSRF token not found.');
        }
    }

    $('.button-hold').each(function () {
        $(this).css('--duration', duration + 'ms');

        ['mousedown', 'touchstart', 'keypress'].forEach(function (e) {
            $(this).on(e, function (ev) {
                if (e != 'keypress' || (e == 'keypress' && ev.which == 32 && !$(this).hasClass('process'))) {
                    $(this).addClass('process');
                    this.timeout = setTimeout(success, duration, this);
                }
            }.bind(this));
        }.bind(this));

        ['mouseup', 'mouseout', 'touchend', 'keyup'].forEach(function (e) {
            $(this).on(e, function (ev) {
                if (e != 'keyup' || (e == 'keyup' && ev.which == 32)) {
                    $(this).removeClass('process');
                    clearTimeout(this.timeout);
                }
            }.bind(this));
        }.bind(this));
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
                var itemName = menuItem.querySelector('.menu-item-title').textContent;
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
                padding: { left: '25%', right: '25%' }
            },
            800: {
                perPage: 1,
                padding: { left: '2%', right: '2%' },
                arrows: false
            }
        },
        arrows: true
    }).mount();
    new Splide('#menuSlide1', {
        perPage: 1,
        pagination: false,
        focus: 0,
        fixedWidth: 130,
        isNavigation: false,
        gap: 10,
    }).mount();
    new Splide('#menuSlide2', {
        perPage: 1,
        pagination: false,
        focus: 0,
        fixedWidth: 130,
        isNavigation: false,
        gap: 10,
    }).mount();
    new Splide('#menuSlide3', {
        perPage: 1,
        pagination: false,
        focus: 0,
        fixedWidth: 130,
        isNavigation: false,
        gap: 10,
    }).mount();
    new Splide('#menuSlide4', {
        perPage: 1,
        pagination: false,
        focus: 0,
        fixedWidth: 130,
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

    for (let i = 1; i <= 5; i++) {
        document.getElementById(`lunch-box-${i}`).style.display = 'none';
    }

    var selectedLunchBox = document.getElementById(`lunch-box-${dayNumber}`);
    if (selectedLunchBox) {
        selectedLunchBox.style.display = 'block';
    }

}

function updateImage(imageId, imagePath) {
    var imageElement = document.getElementById(imageId);
    if (imageElement) {
        imageElement.src = imagePath;
    }
}

showLunchBox(1)
updateImage('imgLunch', '/static/assets/soup1.png')