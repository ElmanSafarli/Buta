from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from .models import Category, Subcategory, MenuItem, Review
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from .forms import ReviewForm
from django.views import View
class HomePage(TemplateView):
    template_name = 'pages/home.html'

    def get(self, request, *args, **kwargs):
        reviews = Review.objects.all()
        form = ReviewForm()
        return render(request, self.template_name, {'reviews': reviews, 'form': form})

    def post(self, request, *args, **kwargs):
        form = ReviewForm(request.POST)
        if form.is_valid():
            # Assuming you have a Review model
            Review.objects.create(
                full_name=form.cleaned_data['full_name'],
                email=form.cleaned_data['email'],
                text=form.cleaned_data['text']
            )
            return redirect('home')  # Redirect to the same page after submission
        return render(request, self.template_name, {'form': form})


class MenuPage(TemplateView):
    template_name = 'pages/menu.html'

    def get_context_data(self, **kwargs):
        # Retrieve all categories, subcategories, and menu items
        categories = Category.objects.all()
        subcategories = Subcategory.objects.all()
        menu_items = MenuItem.objects.all()

        # Pass the data to the template context
        context = {
            'categories': categories,
            'subcategories': subcategories,
            'menu_items': menu_items,
        }

        return context

@csrf_exempt
def send_to_telegram_view(request):
    if request.method == 'POST':
        try:
            received_data = json.loads(request.body)
            cart_data = received_data.get('cart', [])
            contact_details = received_data.get('contact', {})

            # Prepare the message for Telegram
            message = f"New Order Details:\n\nContact Information:\nName: {contact_details.get('name')}\nSurname: {contact_details.get('surname')}\nNumber: {contact_details.get('number')}\nAddress: {contact_details.get('address')}\n\nOrdered Items:\n"
            total_price = 0

            for item in cart_data:
                # Assuming each item in the cart_data is a dictionary with keys 'id' and 'quantity'
                item_id = item['id']
                quantity = item['quantity']

                # Fetch product details from your database based on item_id
                # For simplicity, I'm assuming you have a model named MenuItem
                menu_item = MenuItem.objects.get(pk=item_id)

                # Update message and total price
                message += f"{menu_item.name} - Quantity: {quantity}, Price: {menu_item.price * int(quantity)} ₼\n"
                total_price += menu_item.price * int(quantity)

            # Add total price to the message
            message += f"\nTotal Price: {total_price} ₼"

            # Send message to Telegram
            send_to_telegram(message)

            # Clear the shopping cart after placing the order
            # You might need to adapt this depending on how you manage your cart
            # This is just an example assuming you store the cart in the session
            request.session['cart'] = {}

            return JsonResponse({'status': 'success'})
        except Exception as e:
            print(f'Error processing the order: {str(e)}')  # Debug print
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})



def send_to_telegram(message):
    bot_token = '6781566989:AAFLLA_4c1yr9T1WPbhZzr3dUVxyqrH0ojI'
    chat_id = '-1002109808216'

    telegram_api_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    params = {
        'chat_id': chat_id,
        'text': message,
    }

    response = requests.post(telegram_api_url, params=params)

    if response.status_code != 200:
        print(f"Failed to send message to Telegram. Status code: {response.status_code}")