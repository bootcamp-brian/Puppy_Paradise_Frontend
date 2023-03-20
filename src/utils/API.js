const BASE_URL = 'https://puppy-paradise-api.onrender.com/api';

// -- User functions --

// Registers a user
export const registerUser = async ({
    firstName,
    lastName,
    password,
    phone,
    email,
    shippingAddress,
    billingAddress
}) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        // not sure if the body object needs to be setup like it is in loginUser below or not
        body: JSON.stringify({
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            password: `${password}`,
            phone: phone,
            email: `${email}`,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress
        })
    });
    const data = await response.json();
    return data;
}

// Logs in a user
export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: `${email}`,
            password: `${password}`
        })
    });
    const data = await response.json();
    return data;
}

// Removes user from reset password list and updates their password
export const removeResetPassword = async (userId, password) => {
    const response = await fetch(`${BASE_URL}/users/password_reset/${userId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: `${password}`
        })
    });
    const data = await response.json();
    return data;
}

// Gets the logged in user's info
export const getUser = async (token) => {
    const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data;
}

// Edits the logged in user's info
export const editUserInfo = async ({ token, ...fields }) => {
    const response = await fetch(`${BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...fields })
    });
    const data = await response.json();
    return data;
}

// -- Puppies Functions --

// Gets list of puppy categories
export const getPuppyCategories = async () => {
    const response = await fetch(`${BASE_URL}/puppies/categories`, {
        headers: {
          'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    return data;
}

// Gets list of puppies tagged with a certain category
export const getPuppiesByCategory = async (categoryId) => {
    const response = await fetch(`${BASE_URL}/puppies/tagged_puppies/${categoryId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    return data;
}

// Gets a single puppy by id
export const getPuppyById = async (puppyId) => {
    const response = await fetch(`${BASE_URL}/puppies/${puppyId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    return data;
}

// Gets a list of available puppies
export const getAvailablePuppies = async () => {
    const response = await fetch(`${BASE_URL}/puppies`, {
        headers: {
          'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    return data;
}

// -- Orders Functions --

//

// Gets a logged in user's order by the orderId
export const getOrderById = async (token, orderId) => {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data;
}

// Gets a list of the logged in user's orders
export const getOrders = async (token) => {
    const response = await fetch(`${BASE_URL}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data;
}

// Creates a new order for a guest
export const createGuestOrder = async (orderItems, date) => {
    const response = await fetch(`${BASE_URL}/orders/guest`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date,
            orderItems
        })
    });
    const data = await response.json();
    return data;
}

// Creates a new order for logged in user and clears their cart
export const createOrder = async (token, date) => {
    const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            date: `${date}`
        })
    });
    const data = await response.json();
    return data;
}

// -- Cart Functions --

// Gets the logged in user's cart
export const getStripeCheckout = async (checkoutId) => {
    const response = await fetch(`${BASE_URL}/cart/stripe/${checkoutId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

// Gets the logged in user's cart
export const getCart = async (token) => {
    const response = await fetch(`${BASE_URL}/cart`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
}

// Adds an item to the user's cart
export const addItemToCart = async (token, puppyId) => {
    const response = await fetch(`${BASE_URL}/cart/puppies/${puppyId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
}

// Removes an item from user's cart
export const deleteCartItem = async (token, cartItemId) => {
    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
}

// Clears the user's entire cart
export const clearCart = async (token) => {
    const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
}

// -- Admin Functions --

// Lets an admin get a list of users that neeed password resets
export const adminGetAllResetUsers = async (adminToken) => {
    const response = await fetch(`${BASE_URL}/admin/resetUsers`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin get a list of admins
export const adminGetAllAdmins = async (adminToken) => {
    const response = await fetch(`${BASE_URL}/admin`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin get a specific user's info
export const adminGetUserById = async (adminToken, userId) => {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin get a list of inactive users
export const adminGetInactiveUsers = async (adminToken) => {
    const response = await fetch(`${BASE_URL}/admin/users/inactive`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin get a list of all users
export const adminGetAllUsers = async (adminToken) => {
    const response = await fetch(`${BASE_URL}/admin/users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin edit a user's info
export const adminEditUserInfo = async ( adminToken, userId, { ...fields }) => {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ ...fields })
    });
    const data = await response.json();
    return data;
}

// Lets an admin promote another user to an admin
export const adminPromoteToAdmin = async (adminToken, userId) => {
    const response = await fetch(`${BASE_URL}/admin/users/promote/${userId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin set it so that a user has to reset their password
export const adminSetResetPassword = async (adminToken, userId) => {
    const response = await fetch(`${BASE_URL}/admin/users/reset/${userId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin reactivate a user
export const adminReactivateUser = async (adminToken, userId) => {
    const response = await fetch(`${BASE_URL}/admin/users/reactivate/${userId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin set a user to inactive
export const adminDeleteUser = async (adminToken, userId) => {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin get a list of a user's orders
export const adminGetOrdersByUser = async (adminToken, userId) => {
    const response = await fetch(`${BASE_URL}/admin/orders/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin get any single order
export const adminGetOrderById = async (adminToken, orderId) => {
    const response = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin get a list of all orders
export const adminGetAllOrders = async (adminToken) => {
    const response = await fetch(`${BASE_URL}/admin/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin change an order's status
export const adminEditOrderStatus = async (adminToken, orderId, status) => {
    const response = await fetch(`${BASE_URL}/admin/orders/status/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({status})
    });
    const data = await response.json();
    return data;
}

// Lets an view a list of a puppy's categories
export const adminGetCategoriesOfPuppy = async (adminToken, puppyId) => {
    const response = await fetch(`${BASE_URL}/admin/puppies/categories/${puppyId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an view a list of all puppies
export const adminGetAllPuppies = async (adminToken) => {
    const response = await fetch(`${BASE_URL}/admin/puppies`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin create a category for sorting puppies
export const adminCreateCategory = async (adminToken, name) => {
    const response = await fetch(`${BASE_URL}/admin/puppies/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({name})
    });
    const data = await response.json();
    return data;
}

// Lets an admin tag a puppy with a category
export const adminTagPuppy = async (adminToken, categoryId, puppyId) => {
    const response = await fetch(`${BASE_URL}/admin/puppies/tagged_puppies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
            categoryId,
            puppyId
        })
    });
    const data = await response.json();
    return data;
}

// Lets an admin create a puppy entry
export const adminCreatePuppy = async (adminToken, {
    name,
    description,
    age,
    breed,
    weight,
    size,
    pedigree,
    isVaccinated,
    isAltered,
    gender,
    isAvailable,
    price
}) => {
    const response = await fetch(`${BASE_URL}/admin/puppies/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
            name,
            description,
            age,
            breed,
            weight,
            size,
            pedigree,
            isVaccinated,
            isAltered,
            gender,
            isAvailable,
            price
        })
    });
    const data = await response.json();
    return data;
}

// Lets an admin change an order's status
export const adminEditPuppyInfo = async (adminToken, puppyId, {...fields}) => {
    const response = await fetch(`${BASE_URL}/admin/puppies/${puppyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ ...fields })
    });
    const data = await response.json();
    return data;
}

// Lets an admin delete a category
export const adminDeleteCategory = async (adminToken, categoryId) => {
    const response = await fetch(`${BASE_URL}/admin/puppies/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin remove a puppy from a category
export const adminRemovePuppyFromCategory = async (adminToken, puppyId, categoryId) => {
    const response = await fetch(`${BASE_URL}/admin/puppies/tagged_puppies/${puppyId}/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Lets an admin remove a puppy from the storefront
export const adminRemovePuppy = async (adminToken, puppyId) => {
    const response = await fetch(`${BASE_URL}/admin/puppies/${puppyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
    });
    const data = await response.json();
    return data;
}

// Stripe function
export const stripeCheckoutSession = async (cartItems) => {
    const response = await fetch(`${BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cartItems
        })
    });
    const data = await response.json();
    return data;
}