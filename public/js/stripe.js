/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51GsCwlJIO0ERPhyTStQFjSvJzy7PF7G8FvfaMkBsX2FNu9ToBI7Pf1UbyJ5SsqhURWlSJM9ndjBt4z8pdZ14zJvH00YHC7ebGf'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      // `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log('errroooooorrr', tourId);
    console.log(err);
    showAlert('error', err);
  }
};
