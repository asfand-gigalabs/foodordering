import 'react-native-url-polyfill/auto'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { stripe } from './stripe.ts';
import { SUPABASE_URL, SUPABASE_KEY } from '@env';

export const createOrRetrieveProfile = async (req: Request) => {
  const supabaseClient = createClient(
    SUPABASE_URL ?? '',
    SUPABASE_KEY?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );
  // const supabaseClient = createClient(
  //   process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  //   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  //   {
  //     auth: {
  //       storage: AsyncStorage,
  //       autoRefreshToken: true,
  //       persistSession: true,
  //       detectSessionInUrl: false,
  //     },
  //   })
  
  // Now we can get the session or user object
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) throw new Error('No user found');

  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error || !profile) {
    throw new Error('Profile not found');
  }

  console.log(profile);
  if (profile.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // Create a Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { uid: user.id },
  });

  await supabaseClient
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', profile.id);

  return customer.id;
};
